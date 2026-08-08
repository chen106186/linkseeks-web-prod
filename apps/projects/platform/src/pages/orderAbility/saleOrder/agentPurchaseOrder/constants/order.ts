export enum ORDER_TYPE {
  /** 普通现货订单 */
  normal = 'normal',
  /** 积分订单  */
  integral = 'integral',
  /** 拼团订单 */
  group = 'group',
}

/* --------------------------------- 配送方式 -------------------------------- */
/**
 * 物流
 */
export const DELIVERY_TYPE_LOGISTICS = 1
/**
 * 自提
 */
export const DELIVERY_TYPE_SELF_PICKUP = 2
/**
 * 无须配送
 */
export const DELIVERY_TYPE_NO_DELIVERY = 3
/**
 * 物流+自提
 */
export const DELIVERY_TYPE_LOGISTICS_AND_SELF = 4
