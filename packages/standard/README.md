# standard

瓴犀规范配置工具集合， 内置 prettier eslint

使用方式

`yarn add @linkseeks/standard`

### prettier

新建`.prettierrc.js`

```js
module.exports = require("@linkseeks/standard").prettier;
```

### eslint

新建`.eslintrc.js`

```js
module.exports = {
  extends: [require.resolve('@linkseeks/standard/dist/eslint')
};
```

### 使用 cli

安装完成后，可在 package.json 中配置 scripts —— `standard -h`, 运行即可看到支持的命令

### 核心命令

`standard init`
将会初始化瓴犀前端所使用的各种工具

- husky —— 管理 git 提交 hook
- cz —— 管理 commit 提交信息步骤
- commitlint —— 管理 commit msg 的规范性
- lint-staged —— 对 commit 提交的文件做筛选

**请务必使用 git cz 代替原来的 git commit，否则将无法提交代码**

这是各个配置的基础文件，包含 eslint, prettier, stylelint 等， 通过该文件 我们做到所有项目统一配置化，其中
husky 依赖包 将更好的管理我们 git 提交时所触发的 hook，例如 pre-commit, commit-msg 等
commitizen 依赖 也就是 git cz 执行的时候，能很好的管理我们 commit 时所触发的步骤，通过命令行询问的形式创建自己想要的格式
commitlint 依赖 对 commit msg 做一次校验， 因为尽管我们强调需要 git cz， 但也有可能有人直接绕过它试图提交
lint-staged 依赖 对每一次 commit 中的暂存区文件做一次命令执行，比如 eslint --fix prettier --write 等， 能更好的处理我们想处理的文件 而不是每次都整个项目都处理
所以现在你的提交流程会变成 git cz 时 进行 commit 筛选， 筛选完成后 检查暂存区的文件是否是我们需要校验的文件(ts,tsx,js,jsx 这种) 如果是，则执行 eslint prettier 的修复功能 并且自动 add 添加到我们的暂存区，同时开始 commit lint 校验，检查我们的 commit msg 是否是正常的， 一切都通过后，则可以 push
但注意目前有个缺陷是，如果 commit 的时候 填了一堆东西 结果最后 校验失败了， 就会直接回到原状， 得再次重新填写 msg。 这个得后续想办法解决
