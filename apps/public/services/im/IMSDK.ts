import TencentCloudChat from '@tencentcloud/chat'

let options = {
  SDKAppID: 1600055733, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
}
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
export const chat = TencentCloudChat.create(options) // SDK 实例通常用 chat 表示

chat.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
