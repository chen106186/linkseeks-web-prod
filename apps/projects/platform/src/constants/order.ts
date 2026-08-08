/*
 * @Author: XieZhiXiong
 * @Date: 2021-04-21 18:13:25
 * @LastEditors: zwp
 * @LastEditTime: 2021-08-02 09:51:00
 * @Description: 订单能力相关常量
 */
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/* -----------订单能力相关常量，包括采购、销售订单，采购、供应会员评价管理------------------- */

/** 订单类型 */

/**
 * 询价采购
 */
export const ORDER_TYPE_INQUIRYT_PURCHASE = 1
/**
 * 需求采购
 */
export const ORDER_TYPE_DEMAND_PURCHASE = 2
/**
 * 现货采购
 */
export const ORDER_TYPE_STORE_PURCHASE = 3
/**
 * 集采
 */
export const ORDER_TYPE_CENTRAL_PURCHASE = 4
/**
 * 渠道直采
 */
export const ORDER_TYPE_CHANNEL_DIRECT_MINING = 5
/**
 * 渠道现货
 */
export const ORDER_TYPE_CHANNEL_STORE = 6
/**
 * 积分兑换
 */
export const ORDER_TYPE_POINTS = 7
/**
 * 渠道积分兑换
 */
export const ORDER_TYPE_CHANNEL_POINTS = 8
/**
 * 采购询价合同
 */
export const ORDER_TYPE_INQUIRY_CONTRACT = 9
/**
 * 采购竞价合同
 */
export const ORDER_TYPE_BIDDING_CONTRACT = 10
/**
 * 采购招标合同
 */
export const ORDER_TYPE_TENDER_CONTRACT = 11
/**
 * 请购单下单
 */
export const ORDER_TYPE_REQUISITION = 12
/**
 * 跨境电商进口
 */
export const ORDER_TYPE_CROSS_BORDER = 13
/**
 * 请购单合同
 */
export const ORDER_TYPE_PURCHASE_REQUISITION_CONTRACT = 14
/**
 * 商品样品下单
 */
export const ORDER_TYPE_PRODUCESAMPLE = 17
/**
 * 框架合同订单
 */
export const ORDER_TYPE_FRAMECONTRACT = 18
/**
 * 手工物料订单
 */
export const MANUAL_MATERIAL_ORDER_TYPE = 15
/**
 * 物料样品订单
 */
export const MATERIAL_SAMPLE_ORDER_TYPE = 16

/** 评价管理里面使用的订单类型常量 */

/**
 * 询价采购
 */
export const ORDER_TYPE2_INQUIRY = 1
/**
 * 需求采购
 */
export const ORDER_TYPE2_DEMAND = 2
/**
 * 现货采购
 */
export const ORDER_TYPE2_SPOT = 3
/**
 * 集采
 */
export const ORDER_TYPE2_CENTRALIZED = 4
/**
 * 渠道直采
 */
export const ORDER_TYPE2_CHANNEL_DIRECT = 5
/**
 * 渠道现货
 */
export const ORDER_TYPE2_CHANNEL_SPOT = 6
/**
 * 积分兑换
 */
export const ORDER_TYPE2_POINTS = 7
/**
 * 渠道积分兑换
 */
export const ORDER_TYPE2_CHANNEL_POINTS = 8
/**
 * 采购询价合同
 */
export const ORDER_TYPE2_ENQUIRY_CONTRACT = 9
/**
 * 采购竞价合同
 */
export const ORDER_TYPE2_BIDDING_CONTRACT = 10
/**
 * 采购招标合同
 */
export const ORDER_TYPE2_TENDER_CONTRACT = 11
/**
 * 请购单采购
 */
export const ORDER_TYPE2_REQUISITION = 12

/**
 * 寻源采购订单
 */
export const ORDER_TYPE_SOURCING_PURCHASE = 20

export const ORDER_TYPE2 = {
  [ORDER_TYPE2_INQUIRY]: intl.formatMessage({ id: 'constants.order.1', defaultMessage: '询价采购' }),
  [ORDER_TYPE2_DEMAND]: intl.formatMessage({ id: 'constants.order.2', defaultMessage: '需求采购' }),
  [ORDER_TYPE2_SPOT]: intl.formatMessage({ id: 'constants.order.3', defaultMessage: '现货采购' }),
  [ORDER_TYPE2_CENTRALIZED]: intl.formatMessage({ id: 'constants.order.4', defaultMessage: '集采' }),
  [ORDER_TYPE2_CHANNEL_DIRECT]: intl.formatMessage({ id: 'constants.order.5', defaultMessage: '渠道直采' }),
  [ORDER_TYPE2_CHANNEL_SPOT]: intl.formatMessage({ id: 'constants.order.6', defaultMessage: '渠道现货' }),
  [ORDER_TYPE2_POINTS]: intl.formatMessage({ id: 'constants.order.7', defaultMessage: '积分兑换' }),
  [ORDER_TYPE2_CHANNEL_POINTS]: intl.formatMessage({ id: 'constants.order.8', defaultMessage: '渠道积分兑换' }),
  [ORDER_TYPE2_ENQUIRY_CONTRACT]: intl.formatMessage({ id: 'constants.order.9', defaultMessage: '采购询价合同' }),
  [ORDER_TYPE2_BIDDING_CONTRACT]: intl.formatMessage({ id: 'constants.order.10', defaultMessage: '采购竞价合同' }),
  [ORDER_TYPE2_TENDER_CONTRACT]: intl.formatMessage({ id: 'constants.order.11', defaultMessage: '采购招标合同' }),
  [ORDER_TYPE2_REQUISITION]: intl.formatMessage({ id: 'constants.order.12', defaultMessage: '请购单采购' }),
}

