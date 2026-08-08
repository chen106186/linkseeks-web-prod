/**
 * 询价采购
 */
export const ORDER_TYPE_INQUIRY = 1;
/**
 * 需求采购
 */
export const ORDER_TYPE_DEMAND = 2;
/**
 * 现货采购
 */
export const ORDER_TYPE_STOCK = 3;
/**
 * 集采
 */
export const ORDER_TYPE_CENTRALIZED = 4;
/**
 * 渠道直采
 */
export const ORDER_TYPE_CHANNEL_DIRECT = 5;
/**
 * 渠道现货
 */
export const ORDER_TYPE_CHANNEL_STOCK = 6;
/**
 * 积分兑换
 */
export const ORDER_TYPE_POINTS = 7;
/**
 * 渠道积分兑换
 */
export const ORDER_TYPE_CHANNEL_POINTS = 8;

// 采购订单类型
export const ORDER_TYPE: { [key: string]: string | number } = {
  [ORDER_TYPE_INQUIRY]: '询价采购',
  [ORDER_TYPE_DEMAND]: '需求采购',
  [ORDER_TYPE_STOCK]: '现货采购',
  [ORDER_TYPE_CENTRALIZED]: '集采',
  [ORDER_TYPE_CHANNEL_DIRECT]: '渠道直采',
  [ORDER_TYPE_CHANNEL_STOCK]: '渠道现货',
  [ORDER_TYPE_POINTS]: '积分兑换',
  [ORDER_TYPE_CHANNEL_POINTS]: '渠道积分兑换',
}

// 支付状态
export const PAYINFO_STATE: { [key: string]: { [key: string]: string } } = {
  1: { status: 'processing', name: '待支付' },
  2: { status: 'warning', name: '待确认支付结果' },
  3: { status: 'success', name: '确认到账' },
  4: { status: 'error', name: '确认未到账' },
}

// 支付方式
export const PAYWAY_STATE: { [key: number]: string } = {
  1: '线上支付',
  2: '线下支付',
  3: '授信支付',
  4: '货到付款',
}

// 配送方式
export const DELIVERY_TYPE: { [key: number]: string } = {
  1: '物流',
  2: '自提',
  3: '无需配送',
}

// 采购订单外部工作流状态
export const PurchaseOrderOutWorkState: { [key: string]: number | string } = {

  /**
   *  取消订单
   */
  CANCEL_ORDER: -1,

  /**
   *  提交订单
   */
  SUBMIT_ORDER: 1,

  /**
   *  确认订单
   */
  CONFIRM_ORDER: 2,

  /**
   *  确认电子合同
   */
  CONFIRM_ELECTRONIC: 3,

  /**
   *  订单支付
   */
  PAY_ORDER: 4,

  /**
   *  确认支付结果
   */
  CONFIRM_PAY_RESULT: 5,

  /**
   *  新增销售发货单
   */
  ADD_SALE_INVOICE_ORDER: 6,

  /**
   *  新增物流单
   */
  ADD_LOGISTICS_ORDER: 7,

  /**
   *  订单发货确认
   */
  CONFIRM_DELIVERY_ORDER: 8,

  /**
   *  新增采购入库单
   */
  ADD_PURCHASE_STOCK_ORDER: 9,

  /**
   *  订单收货确认
   */
  CONFIRM_RECEIPT_ORDER: 10,

  /**
  *  确认回单
  */
  CONFIRM_RECEIPT: 11,

  /**
   *  订单归档供应商
   */
  FILING_SUPPLIER_ORDER: 12,

  /**
   *  订单归档采购商
   */
  FILING_BUYER_ORDER: 13,

  /**
   *  完成订单
   */
  FINISH_ORDER: 14,

  /**
   *  不接受订单
   */
  NOT_ACCEPTED_ORDER: 20,

  /**
   *  确认没到账
   */
  CONFIRM_NOT_ARRIVED_ACCOUNT: 21,

  /**
   *  货品数量还没有全部发货重新发货
   */
  PRODUCT_ACOUNT_NOT_SEND: 22,

  /**
   *  待支付尾款
   */
  NOT_PAYMENT_FINAL: 23,

  /**
   *  待确认支付结果
   */
  NOT_CONFIRM_PAYMENT_RESULT: 24,

  /**
   *  确认未到账
   */
  CONFIRM_WITHOUT_ARRIVED_ACCOUNT: 25,
}

