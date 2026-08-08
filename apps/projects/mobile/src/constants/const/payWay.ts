/**
 * 以下都是根据WayId 分类
 */
/**
 * 积分支付 = 0
 */
export const Integralpay = 0;
/**
 * 支付宝 = 1
 */
export const Alipay = 1;
/**
 * 微信支付 = 2
 */
export const WechatPay = 2;
/**
 * 银联支付 = 3
 */
export const UnionPay = 3;
/**
 * 余额支付 = 4
 */
export const BalancePay = 4;
/**
 * 线下支付, 线上确认 = 5
 */
export const OfflinePay = 5;
/**
 * 授信支付 = 6
 */
export const CreditPay = 6;
/**
 * 货到付款 = 7
 */
export const CashOnDelivery = 7;

export const PAY_WAY: { [key: string]: any } = {
  [Integralpay]: "积分支付",
  [Alipay]: "支付宝",
  [WechatPay]: "微信支付",
  [UnionPay]: "银联支付",
  [BalancePay]: "余额支付",
  [OfflinePay]: "线下支付，线上确认",
  [CreditPay]: "授信支付",
  [CashOnDelivery]: "货到付款",
}
