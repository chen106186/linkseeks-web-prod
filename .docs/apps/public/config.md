# 全局环境变量

项目中我们目前通过这里来区分不同环境

- dev: 开发环境
- test: 测试环境
- uat: 预发布环境
- prod: 生产环境

## 支持的变量

- BACK_GATEWAY: 后端网关地址
- YAPI_REQUEST_BACK_GATEWAY: yapi 请求的 OPENAPI 网关地址
- SOCKET_URL: socket 地址
- SITE_URL: 站点地址，这个主要用于 PC 商城端相关的逻辑
- MEMBER_URL: 能力中心地址，用于商城回跳到能力中心进行登录
- REQUEST_HEADER: 请求头，用于区分请求的协议，如 http、https
- GROUP_BUY_H5: 拼团 H5 地址，用于拼团 H5 的跳转（暂时没什么作用）
- IM_URL: IM 地址，用于 IM 的客服跳转链接

## 如何切换环境

在 `apps/public/config/index.js` 中，变更 `DEFAULT_ENV_TYPE` 变量，随后重新启动项目即可
