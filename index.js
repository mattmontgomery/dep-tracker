const { repos, token, whitelist = [] } = require("./config.js");
const Octokit = require("@octokit/rest");
const { atob } = require("Base64");

function checkWhitelist(whitelist = [], packageName) {
  return whitelist.length
    ? whitelist.some(p =>
        typeof p === "string" ? p === packageName : p.test(packageName)
      )
    : true;
}

(async () => {
  const octokit = new Octokit({
    auth: token
  });
  const allDeps = {};
  await Promise.all(
    repos.map(async ({ owner, repo, path }) => {
      try {
        const { data } = await octokit.repos.getContents({
          owner,
          repo,
          path
        });
        if (data.content) {
          let packageContents;
          packageContents = JSON.parse(
            atob(data.content.replace(`\n`, ""))
              .replace(/\u0010/g, "")
              .replace(`\n@`, "")
          );
          if (!packageContents.dependencies) {
            return;
          }
          Object.keys(packageContents.dependencies).forEach(k => {
            if (!checkWhitelist(whitelist, k)) {
              return;
            }
            if (!allDeps[k]) {
              allDeps[k] = {};
            }
            allDeps[k][`${owner}/${repo}`] = packageContents.dependencies[k];
          });
        } else {
          console.log(data);
        }
      } catch (e) {
        if (e.request) {
          console.error(`Not found ${e.request.url}`);
        } else {
          console.error(e);
        }
      }
      return true;
    })
  );
  const final = Object.keys(allDeps)
    .sort()
    .reduce(
      (acc, d) => ({
        ...acc,
        [d]: allDeps[d]
      }),
      {}
    );
  console.table(final, [...repos.map(a => `${a.owner}/${a.repo}`)]);
})();
