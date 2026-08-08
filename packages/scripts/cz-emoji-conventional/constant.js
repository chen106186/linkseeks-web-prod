'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.types = void 0
exports.types = {
  feat: {
    description: '业务上的新功能',
    title: 'Features',
    emoji: '✨',
  },
  fix: {
    description: '业务上的bug修复',
    title: 'Bug Fixes',
    emoji: '🐛',
  },
  packages: {
    description: '在packages目录下的新功能/bug修复',
    title: '@linkseeks/xxx相关包的变更',
    emoji: '✨',
  },
  public: {
    description: '在public目录下的新功能/bug修复',
    title: '@apps/xxx相关包的变更',
    emoji: '✨',
  },
  major: {
    description: '重大破坏性变更',
    title: '通常用于某些组件/API的变化导致以前写法不一致',
    emoji: '📦',
  },
  docs: {
    description: '文档类型的改变',
    title: 'Documentation',
    emoji: '📝',
    hidden: true,
  },
  style: {
    description: '代码样式的改变-注意这里包括代码的空格缩进之类的',
    title: 'Styles',
    emoji: '💎',
    hidden: true,
  },
  refactor: {
    description: '既不修复bug也不是新功能，单纯代码重写',
    title: 'Code Refactoring',
    emoji: '♻️',
    hidden: true,
  },
  perf: {
    description: '对代码性能的提升',
    title: 'Performance Improvements',
    emoji: '📈',
    hidden: true,
  },
  test: {
    description: '添加测试用例',
    title: 'Tests',
    emoji: '🧪',
    hidden: true,
  },
  build: {
    description: '影响构建系统或外部依赖关系的更改（例如作用域：pnpm）',
    title: 'Builds',
    emoji: '🏗️',
    hidden: true,
  },
  ci: {
    description: '对自动化工具的修改',
    title: 'Continuous Integrations',
    emoji: '📦',
    hidden: true,
  },
  chore: {
    description: '一些不属于src下面的修改，或者不属于测试文件的修改',
    title: 'Chores',
    emoji: '🧹',
    hidden: true,
  },
  revert: {
    description: '回退上一次请求',
    title: 'Reverts',
    emoji: '⏪️',
    hidden: true,
  },
  merge: {
    description: '代码的手动合并',
    title: 'merge',
    emoji: '⏪️',
    hidden: true,
  },
}
