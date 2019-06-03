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
          try {
            packageContents = JSON.parse(
              atob(data.content.replace(/\n/gi, ""))
                .replace(/\u0010/g, "")
                .replace(`\n@`, "")
            );
          } catch (e) {
            throw `Could not parse ${owner}/${repo}::${path}`;
          }
          if (!packageContents.dependencies) {
            console.log(
              `No dependencies were found in ${owner}/${repo}::${path}`
            );
            return;
          }
          const theseDeps = {
            ...packageContents.dependencies,
            ...packageContents.devDependencies
          };
          Object.keys(theseDeps).forEach(k => {
            if (!checkWhitelist(whitelist, k)) {
              return;
            }
            if (!allDeps[k]) {
              allDeps[k] = {};
            }
            allDeps[k][`${owner}/${repo}`] = theseDeps[k];
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
