export enum PayWayType {
  point = 10, // 积分支付
  balance = 4, // 余额支付
  delivery = 7, // 货到付款
  credit = 6, // 征信支付
  wechat = 2, // 微信支付
  alipay = 1, // 支付宝支付
  transfer = 5, // 转账
  bank = 3, // 银联
  allInPayAliPay = 12, // 通联-支付宝
  allInPayWechat = 11, // 通联-微信
  allInPayQuick = 13, // 通联-快捷支付
  allInPayBank = 14, // 通联-网银支付
  allInPayBalance = 15, // 通联-余额
  ccbBank = 16, // 建行支付 -b2b支付
  ccbDigit = 17, // 建行支付 - 数字人民币支付
  crossBorder = 18, // 跨境支付
}
