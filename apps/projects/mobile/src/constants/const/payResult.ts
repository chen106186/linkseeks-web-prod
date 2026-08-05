/**
 * 跳转 payResult 的来源类型
 */
export enum SOURCE_TYPE {
  ORDER = 'ORDER', // 订单
  BIZ_USER = 'BIZ_USER', // e 账户
  USER = 'USER', // 余额账户
}

/**
 * 支付类型标识
 */
export enum PAY_TYPE {
  WECHATPAY_MINIPROGRAM_ORG = 'WECHATPAY_MINIPROGRAM_ORG', // 小程序微信支付（小程序环境表示基础的微信支付和通联微信支付，H5只表示通联的微信支付）
  WECHATPAY_H5_OPEN = 'WECHATPAY_H5_OPEN', // 微信H5支付（仅在H5生效）
  SCAN_ALIPAY = 'SCAN_ALIPAY', // 支付宝支付（仅在H5生效且表示通联支付宝支付）
  QUICKPAY_VSP = 'QUICKPAY_VSP', // 快捷支付
  WECHATPAY_MINIPROGRAM_CASHIER_VSP_ORG = 'WECHATPAY_MINIPROGRAM_CASHIER_VSP_ORG',
}
