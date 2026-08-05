/** @format */

module.exports = {
  // 使用单引号
  singleQuote: true,
  // 尽可能的使用尾随逗号 包含参数调用，对象，数组，以及类型参数等
  trailingComma: "all",
  // 单行的最大宽度
  printWidth: 100,
  // 将散文保持原样
  proseWrap: "never",
  // 换行
  endOfLine: "lf",
  // tab空格数
  tabWidth: 2,
  // 仅在可能导致语句失败的情况下加分号
  semi: false,
  // 箭头函数始终包括括号
  arrowParens: "always",
  overrides: [
    // 让prettier格式化自己
    {
      files: ".prettierrc",
      options: {
        parser: "json",
      },
    },
    {
      files: "document.ejs",
      options: {
        parser: "html",
      },
    },
  ],
};
