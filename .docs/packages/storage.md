# Storage - 储存

在所有项目中，经常会做一些数据的储存，目前我们支持 localStorage 和 sessionStorage，以及 cookie

在此做了一些简单的兼容性封装

> 特别注意，PC 商城(mall)，与能力中心(platform)，其实是通过一个登录状态来控制的，为了达到数据共享，这里我们利用了 **主域相同则 cookie 共享的机制**。

## 如何使用

在项目中，我们使用频率最高的就是如何获取到用户登录信息

1. 在 platform，admin，mall 项目中，我们可以通过引入 `/apps/public/services/auth` 的 useAuth 方法来获取到用户信息
2. 在 mobile 项目中，可以通过 `getStorageSync(USER_INFO)` 来获取
