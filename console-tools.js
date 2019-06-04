module.exports.Color = class Color {
  constructor() {
    this.formatCodes = {
      reset: [0, 0],

      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    };
    this.colorCodes = {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39],
      grey: [90, 39],

      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49]
    };
  }
  static make(...args) {
    return new Color().make(...args);
  }
  getFormatting(str) {
    let bright = false;
    let sections = str.split("-");
    let format = [];
    if (~sections.indexOf("bright")) {
      bright = true;
      sections = sections.filter(i => i !== "bright");
    }
    sections = sections.filter(s => {
      if (s in this.formatCodes) {
        format = this.formatCodes[s];
        return false;
      }
      return true;
    });
    return {
      colorStart: this.getStart(sections[0], bright),
      colorEnd: this.getClear(sections[0], bright),
      formatStart: format.length === 2 ? `${format[0]}m` : null,
      formatEnd: format.length === 2 ? `${format[1]}m` : null
    };
  }
  getStart(color = "", bright) {
    return this.colorCodes[color]
      ? `${this.colorCodes[color][0]}${bright ? ";1" : ""}m`
      : "0m";
  }
  getClear(color = "", bright) {
    if (color.startsWith("bg")) {
      return `49m`;
    } else {
      return `39;0m`;
    }
  }
  make(text, format) {
    const formatting = this.getFormatting(format);
    return `${
      formatting.formatStart ? `\u001b[${formatting.formatStart}` : ""
    }${formatting.colorStart ? `\u001b[${formatting.colorStart}` : ""}${text}${
      formatting.colorEnd ? `\u001b[${formatting.colorEnd}` : ""
    }${formatting.formatEnd ? `\u001b[${formatting.formatEnd}` : ""}`;
  }
};
