# UI - UI 组件库

目前我们是基于 antd 做的组件库，在该库中我们只对 antd 的组件进行包装，并不加入任何业务逻辑，如果需要了解业务组件的封装可以查看 `apps/public/components` 目录下的组件。

## 如何使用

直接引入 `@linkseeks/ui`即可

## 如何更换主题

在 `packages/ui/src/styles/` 中，有两个目录

1. antd - 这里面的 less 变量对应着 antd 组件本身的主题变量，具体可以查看[antd 变量文档](https://github.com/ant-design/ant-design/blob/4.x-stable/components/style/themes/default.less)，如果需要改一些全局性的样式，直接修改这个文件即可
2. theme - 这里面的 less 变量就是我们系统自行定义的主题变量