/** 采购、销售订单数据常量 */

// 提货方式
export const DELIVERY_TYPE = ['', '物流', '自提', '无需配送']

// 订单类型映射-Array形式
export const ORDER_TYPE = [
  '',
  intl.formatMessage({ id: 'constants.order.1', defaultMessage: '询价采购' }),
  intl.formatMessage({ id: 'constants.order.2', defaultMessage: '需求采购' }),
  intl.formatMessage({ id: 'constants.order.3', defaultMessage: '现货采购' }),
  intl.formatMessage({ id: 'constants.order.4', defaultMessage: '集采' }),
  intl.formatMessage({ id: 'constants.order.5', defaultMessage: '渠道直采' }),
  intl.formatMessage({ id: 'constants.order.6', defaultMessage: '渠道现货' }),
  intl.formatMessage({ id: 'constants.order.7', defaultMessage: '积分兑换' }),
  intl.formatMessage({ id: 'constants.order.8', defaultMessage: '渠道积分兑换' }),
  intl.formatMessage({ id: 'constants.order.9', defaultMessage: '采购询价合同' }),
  intl.formatMessage({ id: 'constants.order.11', defaultMessage: '采购招标合同' }),
  intl.formatMessage({ id: 'constants.order.10', defaultMessage: '采购竞价合同' }),
  intl.formatMessage({ id: 'constants.order.12', defaultMessage: '请购单采购' }),
  intl.formatMessage({ id: 'constants.order.13', defaultMessage: '跨境电商进口' }),
  intl.formatMessage({ id: 'constants.order.14', defaultMessage: '请购单合同' }),
]

// 下单模式 *NEW

export enum OrderModalType {
  /**
   * 购物车下单
   */
  PURCHASE_ORDER = 1,

  /**
   * 渠道直采购物车下单
   */
  CHANNEL_DIRECT_PURCHASE_ORDER = 6,

  /**
   * 渠道现货购物车下单
   */
  CHANNEL_EXISTING_PURCHASE_ORDER = 8,

  /**
   *  询价报价下单
   */
  INQUIRY_QUOTATION_ORDER = 3,

  /**
   * 采购询价合同下单
   */
  PURCHASE_ENQUIRY_CONTRACT_ORDER = 12,

  /**
   * 采购竞价合同下单
   */
  PURCHASE_BIDDING_CONTRACT_ORDER = 13,

  /**
   * 采购招标合同下单
   */
  PURCHASE_TENDER_CONTRACT_ORDER = 14,

  /**
   * 请购单采购下单
   */
  PURCHASE_REQUISITION_ORDER = 15,

  /**
   * 请购单合同采购下单
   */
  PURCHASE_REQUISITION_CONTRACT_ORDER = 16,

  /**
   * 框架合同下单
   */
  FRAME_CONTRACT_ORDER = 20,
  CONSOLIDATED_ORDER,
}

// 订单种类 *NEW @可能还需要补充 现货采购 渠道直采 渠道现货
export enum OrderKindType {
  /**
   *  采购订单
   */
  PURCHASE_ORDER = 1,

  /**
   * SRM订单
   */
  SRM_ORDER = 2,

  /**
   * B2B订单
   */
  B2B_ORDER = 3,

  /**
   * 移动端采购订单
   */
  MOBILE_BUYER_ORDER = 4,

  /**
   * 积分兑换订单
   */
  CREDITS_ORDER = 5,

  /**
   * 代客下单订单
   */
  AGENT_ORDER = 6,

  /**
   * 请购单订单
   */
  REQUISITION_ORDER = 7,

  /**
   * 移动端积分兑换订单
   */
  MOBILE_CREDITS_ORDER = 8,

  /**
   * 现货集采下单
   */
  COLLECTIVE_ORDER = 23,
}

/* 采购订单外部工作流状态 */
export enum PurchaseOrderOutWorkState {
  /**
   *  取消订单
   */
  CANCEL_ORDER = -1,

