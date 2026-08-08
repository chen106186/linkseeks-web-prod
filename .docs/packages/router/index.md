# Router - 路由

路由可以说是我们系统中比较有特色的一个模块，在普通开发中，通常我们需要定义一个很长的路由配置表，然后在页面中通过路由配置表来渲染页面。

实际上这种方式在影响着我们的开发效率，于是我们实现了一个约定式路由

> **注意该模块只影响到 admin(平台后台)，platform(能力中心)项目，其他项目不影响**

## 如何使用

假设我们需要创建一个登录页，一个注册页，分别是/user/login 和/user/register，我们可以这样定义：

- src
  - pages
    - user
      - login
        - view.tsx
        - page.config.ts
      - register
        - view.tsx
        - page.config.ts

此时我们将得到两个路由：

- /user/login
- /user/register

上面的例子中，我们定义了一个`page.config.ts`文件，该文件用于定义路由的配置信息(但其实目前作用不大)

view.tsx 文件用于识别成路由文件

目前我们支持四种文件类型：

- view.tsx
- add.tsx
- edit.tsx
- detail.tsx

其中 view.tsx 会被 replace 掉 view 这一层级，其他的文件会被保留

例如

1. user/login/view.tsx -> /user/login
2. user/login/add.tsx -> /user/login/add
3. user/login/edit.tsx -> /user/login/edit
4. user/login/detail.tsx -> /user/login/detail

## 实现原理

通过 vite 中的`import.meta.glob`来实现。该方法会自动扫描指定目录下的文件，并返回一个对象，对象的 key 为文件的路径，value 为文件的内容。

其中关键的实现逻辑在`src/packages/router/core`中

## 常见问题

- 如何缓存路由(类似 vue 中的 keep-alive)?

  只需在对应路由的 page.config.ts 中添加 cache: true 即可

- 如何搭配权限控制？

  请参考[权限控制](./auth.md)

- 为什么本地新建好了文件，页面上无法显示

  请参考[权限控制](./auth.md)
