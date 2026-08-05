## god-template

### 为&醒电构建项目提供 react 脚手架模板

- god 页面模板， 依赖于[umi](https://umijs.org/), 更多配置可以查看
- god 组件库[文档](http://10.0.0.22:8080/)

### 项目运行请先执行 scripts:build

可获取项目所需配置, 在/src/constants/cacheConfig.ts

### 全局引入的文件

- /src/global
  - /styles/theme.less 默认可使用其中的 less 变量
  - /config/index.ts 全局变量配置文件

### scripts 所需依赖

- gulp 流程工具
- chalk 控制台样式控制工具
- fs-extra 扩展 fs 模块
- ora 控制台加载中样式

### AuthButton 按钮权限组建

pass 层配置 按钮唯一唯一表示 那个页面需要按钮权限 在对应按钮加上一个 btnCode 而后子角色分配 在系统设置角色管理哪里 <AuthButton btnCode='infomations.edit' > <Menu.Item> <Link to={`/contentAbility/infomations/detail?id=${record.id}`}> {intl.formatMessage({ id: 'common.button.edit' })} </Link> </Menu.Item> </AuthButton>

## 开发注意事项

1. 样式

- 全局样式需写在 src/global/global.less 下， 涉及到 color， size 之类的属性尽量变量化 并且储存在/styles/theme.less 中

"umi-plugin-antd-theme": "^2.1.2"