  /**
   *  提交订单
   */
  SUBMIT_ORDER = 1,

  /**
   *  确认订单
   */
  CONFIRM_ORDER,

  /**
   *  确认电子合同
   */
  CONFIRM_ELECTRONIC,

  /**
   *  订单支付
   */
  PAY_ORDER,

  /**
   *  确认支付结果
   */
  CONFIRM_PAY_RESULT,

  /**
   *  新增销售发货单
   */
  ADD_SALE_INVOICE_ORDER,

  /**
   *  新增物流单
   */
  ADD_LOGISTICS_ORDER,

  /**
   *  订单发货确认
   */
  CONFIRM_DELIVERY_ORDER,

  /**
   *  新增采购入库单
   */
  ADD_PURCHASE_STOCK_ORDER,

  /**
   *  订单收货确认
   */
  CONFIRM_RECEIPT_ORDER,

  /**
   *  确认回单
   */
  CONFIRM_RECEIPT,

  /**
   *  订单归档供应商
   */
  FILING_SUPPLIER_ORDER,

  /**
   *  订单归档采购商
   */
  FILING_BUYER_ORDER,

  /**
   *  完成订单
   */
  FINISH_ORDER,

  /**
   *  不接受订单
   */
  NOT_ACCEPTED_ORDER = 20,

  /**
   *  确认没到账
   */
  CONFIRM_NOT_ARRIVED_ACCOUNT,

  /**
   *  货品数量还没有全部发货重新发货
   */
  PRODUCT_ACOUNT_NOT_SEND,

  /**
   *  待支付尾款
   */
  NOT_PAYMENT_FINAL,

  /**
   *  待确认支付结果
   */
  NOT_CONFIRM_PAYMENT_RESULT,

  /**
   *  确认未到账
   */
  CONFIRM_WITHOUT_ARRIVED_ACCOUNT,
}

/** 采购订单内部工作流状态 */
export enum PurchaseOrderInsideWorkState {
  /**
   *  取消订单
   */
  CANCEL_ORDER = -1,

  /**
   *  新增采购订单
   */
  ADD_PURCHASE_ORDER = 1,

  /**
   *  一级审核订单
   */
  ONE_LEVEL_AUDIT_ORDER,

  /**
   *  二级审核订单
   */
  TWO_LEVEL_AUDIT_ORDER,

  /**
   *  提交订单
   */
  SUBMIT_ORDER,

  /**
   *  待确认电子合同
   */
  SUBMIT_FINISH_ORDER,

  /**
   *  提交一级审核订单不通过
   */
  ONE_LEVEL_AUDIT_ORDER_NOT_ALLOWED,

  /**
   *  提交二级审核订单不通过
   */
  TWO_LEVEL_AUDIT_ORDER_NOT_ALLOWED,

  /**
   *  待支付订单
   */
  CONFIRM_ELECTRONIC,

  /**
   *  支付成功
   */
  PAY_SUCCESS = 10,

  /**
   *  支付失败
   */
  PAY_ERROR,

  /**
   *  待确认收货
   */
  CONFIRM_RECEIPT,

  /**
   *  待新增入库订单
   */
  WAREHOUSE_ORDER = 14,

  /**
   *  订单归档
   */
  FILLING_ORDER,

  /**
   * 待审核入库订单
   */
  READY_WAREHOUSE_APPROVED_ORDER,

  /**
   * 手工收货
   */
  HAND_RECEIPT_ORDER,
}

// 销售订单内部工作流状态
export enum SaleOrderInsideWorkState {
  /**
   * 提交审核订单
   */
  SUBMIT_APPROVED_ORDER = 1,

  /**
   *  一级审核订单
   */
  ONE_LEVEL_AUDIT_ORDER,

  /**
   *  二级审核订单
   */
  TWO_LEVEL_AUDIT_ORDER,

  /**
   *  确认订单
   */
  CONFIRM_ORDER,

  /**
   *  不接受提交审核订单
   */
  NOT_SUBMIT_ACCEPTED_ORDER,

  /**
   *  提交审核订单不通过
   */
  NOT_AUDIT_ACCEPTED_ORDER,

  /**
   *  提交一级审核订单不通过
   */
  ONE_LEVEL_AUDIT_ORDER_NOT_ALLOWED,

  /**
   *  提交二级审核订单不通过
   */
  TWO_LEVEL_AUDIT_ORDER_NOT_ALLOWED,

  /**
   *  不接受订单
   */
  NOT_ACCEPTED_ORDER,

  /**
   * 待确认支付结果
   */
  READY_CONFIRM_PAY_RESULT,

  /**
   *  确认支付结果没到账
   */
  CONFIRM_NOT_PAY_RESULT = 17,

