# api 能力

是所有终端调用接口的基座

## yapi 接口转化成 ts

1. 通过`/manage/deploy/yapi/token/list`接口拿到所有服务的信息

2. 执行 yapi 插件，插件源码在`packages/core/yapi2ts`中

3. 此时会生成一份 token 文件 yapiToken.json, 里面包含了服务名和 token，以及关键字段 needUpdate， 当 needUpdate 为 true 时代表，该服务会被重新拉取接口

4. needUpdate 字段是根据后端是否对该服务下发生过接口相关的变更来决定的

5. 若出现异常需要强制更新，则传入环境变量 forceUpdateYapi = 1，即可强制更新所有服务