// 采购订单内部工作流状态
export const PurchaseOrderInsideWorkState: { [key: string]: number | string } = {

  /**
   *  取消订单
   */
  CANCEL_ORDER: '-1',

  /**
   *  新增采购订单
   */
  ADD_PURCHASE_ORDER: 1,

  /**
   *  一级审核订单
   */
  ONE_LEVEL_AUDIT_ORDER: 2,

  /**
   *  二级审核订单
   */
  TWO_LEVEL_AUDIT_ORDER: 3,

  /**
   *  提交订单
   */
  SUBMIT_ORDER: 4,

  /**
   *  待确认电子合同
   */
  SUBMIT_FINISH_ORDER: 5,

  /**
   *  提交一级审核订单不通过
   */
  ONE_LEVEL_AUDIT_ORDER_NOT_ALLOWED: 6,

  /**
   *  提交二级审核订单不通过
   */
  TWO_LEVEL_AUDIT_ORDER_NOT_ALLOWED: 7,

  /**
   *  待支付订单
   */
  CONFIRM_ELECTRONIC: 8,

  /**
   *  支付成功
   */
  PAY_SUCCESS: 10,

  /**
   *  支付失败
   */
  PAY_ERROR: 11,

  /**
   *  待确认收货
   */
  CONFIRM_RECEIPT: 12,

  /**
   *  待新增入库订单
   */
  WAREHOUSE_ORDER: 14,

  /**
   *  订单归档
   */
  FILLING_ORDER: 15,

  /**
   * 待审核入库订单
   */
  READY_WAREHOUSE_APPROVED_ORDER: 16,

  /**
   * 手工收货
   */
  HAND_RECEIPT_ORDER: 17,
}

// 采购订单内部状态
export const INTERIOR_STATE: { [key: string]: any } = {
  "-1": { color: 'gray', name: '取消订单' },
  0: { color: 'green', name: '订单完成' },
  1: { color: 'blue', name: '待新增采购订单' },
  2: { color: 'yellow', name: '待审核订单(一级)' },
  3: { color: 'yellow', name: '待审核订单(二级)' },
  4: { color: 'blue', name: '待提交订单' },
  5: { color: 'green', name: '审核通过' },
  6: { color: 'red', name: '审核不通过(一级)' },
  7: { color: 'red', name: '审核不通过(二级)' },
  8: { color: 'blue', name: '待支付订单' },
  10: { color: 'green', name: '支付成功' },
  11: { color: 'red', name: '支付失败' },
  12: { color: 'blue', name: '待确认收货' },
  14: { color: 'yellow', name: '订单待入库' },
  15: { color: 'yellow', name: '订单待归档' },
  16: { color: 'yellow', name: '订单入库待审核' },
  17: { color: 'blue', name: '待手工收货' },
  18: { color: 'green', name: '已确认收货' },
  19: { color: 'green', name: '已归档' },
  20: { color: 'yellow', name: '待确认电子合同' },
  null: { color: 'gray', name: '暂无状态' },
}

// 采购订单外部状态
export const EXTERNAL_STATE: { [key: string]: any } = {
  "-1": { color: 'gray', name: '取消订单' },
  1: { color: 'yellow', name: '待提交订单' },
  2: { color: 'yellow', name: '待确认订单' },
  3: { color: 'yellow', name: '待确认电子合同' },
  4: { color: 'yellow', name: '待订单支付' },
  5: { color: 'yellow', name: '待确认支付结果' },
  6: { color: 'yellow', name: '待新增销售发货单' },
  7: { color: 'yellow', name: '待新增物流单' },
  8: { color: 'yellow', name: '待订单发货确认' },
  9: { color: 'yellow', name: '待新增采购入库单' },
  10: { color: 'yellow', name: '待订单收货确认' },
  11: { color: 'yellow', name: '待确认回单' },
  12: { color: 'yellow', name: '待订单归档供应商' },
  13: { color: 'yellow', name: '待订单归档采购商' },
  14: { color: 'green', name: '完成订单' },
  20: { color: 'red', name: '不接受订单' },
  21: { color: 'red', name: '确认没到账' },
  22: { color: 'blue', name: '继续发货' },
  23: { color: 'yellow', name: '待支付尾款' },
  24: { color: 'yellow', name: '待确认支付结果' },
  25: { color: 'red', name: '确认未到账' },
  null: { color: 'gray', name: '暂无状态' },
}

/** 订单收发货明细 */
export const DELIVEINSIDE: { [key: string]: any } = {
  1: { color: 'default', name: '新增销售发货单' },
  2: { color: 'processing', name: '待确认发货订单' },
  3: { color: 'processing', name: '待新增入库单' },
  4: { color: 'warning', name: '待确认收货订单' },
  5: { color: 'warning', name: '待回单订单' },
  6: { color: 'success', name: '已回单' },
  null: { color: 'default', name: '暂无状态' },
}