  /**
   *  确认支付结果到账(待新增销售发货单)
   */
  SALE_CREATE_DELIVED_ORDER,

  /**
   *  待新增物流单(发货单审核成功)
   */
  ADD_LOGISTICS_ORDER,

  /**
   *  待确认发货(物流单审核成功)
   */
  CONFIRM_DELIVERY_ORDER,

  /**
   *  待确认回单(已确认发货)
   */
  CONFIRM_RECEIPT = 23,

  /**
   *  待订单归档(已确认回单)
   */
  FILLING_ORDER,

  /**
   * 销售发货单待审核(新增销售发货单成功)
   */
  READY_DELEVED_APPROVED,

  /**
   * 待确认物流单(新增物流单成功)
   */
  DELIVERY_APPROVED_SUCCESS,

  /**
   * 手工发货
   */
  HAND_DELEVED_ORDER,

  /**
   * 不接受物流单
   */
  NOT_ACCEPTED_DELIVERY,
}

// 发货内部状态
export enum DeliverySideState {
  /**
   * 新增销售发货单
   */
  ADD_SALE_INVOICE_ORDER = 1,

  /**
   * 订单待发货（物流单审核通过）
   */
  ADD_LOGISTICS_ORDER,

  /**
   * 确认订单发货
   */
  CONFIRM_DELIVERY_ORDER,

  /**
   * 待收货订单
   */
  WAREHOUSE_ORDER,

  /**
   * 确认订单收货（待回单订单）
   */
  CONFIRM_RECEIPT_ORDER,

  /**
   * 已回单订单
   */
  CONFIRM_RETURN_ORDER,
}

// 订单支付外部状态

export enum PayOutWorkState {
  READY_PAY = 1,
  READY_CONFIRM_RESULT,
  CONFIRM_ACCOUNT,
  CONFIRM_NOT_ACCOUNT,
}

/** 订单外部显示文案 */
export const PurchaseOrderOutWorkStateTexts = {
  '-1': '取消订单',
  // 0: '订单完成',
  1: '待提交订单',
  2: '待确认订单',
  3: '待确认电子合同',
  4: '订单待支付',
  5: '待确认支付结果',
  6: '待新增销售发货单',
  7: '待新增物流单',
  8: '订单发货待确认',
  9: '待新增采购入库单',
  10: '订单收货待确认',
  11: '待确认回单',
  12: '待归档',
  13: '待归档',
  14: '完成订单',
  20: '不接受订单',
  21: '确认没到账',
  22: '待新增销售发货单',
  23: '待支付尾款',
  24: '待确认支付结果',
  25: '确认未到账',
}

/** 采购订单内部 */
export const PurchaseOrderInsideWorkStateTexts = {
  '-1': '取消订单',
  0: '订单完成',
  1: '待新增采购订单',
  2: '待审核订单(一级)',
  3: '待审核订单(二级)',
  4: '待提交订单',
  5: '审核通过',
  6: '提交审核订单不通过(一级)',
  7: '提交审核订单不通过(二级)',
  8: '待支付订单',
  10: '支付成功',
  11: '支付失败',
  12: '待确认收货',
  14: '订单待入库',
  15: '订单待归档',
  16: '订单入库待审核',
  17: '待手工收货',
  18: '已确认收货',
  19: '已归档',
  20: '待确认电子合同',
}

/** 需要app扫码 访问的h5下载链接地址 */
export const h5PageAddressByScan = 'http://download-h5.shushangyun.com:13880/download'

/** 需要app扫码 访问拼团详情链接地址 */
export const groupDetailByScan = 'http://pt-h5.shushangyun.com:13880/'

/**
 * 判断订单类型是否是积分订单
 * @param orderType 订单类型 number
 * @returns
 */
export const checkIsPointsOrder = (orderType: number) =>
  orderType === ORDER_TYPE_POINTS || orderType === ORDER_TYPE_CHANNEL_POINTS

/** 生命周期阶段规则 - 取数据规则 */
export enum lifecyclePhaseRules {
  // 供应商的规则
  /**
   * 允许参与寻源
   */
  SUPPLIER_SOURCE = 1,
  /**
   * 允许签订合同
   */
  SUPPLIER_CONTRACT = 2,
  /**
   * 允许创建该供应商的订单
   */
  SUPPLIER_ORDER = 3,
  /**
   * 允许变更入库资料
   */
  SUPPLIER_CHANGEDATA = 4,

  // 客户的规则
  /**
   * 允许发布商品询价
   */
  CUSTOMER_INQUIRY = 5,
  /**
   * 允许签订合同
   */
  CUSTOMER_CONTRACT = 6,
  /**
   * 允许创建订单
   */
  CUSTOMER_ORDER = 7,
  /**
   * 允许变更申请资料
   */
  CUSTOMER_CHANGEDATA = 8,
}
