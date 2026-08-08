/** @format */

const eslint = require("./eslint.ts");
const stylelint = require("./stylelint.ts");
const prettier = require("./prettier.ts");
const czRule = require("./cz-rule/index.ts");

module.exports = {
  stylelint,
  prettier,
  eslint,
  czRule,
  default: eslint,
};
