# 接口管理 - @apps/apis

目前我们所有的项目都是共用一套后端接口，所以我们统一从 yapi 请求回来的接口，生成 ts 代码在 apis/src/services 中

## 如何使用

生成出来的代码满足

- 文件名为后端微服务对应的名称 如 api-订单服务 -> 指的是后端的微服务名称
- 每个服务下的 id[数字].ts， 代表对应 yapi 的服务分类 id
- 点击每个数字 id 文件，可以看到对应的接口，每个接口都有对应的注释，方便开发
- 生成规则按照请求类型 + url 驼峰命名，如 get 请求 /order/list -> getOrderList

由于不同端可能请求的方式不同，所以我们参照 taro 的多端写法，以后缀名区分

- request.weapp.ts - 微信小程序
- request.h5.ts - h5
- request.mall.ts - PC 商城
- request.web.ts - 能力中心、平台后台

同时为了满足开发时请求的路径统一，开发了一个 vite 插件，`@apps/utils/vitePlugin/terminalImportPlugin` 该插件会将

```ts
import { getOrderList } from '@apps/apis'

// 在mall中实际上是
import { getOrderList } from '@apps/apis/request.mall'

// ...
```

## 工作原理

1. 在运行 pnpm api 命令时，会先调用 pullYapiToken.js 中的方法，获取到当前环境 yapi 的后端服务 token(此处 token 是唯一的)
2. 使用 token 分别调用 yapi OpenAPI 的接口，拿到元数据，进行生成代码

## 常见问题

- 构建时，或者本地运行时出现接口找不到

  - 请检查是否已经执行了 pnpm api 命令，生成了代码，或者后端是否已经上传了接口到 yapi 上

- 获取 yapi 的 token 失败
  - 请检查是否已经配置了 yapi 的后端服务地址，以及是否已经配置了 yapi 的后端服务 token
