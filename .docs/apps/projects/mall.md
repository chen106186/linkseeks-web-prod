# PC 端商城 - @apps/mall

## 目录结构

- mall
  - config - 路由配置
  - src
    - assets - 静态资源
    - components - 功能组件
    - constants - 全局常量
    - context - 上下文
    - hooks - 自定义 hooks
    - layouts - 布局组件
    - loaders - router loaders
    - pages - 页面组件
    - services - 服务端接口
    - utils - 工具函数

## SSR 实现方案

1. 使用了 vite 中的 ssr 功能，实现了服务端渲染
2. 使用了 express 框架，实现了路由和静态资源服务器
3. 使用了 react-router 中的 loader 功能，实现了路由数据预加载

### package.json 核心依赖

```
"react": "18.3.1",
"react-dom": "18.3.1",
"vite": "6.1.1",
"@vitejs/plugin-react-swc": "^3.5.0",
"express": "^4.18.2"
```

### 使用了服务端渲染数据的页面

- 全局初始数据的加载（商城数据和商城装修数据）
- 各商城首页
- 商城商品详情页
- 商品列表
- 关于我们页面

### 如何使用了服务端渲染数据

1. 在路由配置中（config），添加对应 loader
2. 在 loader 中，调用服务端接口获取数据
3. 在页面组件中，使用 useLoaderData 获取数据

### 如何配置页面 SEO

#### 如果是需要动态获取 seo 配置，则可以在 loader 中请求对应的 seo 配置数据，然后在页面使用 useLoaderData 获取 seo 数据

1. 页面引入 SEO 组件

```
import HelmetProvider from '@/context/helmetProvider'
```

2. 在页面组件中，使用 SEO 组件，并配置对应的属性

```
<HelmetProvider
	title=''
	description=''
	keywords=''
/>
```
