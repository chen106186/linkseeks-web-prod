import { getTopDomainByHost, getDefaultEnterprise, getDefaultEnterpriseMallInfo } from '@/utils'
import { getEnv } from '@apps/utils'
export { SOCKET_URL } from '@apps/utils'
import { history } from '@linkseeks/router-manager'
export const NOT_CHANGE_VALUE = 'hello, world'

/**
 * 请求头
 */
export const REQUEST_HEADER = location.protocol + '//'

/**
 * 顶域
 */
export const TOP_DOMAIN = getTopDomainByHost(getEnv('SITE_URL'))
/**
 * 平台首页域名
 */

export const PLATFORM_DOMAIN = `${REQUEST_HEADER}www.${TOP_DOMAIN}`

/**
 * 企业商城域名
 */
const enterpriseInfo = getDefaultEnterprise()
export const ENTERPRISE_CENTER_URL = `${REQUEST_HEADER}${enterpriseInfo ? enterpriseInfo.url : 'b2b'}.${TOP_DOMAIN}`

export const getEnterpriseCenterUrl = async () => {
  const defaultMallInfo = await getDefaultEnterpriseMallInfo()
  return `${REQUEST_HEADER}${defaultMallInfo ? defaultMallInfo.url : 'b2b'}.${TOP_DOMAIN}`
}

export const jumpDefaultMall = async (path: string) => {
  const mallUrl = await getEnterpriseCenterUrl()
  if (mallUrl) {
    history.open(`${mallUrl}${path}`)
  }
}

/**
 * 行情资讯域名
 */
export const INFO_CENTER_URL = `${REQUEST_HEADER}info.${TOP_DOMAIN}`

/**
 * 企业采购域名
 */
export const SRM_CENTER_URL = `${REQUEST_HEADER}srm.${TOP_DOMAIN}`

/**
 * 物流服务域名
 */
export const LOGISTICS_CENTER_URL = `${REQUEST_HEADER}logistics.${TOP_DOMAIN}`

/**
 * 加工服务域名
 */
export const MANUFACTURE_CENTER_URL = `${REQUEST_HEADER}manufacture.${TOP_DOMAIN}`

// 会员角色类型
export const MEMBER_ROLE_LISTS = [
  { label: '服务提供者', value: 1 },
  { label: '服务消费者', value: 2 },
]

// 会员角色标签
export const MEMBER_ROLE_TAG_LISTS = [
  { label: '客户', value: 1 },
  { label: '供应商', value: 2 },
]

// 会员等级类型
export const MEMBER_GRADE_LISTS = [
  { label: '全部', value: '' },
  { label: '平台会员', value: 1 },
  { label: '商户会员', value: 2 },
  { label: '渠道会员', value: 3 },
]
export const MEMBER_ROLE_MAPS = ['', ...MEMBER_ROLE_LISTS.map((v) => v.label)]

// 会员类型
export const MEMBER_TYPE_LISTS = [
  { label: '企业会员', value: 1 },
  { label: '个人会员', value: 2 },
  { label: '渠道企业会员', value: 3 },
  { label: '渠道个人会员', value: 4 },
]

export const MEMBER_TYPE_MAPS = ['', ...MEMBER_TYPE_LISTS.map((v) => v.label)]

// 提货方式
export const DELIVERY_TYPE = ['', '物流', '自提', '无需配送']

export const ORDER_TYPE = [
  '',
  '询价采购',
  '需求采购',
  '现货采购',
  '集采',
  '渠道直采',
  '渠道现货',
  '积分兑换',
  '渠道积分兑换',
]

/** 模板类型: 0.门户模板 1.企业商城模板 2.会员店铺模板 3.商品描述模板 4.渠道商城模板 5.活动模板 6.自营商城模板 */
export enum TEMPLATE_TYPE {
  /** 门户模板 */
  platform = 0,
  /** 企业商城模板 */
  mall = 1,
  /** 会员店铺模板 */
  shop = 2,
  /** 商品描述模板 */
  goods = 3,
  /** 活动模板 */
  activity = 5,
  /** 自营商城模板 */
  own = 6,
}

export enum TEMPLATE_TYPE_TEXT {
  platform = 'platform',
  mall = 'mall',
  shop = 'shop',
  goods = 'goods',
  chennel = 'chennel',
}

export const ENVIRONMENT_OPTION = [
  {
    label: 'web',
    value: 1,
  },
  {
    label: 'H5',
    value: 2,
  },
  {
    label: '小程序',
    value: 3,
  },
  {
    label: 'APP',
    value: 4,
  },
]

export const SHOP_TYPE_OPTIONS = [
  {
    label: '企业商城',
    value: 1,
  },
  {
    label: '积分商城',
    value: 2,
  },
  {
    label: '采购门户',
    value: 6,
  },
  {
    label: '物流服务门户',
    value: 7,
  },
  {
    label: '加工服务门户',
    value: 8,
  },
  {
    label: '行情资讯门户',
    value: 9,
  },
]

// 商城类型
export const SHOP_TYPES = [
  {
    id: 1,
    name: '企业商城',
  },
  {
    id: 7,
    name: '积分商城',
  },
]
export enum LAYOUT_TYPE {
  /**
   * 企业商城
   */
  mall = 'mall',
  /**
   * 店铺（店铺商城）
   */
  shop = 'shop',
  /**
   * 渠道商城
   */
  channel = 'channel',
  /**
   * 企业商城-积分商城
   */
  scoreMall = 'scoreMall',
  /**
   * 店铺-积分兑换
   */
  shopScoreMall = 'shopScoreMall',
  /**
   * 渠道商城-积分兑换
   */
  channelScoreMall = 'channelScoreMall',
  /**
   * 平台首页
   */
  platform = 'platform',
}

// 本地环境跳过权限校验
export const isDev = import.meta.env.OUT_NODE_ENV === 'development'
// export const isDev = false

export const STATUS_ENUM = [
  {
    label: '全部',
    value: null,
  },
  {
    label: '有效',
    value: 1,
  },
  {
    label: '无效',
    value: 0,
  },
]

// 1是阿里云oss服务器, 2是本地文件服务器
export const UPLOAD_TYPE = 1

// 订单类型
export enum OrderModalType {
  /**
   *  进货单下单
   */
  PURCHASE_ORDER = 5,

  /**
   *  手工下单
   */
  HAND_ORDER,

  /**
   *  询价报价下单
   */
  INQUIRY_QUOTATION_ORDER,
  /**
   * 需求报价下单
   */
  DEMAND_QUOTATION_ORDER,
  /**
   * 合并订单下单
   */
  CONSOLIDATED_ORDER,

  /**
   *  渠道直采进货单下单
   */
  CHANNEL_DIRECT_PURCHASE_ORDER,

  /**
   *  渠道直采手工下单
   */
  CHANNEL_DIRECT_MINING_ORDER,

  /**
   *  渠道现货进货单下单
   */
  CHANNEL_SPOT_PURCHASE_ORDER,

  /**
   *  渠道现货手工下单
   */
  CHANNEL_SPOT_MANUAL_ORDER,

  /**
   * 请购单采购下单
   */
  PURCHASE_REQUISITION_ORDER = 15,

  /**
   * 请购单合同采购下单
   */
  PURCHASE_REQUISITION_CONTRACT_ORDER = 16,
}

// 采购订单外部工作流状态
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
}

// 采购订单内部工作流状态
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
   * 待审核物流单(新增物流单成功)
   */
  DELIVERY_APPROVED_SUCCESS,

  /**
   * 手工发货
   */
  HAND_DELEVED_ORDER,
}

// 支付外部状态
export enum PayOutWorkState {
  READY_PAY = 1,
  READY_CONFIRM_RESULT,
  CONFIRM_ACCOUNT,
  CONFIRM_NOT_ACCOUNT,
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

// 采购订单外部显示文案
export const PurchaseOrderOutWorkStateTexts = {
  '-1': '取消订单',
  0: '完成订单',
  1: '提交订单',
  2: '确认订单',
  3: '确认电子合同',
  4: '订单支付',
  5: '确认支付结果',
  6: '新增销售发货单',
  7: '新增物流单',
  8: '订单发货确认',
  9: '新增采购入库单',
  10: '订单收货确认',
  11: '确认回单',
  12: '订单归档供应商',
  13: '订单归档采购商',
  14: '完成订单',
  20: '不接受订单',
  21: '确认没到账',
  22: '货品未全部发货',
  23: '待支付尾款',
  24: '待确认支付结果',
  25: '确认未到账',
}

export const PurchaseOrderInsideWorkStateTexts = {
  '-1': '取消订单',
  0: '订单完成',
  1: '新增采购订单',
  2: '一级审核订单',
  3: '二级审核订单',
  4: '提交订单',
  5: '待确认电子合同',
  6: '提交一级审核订单不通过',
  7: '提交二级审核订单不通过',
  8: '待支付订单',
  10: '支付成功',
  11: '支付失败',
  12: '确认收货',
  14: '订单入库',
  15: '订单归档',
  16: '订单入库待审核',
  17: '手工收货',
}

// 销售订单内部显示文案
export const SaleOrderInsideWorkStateTexts = {
  0: '订单完成',
  1: '待审核订单',
  2: '一级审核订单',
  3: '二级审核订单',
  4: '确认订单',
  5: '接受订单',
  6: '不接受订单',
  7: '提交一级审核订单不通过',
  8: '提交二级审核订单不通过',
  9: '不接受订单',
  10: '待确认支付结果',

  16: '支付结果确认到账',
  17: '支付结果没到账',
  18: '发货单创建',
  19: '新增物流单',
  20: '订单发货确认',
  23: '确认回单',
  24: '订单归档',
  25: '待审核发货单',
  26: '待审核物流单',
  27: '手工发货',
}

// 订单流转记录外部状态
export const OrderTransformOutWorkStateTexts = {
  '-1': '取消订单',
  0: '完成订单',
  1: '待确认',
  2: '待确认电子合同',
  3: '待支付',
  4: '待确认支付结果',
  5: '待新增销售发货单',
  6: '待新增物流单',
  7: '待确认发货订单',
  8: '待新增采购入库单',
  9: '待确认收货订单',
  10: '待确认收货订单',

  11: '待确认回单',
  12: '待归档',
  13: '待归档',
  14: '不接受订单',
  15: '确认未到账',
  16: '待新增采购入库单',
  17: '手工确认发货',
}

// 采购订单流转记录内部状态
export const PurchaseOrderTransformInsideWorkStateTexts = {
  '-1': '取消订单',
  0: '完成订单',
  1: '待提交审核',
  2: '提交审核通过',
  3: '审核通过',
  4: '审核通过',
  5: '审核通过',
  6: '已确认电子合同',
  7: '审核不通过',
  8: '审核不通过',
  9: '支付成功',
  10: '支付失败',

  11: '已审核采购入库单',
  12: '已确认收货',
  13: '订单归档完成',
  14: '修改订单',
  15: '手工收货',
}

// 销售订单流转记录内部状态
export const SaleOrderTransformInsideWorkStateTexts = {
  '-1': '取消订单',
  0: '完成订单',
  1: '审核通过',
  2: '审核通过',
  3: '审核通过',
  4: '接受订单',
  5: '确认到账',
  6: '已审核销售发货单',
  7: '接受物流单',
  8: '已确认发货',
  9: '已确认回单',
  10: '已归档',

  11: '审核不通过',
  12: '审核不通过',
  13: '不接受订单',
  14: '确认未到账',
  15: '审核不通过',
  16: '不接受物流单',
}

export const PayOutWorkStateTexts = {
  1: '待支付',
  2: '待确认支付结果',
  3: '确认到账',
  4: '确认未到账',
}

// 收货/发货内部状态文案
export const DeliverySideStateTexts = {
  1: '新增销售发货单',
  2: '待确认发货订单',
  3: '待新增入库单', // 采购-新增入库单
  4: '待确认收货订单',
  5: '待回单订单',
  6: '已回单',
}

// 询价外部状态
export const InquiryStateTexts = {
  1: '待提交',
  2: '待确认',
  3: '接受报价',
  4: '不接受报价',
}

// 售后维修内部状态
/**
 * 待提交维修
 */
export const REPAIR_INNER_STATUS_UNCOMMITTED = 1
/**
 * 审核通过(提交)
 */
export const REPAIR_INNER_STATUS_COMMIT_SUCCESS = 2
/**
 * 一级审核通过
 */
export const REPAIR_INNER_STATUS_SUCCESS_1 = 3
/**
 * 二级审核通过
 */
export const REPAIR_INNER_STATUS_SUCCESS_2 = 4
/**
 * 二级审核不通过
 */
export const REPAIR_INNER_STATUS_FAILED_2 = 5
/**
 * 确认审核通过
 */
export const REPAIR_INNER_STATUS_CONFIRM_SUCCESS = 6
/**
 * 确认审核不通过
 */
export const REPAIR_INNER_STATUS_CONFIRM_FAILED = 7
/**
 * 确认售后完成
 */
export const REPAIR_INNER_STATUS_FINISHED = 8
/**
 * 审核不通过(提交)
 */
export const REPAIR_INNER_STATUS_COMMIT_FAILED = 9
/**
 * 审核不通过(一级)
 */
export const REPAIR_INNER_STATUS_FAILED_1 = 10
export const REPAIR_INNER_STATUS = {
  [REPAIR_INNER_STATUS_UNCOMMITTED]: '待提交',
  [REPAIR_INNER_STATUS_COMMIT_SUCCESS]: '审核通过(提交)',
  [REPAIR_INNER_STATUS_SUCCESS_1]: '一级审核通过',
  [REPAIR_INNER_STATUS_SUCCESS_2]: '二级审核通过',
  [REPAIR_INNER_STATUS_FAILED_2]: '二级审核不通过',
  [REPAIR_INNER_STATUS_CONFIRM_SUCCESS]: '确认审核通过',
  [REPAIR_INNER_STATUS_CONFIRM_FAILED]: '确认审核不通过',
  [REPAIR_INNER_STATUS_FINISHED]: '确认售后完成',
  [REPAIR_INNER_STATUS_COMMIT_FAILED]: '审核不通过(提交)',
  [REPAIR_INNER_STATUS_FAILED_1]: '审核不通过(一级)',
}

// 售后维修外部状态
/**
 * 待提交申请单
 */
export const REPAIR_OUTER_STATUS_UNCOMMITTED = 1
/**
 * 待确认
 */
export const REPAIR_OUTER_STATUS_UNCONFIRMED = 2
/**
 * 不接受申请
 */
export const REPAIR_OUTER_STATUS_FAILED = 3
/**
 * 接受申请
 */
export const REPAIR_OUTER_STATUS_SUCCESS = 4
/**
 * 售后完成
 */
export const REPAIR_OUTER_STATUS_FINISHED = 5
export const REPAIR_OUTER_STATUS = {
  [REPAIR_OUTER_STATUS_UNCOMMITTED]: '待提交',
  [REPAIR_OUTER_STATUS_UNCONFIRMED]: '待确认',
  [REPAIR_OUTER_STATUS_FAILED]: '不接受申请',
  [REPAIR_OUTER_STATUS_SUCCESS]: '接受申请',
  [REPAIR_OUTER_STATUS_FINISHED]: '售后完成',
}

// 售后换货内部状态
/**
 * 待提交换货
 */
export const EXCHANGE_INNER_STATUS_UNCOMMITTED = 1
/**
 * 审核通过(提交)
 */
export const EXCHANGE_INNER_STATUS_COMMIT_SUCCESS = 2
/**
 * 一级审核通过
 */
export const EXCHANGE_INNER_STATUS_SUCCESS_1 = 3
/**
 * 二级审核通过
 */
export const EXCHANGE_INNER_STATUS_SUCCESS_2 = 4
/**
 * 审核不通过（不接受申请）
 */
export const EXCHANGE_INNER_STATUS_FAILED = 5
/**
 * 确认审核通过
 */
export const EXCHANGE_INNER_STATUS_CONFIRM_SUCCESS = 6
/**
 * 确认审核不通过
 */
export const EXCHANGE_INNER_STATUS_CONFIRM_FAILED = 7
/**
 * 待新增退货发货单
 */
export const EXCHANGE_INNER_STATUS_NOT_ADDED_RETURN_DELIVERY = 8
/**
 * 待审核退货发货单
 */
export const EXCHANGE_INNER_STATUS_UNREVIEWED_RETURN_DELIVERY = 9
/**
 * 采购商待新增物流单
 */
export const EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS = 10
/**
 * 采购商待确认物流单
 */
export const EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS = 11
/**
 * 待确认退货发货
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_RETURN_DELIVERY = 12
/**
 * 待新增退货入库单
 */
export const EXCHANGE_INNER_STATUS_NOT_ADDED_RETURN_STORAGE = 13
/**
 * 待审核退货入库单
 */
export const EXCHANGE_INNER_STATUS_UNREVIEWED_RETURN_STORAGE = 14
/**
 * 待确认退货收货
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_RETURN_RECEIVE = 15
/**
 * 待确认退货回单
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_RETURN_RECEIPT = 16
/**
 * 待新增换货发货单
 */
export const EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_DELIVERY = 17
/**
 * 待审核换货发货单
 */
export const EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_DELIVERY = 18
/**
 * 供应商待新增物流单
 */
export const EXCHANGE_INNER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS = 19
/**
 * 供应商待确认物流单
 */
export const EXCHANGE_INNER_STATUS_SUPPLIER_UNCONFIRMED_LOGISTICS = 20
/**
 * 待确认换货发货
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_DELIVERY = 21
/**
 * 待新增换货入库单
 */
export const EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE = 22
/**
 * 待审核换货入库单
 */
export const EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE = 23
/**
 * 待确认换货收货
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE = 24
/**
 * 待确认换货回单
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIPT = 25
/**
 * 待确认售后完成
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_FINISHED = 26
/**
 * 已确认售后完成
 */
export const EXCHANGE_INNER_STATUS_FINISHED = 27
/**
 * 不接受退货物流单
 */
export const EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_LOGISTICS = 28
/**
 * 不接受换货物流单
 */
export const EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_EXCHANGE = 29
/**
 * 审核不通过(提交)
 */
export const EXCHANGE_INNER_STATUS_COMMIT_FAILED = 30
/**
 * 审核不通过(一级)
 */
export const EXCHANGE_INNER_STATUS_FAILED_1 = 31
/**
 * 审核不通过(二级)
 */
export const EXCHANGE_INNER_STATUS_FAILED_2 = 32
export const EXCHANGE_INNER_STATUS = {
  [EXCHANGE_INNER_STATUS_UNCOMMITTED]: '待提交',
  [EXCHANGE_INNER_STATUS_COMMIT_SUCCESS]: '审核通过(提交)',
  [EXCHANGE_INNER_STATUS_SUCCESS_1]: '一级审核通过',
  [EXCHANGE_INNER_STATUS_SUCCESS_2]: '二级审核通过',
  [EXCHANGE_INNER_STATUS_FAILED]: '审核不通过',
  [EXCHANGE_INNER_STATUS_CONFIRM_SUCCESS]: '确认审核通过',
  [EXCHANGE_INNER_STATUS_CONFIRM_FAILED]: '确认审核不通过',
  [EXCHANGE_INNER_STATUS_NOT_ADDED_RETURN_DELIVERY]: '待新增退货发货单',
  [EXCHANGE_INNER_STATUS_UNREVIEWED_RETURN_DELIVERY]: '待审核退货发货单',
  [EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: '采购商待新增物流单',
  [EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS]: '采购商待确认物流单',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_RETURN_DELIVERY]: '待确认退货发货',
  [EXCHANGE_INNER_STATUS_NOT_ADDED_RETURN_STORAGE]: '待新增退货入库单',
  [EXCHANGE_INNER_STATUS_UNREVIEWED_RETURN_STORAGE]: '待审核退货入库单',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_RETURN_RECEIVE]: '待确认退货收货',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_RETURN_RECEIPT]: '待确认退货回单',
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_DELIVERY]: '待新增换货发货单',
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_DELIVERY]: '待审核换货发货单',
  [EXCHANGE_INNER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS]: '供应商待新增物流单',
  [EXCHANGE_INNER_STATUS_SUPPLIER_UNCONFIRMED_LOGISTICS]: '供应商待确认物流单',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_DELIVERY]: '待确认换货发货',
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE]: '待新增换货入库单',
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE]: '待审核换货入库单',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE]: '待确认换货收货',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIPT]: '待确认换货回单',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_FINISHED]: '待确认售后完成',
  [EXCHANGE_INNER_STATUS_FINISHED]: '已确认售后完成',
  [EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_LOGISTICS]: '不接受退货物流单',
  [EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_EXCHANGE]: '不接受换货物流单',
  [EXCHANGE_INNER_STATUS_COMMIT_FAILED]: '审核不通过(提交)',
  [EXCHANGE_INNER_STATUS_FAILED_1]: '审核不通过(一级)',
  [EXCHANGE_INNER_STATUS_FAILED_2]: '审核不通过(二级)',
}

// 售后换货外部状态
/**
 * 待提交
 */
export const EXCHANGE_OUTER_STATUS_UNCOMMITTED = 1
/**
 * 待确认申请单
 */
export const EXCHANGE_OUTER_UNCONFIRMED = 2
/**
 * 不接受申请
 */
export const EXCHANGE_OUTER_STATUS_FAILED = 3
/**
 * 接受申请
 */
export const EXCHANGE_OUTER_STATUS_SUCCESS = 4
/**
 * 待新增退货发货单
 */
export const EXCHANGE_OUTER_STATUS_NOT_ADDED_RETURN_DELIVERY = 5
/**
 * 采购商待新增物流单
 */
export const EXCHANGE_OUTER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS = 6
/**
 * 待退货发货
 */
export const EXCHANGE_OUTER_STATUS_RETURN_DELIVERY = 7
/**
 * 待新增退货入库单
 */
export const EXCHANGE_OUTER_STATUS_NOT_ADDED_RETURN_STORAGE = 8
/**
 * 待退货收货
 */
export const EXCHANGE_OUTER_STATUS_RETURN_RECEIVE = 9
/**
 * 待确认退货回单
 */
export const EXCHANGE_OUTER_STATUS_UNCONFIRMED_RETURN_RECEIPT = 10
/**
 * 待新增换货发货单
 */
export const EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_DELIVERY = 11
/**
 * 供应商待新增物流单
 */
export const EXCHANGE_OUTER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS = 12
/**
 * 待换货发货
 */
export const EXCHANGE_OUTER_STATUS_REPLACE_DELIVERY = 13
/**
 * 待新增换货入库单
 */
export const EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_STORAGE = 14
/**
 * 待换货收货
 */
export const EXCHANGE_OUTER_STATUS_REPLACE_RECEIVE = 15
/**
 * 待确认换货回单
 */
export const EXCHANGE_OUTER_STATUS_UNCONFIRMED_REPLACE_RECEIPT = 16
/**
 * 待确认售后完成
 */
export const EXCHANGE_OUTER_STATUS_UNCONFIRMED_FINISHED = 17
/**
 * 售后完成
 */
export const EXCHANGE_OUTER_STATUS_FINISHED = 18
export const EXCHANGE_OUTER_STATUS = {
  [EXCHANGE_OUTER_STATUS_UNCOMMITTED]: '待提交',
  [EXCHANGE_OUTER_UNCONFIRMED]: '待确认申请单',
  [EXCHANGE_OUTER_STATUS_FAILED]: '不接受申请',
  [EXCHANGE_OUTER_STATUS_SUCCESS]: '接受申请',
  [EXCHANGE_OUTER_STATUS_NOT_ADDED_RETURN_DELIVERY]: '待新增退货发货单',
  [EXCHANGE_OUTER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: '采购商待新增物流单',
  [EXCHANGE_OUTER_STATUS_RETURN_DELIVERY]: '待退货发货',
  [EXCHANGE_OUTER_STATUS_NOT_ADDED_RETURN_STORAGE]: '待新增退货入库单',
  [EXCHANGE_OUTER_STATUS_RETURN_RECEIVE]: '待退货收货',
  [EXCHANGE_OUTER_STATUS_UNCONFIRMED_RETURN_RECEIPT]: '待确认退货回单',
  [EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_DELIVERY]: '待新增换货发货单',
  [EXCHANGE_OUTER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS]: '供应商待新增物流单',
  [EXCHANGE_OUTER_STATUS_REPLACE_DELIVERY]: '待换货发货',
  [EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_STORAGE]: '待新增换货入库单',
  [EXCHANGE_OUTER_STATUS_REPLACE_RECEIVE]: '待换货收货',
  [EXCHANGE_OUTER_STATUS_UNCONFIRMED_REPLACE_RECEIPT]: '待确认换货回单',
  [EXCHANGE_OUTER_STATUS_UNCONFIRMED_FINISHED]: '待确认售后完成',
  [EXCHANGE_OUTER_STATUS_FINISHED]: '售后完成',
}

// 售后退货内部状态
/**
 * 待提交退货
 */
export const RETURN_INNER_STATUS_UNCOMMITTED = 1
/**
 * 审核通过(提交)
 */
export const RETURN_INNER_STATUS_COMMIT_SUCCESS = 2
/**
 * 一级审核通过
 */
export const RETURN_INNER_STATUS_SUCCESS_1 = 3
/**
 * 二级审核通过
 */
export const RETURN_INNER_STATUS_SUCCESS_2 = 4
/**
 * 审核不通过(二级)
 */
export const RETURN_INNER_STATUS_FAILED_2 = 5
/**
 * 确认审核通过
 */
export const RETURN_INNER_STATUS_CONFIRM_SUCCESS = 6
/**
 * 确认审核不通过
 */
export const RETURN_INNER_STATUS_CONFIRM_FAILED = 7
/**
 * 待新增退货发货单
 */
export const RETURN_INNER_STATUS_NOT_ADDED_RETURN_DELIVERY = 8
/**
 * 待审核退货发货单
 */
export const RETURN_INNER_STATUS_UNREVIEWED_RETURN_DELIVERY = 9
/**
 * 采购商待新增物流单
 */
export const RETURN_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS = 10
/**
 * 采购商待确认物流单
 */
export const RETURN_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS = 11
/**
 * 待确认退货发货
 */
export const RETURN_INNER_STATUS_UNCONFIRMED_RETURN_DELIVERY = 12
/**
 * 待新增退货入库单
 */
export const RETURN_INNER_STATUS_NOT_ADDED_RETURN_STORAGE = 13
/**
 * 待审核退货入库单
 */
export const RETURN_INNER_STATUS_UNREVIEWED_RETURN_STORAGE = 14
/**
 * 待确认退货收货
 */
export const RETURN_INNER_STATUS_UNCONFIRMED_RETURN_RECEIVE = 15
/**
 * 待确认退货回单
 */
export const RETURN_INNER_STATUS_UNCONFIRMED_RETURN_RECEIPT = 16
/**
 * 待退款
 */
export const RETURN_INNER_STATUS_TO_BE_REFUNDED = 17
/**
 * 待确认退款
 */
export const RETURN_INNER_STATUS_UNCONFIRMED_REFUNDED = 18
/**
 * 退款失败
 */
export const RETURN_INNER_STATUS_REFUNDED_FAIL = 19
/**
 * 退款成功
 */
export const RETURN_INNER_STATUS_REFUNDED_SUCCESS = 20
/**
 * 待确认售后完成
 */
export const RETURN_INNER_STATUS_UNCONFIRMED_FINISHED = 21
/**
 * 已确认售后完成
 */
export const RETURN_INNER_STATUS_FINISHED = 22
/**
 * 不接受物流单
 */
export const RETURN_INNER_STATUS_UNACCEPTED_LOGISTICS = 23
/**
 * 审核不通过(提交)
 */
export const RETURN_INNER_STATUS_COMMIT_FAILED = 24
/**
 * 审核不通过(一级)
 */
export const RETURN_INNER_STATUS_FAILED_1 = 25
export const RETURN_INNER_STATUS = {
  [RETURN_INNER_STATUS_UNCOMMITTED]: '待提交',
  [RETURN_INNER_STATUS_COMMIT_SUCCESS]: '审核通过(提交)',
  [RETURN_INNER_STATUS_SUCCESS_1]: '一级审核通过',
  [RETURN_INNER_STATUS_SUCCESS_2]: '二级审核通过',
  [RETURN_INNER_STATUS_FAILED_2]: '二级审核不通过',
  [RETURN_INNER_STATUS_CONFIRM_SUCCESS]: '确认审核通过',
  [RETURN_INNER_STATUS_CONFIRM_FAILED]: '确认审核不通过',
  [RETURN_INNER_STATUS_NOT_ADDED_RETURN_DELIVERY]: '待新增退货发货单',
  [RETURN_INNER_STATUS_UNREVIEWED_RETURN_DELIVERY]: '待审核退货发货单',
  [RETURN_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: '采购商待新增物流单',
  [RETURN_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS]: '采购商待确认物流单',
  [RETURN_INNER_STATUS_UNCONFIRMED_RETURN_DELIVERY]: '待确认退货发货',
  [RETURN_INNER_STATUS_NOT_ADDED_RETURN_STORAGE]: '待新增退货入库单',
  [RETURN_INNER_STATUS_UNREVIEWED_RETURN_STORAGE]: '待审核退货入库单',
  [RETURN_INNER_STATUS_UNCONFIRMED_RETURN_RECEIVE]: '待确认退货收货',
  [RETURN_INNER_STATUS_UNCONFIRMED_RETURN_RECEIPT]: '待确认退货回单',
  [RETURN_INNER_STATUS_TO_BE_REFUNDED]: '待退款',
  [RETURN_INNER_STATUS_UNCONFIRMED_REFUNDED]: '待确认退款',
  [RETURN_INNER_STATUS_REFUNDED_FAIL]: '待确认退款',
  [RETURN_INNER_STATUS_REFUNDED_SUCCESS]: '待确认退款',
  [RETURN_INNER_STATUS_UNCONFIRMED_FINISHED]: '待确认售后完成',
  [RETURN_INNER_STATUS_FINISHED]: '已确认售后完成',
  [RETURN_INNER_STATUS_UNACCEPTED_LOGISTICS]: '不接受物流单',
  [RETURN_INNER_STATUS_COMMIT_FAILED]: '审核不通过(提交)',
  [RETURN_INNER_STATUS_FAILED_1]: '审核不通过(一级)',
}

// 售后退货外部状态
/**
 * 待提交
 */
export const RETURN_OUTER_STATUS_UNCOMMITTED = 1
/**
 * 待确认申请单
 */
export const RETURN_OUTER_UNCONFIRMED = 2
/**
 * 不接受申请
 */
export const RETURN_OUTER_STATUS_FAILED = 3
/**
 * 接受申请
 */
export const RETURN_OUTER_STATUS_SUCCESS = 4
/**
 * 待新增退货发货单
 */
export const RETURN_OUTER_STATUS_NOT_ADDED_RETURN_DELIVERY = 5
/**
 * 采购商待新增物流单
 */
export const RETURN_OUTER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS = 6
/**
 * 待退货发货
 */
export const RETURN_OUTER_STATUS_RETURN_DELIVERY = 7
/**
 * 待新增退货入库单
 */
export const RETURN_OUTER_STATUS_NOT_ADDED_RETURN_STORAGE = 8
/**
 * 待退货收货
 */
export const RETURN_OUTER_STATUS_RETURN_RECEIVE = 9
/**
 * 待确认退货回单
 */
export const RETURN_OUTER_STATUS_UNCONFIRMED_RETURN_RECEIPT = 10
/**
 * 待退款
 */
export const RETURN_OUTER_STATUS_TO_BE_REFUNDED = 11
/**
 * 待确认退款
 */
export const RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED = 12
/**
 * 确认退款未到账
 */
export const RETURN_OUTER_STATUS_NOT_RECEIVED = 13
/**
 * 待确认售后完成
 */
export const RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED = 14
/**
 * 售后完成
 */
export const RETURN_OUTER_STATUS_FINISHED = 15
export const RETURN_OUTER_STATUS = {
  [RETURN_OUTER_STATUS_UNCOMMITTED]: '待提交',
  [RETURN_OUTER_UNCONFIRMED]: '待确认申请单',
  [RETURN_OUTER_STATUS_FAILED]: '不接受申请',
  [RETURN_OUTER_STATUS_SUCCESS]: '接受申请',
  [RETURN_OUTER_STATUS_NOT_ADDED_RETURN_DELIVERY]: '待新增退货发货单',
  [RETURN_OUTER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: '采购商待新增物流单',
  [RETURN_OUTER_STATUS_RETURN_DELIVERY]: '待退货发货',
  [RETURN_OUTER_STATUS_NOT_ADDED_RETURN_STORAGE]: '待新增退货入库单',
  [RETURN_OUTER_STATUS_RETURN_RECEIVE]: '待退货收货',
  [RETURN_OUTER_STATUS_UNCONFIRMED_RETURN_RECEIPT]: '待确认退货回单',
  [RETURN_OUTER_STATUS_TO_BE_REFUNDED]: '待退款',
  [RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED]: '待确认退款',
  [RETURN_OUTER_STATUS_NOT_RECEIVED]: '确认退款未到账',
  [RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED]: '待确认售后完成',
  [RETURN_OUTER_STATUS_FINISHED]: '售后完成',
}

export const DELIVERY_TYPE_ENUM = [
  { label: '物流', value: 1 },
  { label: '自提', value: 2 },
  { label: '无需配送', value: 3 },
]

// 支付渠道
/**
 * 积分支付
 */
export const PAY_CHANNEL_INTEGRAL = 0
/**
 * 支付宝
 */
export const PAY_CHANNEL_ALI = 1
/**
 * 微信
 */
export const PAY_CHANNEL_WECHAT = 2
/**
 * 银联
 */
export const PAY_CHANNEL_UNION = 3
/**
 * 余额
 */
export const PAY_CHANNEL_BALANCE = 4
/**
 * 线下支付
 */
export const PAY_CHANNEL_OFFLINE = 5
/**
 * 授信
 */
export const PAY_CHANNEL_CREDIT = 6
/**
 * 货到付款
 */
export const PAY_CHANNEL_COD = 7
/**
 * 支付渠道对应中文
 */
export const PAY_CHANNEL = {
  [PAY_CHANNEL_INTEGRAL]: '积分支付',
  [PAY_CHANNEL_ALI]: '支付宝',
  [PAY_CHANNEL_WECHAT]: '微信',
  [PAY_CHANNEL_UNION]: '银联',
  [PAY_CHANNEL_BALANCE]: '余额',
  [PAY_CHANNEL_OFFLINE]: '线下支付',
  [PAY_CHANNEL_CREDIT]: '授信',
  [PAY_CHANNEL_COD]: '货到付款',
}

/****                ****/
/** 招标 ** 投标 ** 常量 */
/****               ****/

/** 采购类型 */
export const PURCHASE_TYPE = {
  1: '有固定采购金额',
  2: '无固定采购金额',
}

/** 招标方式 */
export const PUBLIC_BID = 1
export const SYSTEM_BID = 2
export const INVITE_BID = 3
export const CALLFORBID_TYPE_ENUM = {
  [PUBLIC_BID]: '公开招标',
  [SYSTEM_BID]: '系统匹配',
  [INVITE_BID]: '邀请招标',
}
export const CALLFORBID_TYPE = ['', '公开招标', '系统匹配', '邀请招标']

/** 专业类别 */
export const SpecialityTypeMap = {
  1: '工程类',
  2: '货物类',
  3: '服务类',
  4: '其他类',
}

/**  专家类型 */
export const ExpertTypeMap = {
  1: '招标人代表',
  2: '技术类专家',
  3: '特邀类专家',
  4: '其他类专家',
}

/** 招标 内部状态工作流状态 */
export enum BidInsideWorkState {
  /** 待提交审核招标 */
  Not_Submitted_Check_Invite_Tender = 1,
  /** 待审核招标 */
  Not_Tender_Check,
  /** 招标审核不通过 */
  Tender_Check_Not_Pass,
  /** 待提交招标 */
  Tender_Check_Pass,
  /** 已提交招标 */
  Submitted_Invite_Tender,
  /** 待审核报名 */
  Not_Register_Check,
  /** 待审核资格预审 */
  Not_Qualifications_Check,
  /** 待评标 */
  Not_Selection_Tender,
  /** 待提交评标报告 */
  Submitted_Selection_Tender,
  /** 待提交审核定标 */
  Not_Submitted_Check_Finish_Tender,
  /** 待审核定标 */
  Not_Check_Finish_Tender,
  /** 定标审核不通过 */
  Finish_Tender_Check_Not_Pass,
  /** 待确认定标 */
  Not_Confirm_Finish_Tender,
  /** 待中标公示 */
  Not_Win_Notice,
  /** 完成招标 */
  Finish_Invite_Tender,
  /** 已废标 */
  Discard_Tender,
}

/** 招标 内部状态 */
export const BidInStateTexts = {
  1: '待提交审核招标',
  2: '待审核招标',
  3: '招标审核不通过',
  4: '待提交招标',
  5: '已提交招标',
  6: '待审核报名',
  7: '待审核资格预审',
  8: '待评标',
  9: '待提交评标报告',
  10: '待提交审核定标',
  11: '待审核定标',
  12: '定标审核不通过',
  13: '待确认定标',
  14: '待中标公示',
  15: '完成招标',
  16: '已废标',
}

/** 招标 外部状态工作流状态 */
export enum BidOuterWorkState {
  /** 待提交招标 */
  Submitted_Invite_Tender = 1,
  /** 待平台审核招标 */
  Platform_Not_Check_Invite_Tender,
  /** 平台审核不通过 */
  Platform_Check_Not_Pass,
  /** 待招标报名 */
  Not_Invite_Tender_Register,
  /** 待审核报名 */
  Not_Check_Register_Check,
  /** 待提交资格预审 */
  Not_Submitted_Qualifications_Check,
  /** 待资格预审 */
  Not_Qualifications_Check,
  /** 待投标 */
  Not_Submit_Tender,
  /** 待开标 */
  Not_Open_Tender,
  /** 待评标 */
  Not_Selection_Tender,
  /** 待定标 */
  Not_Finish_Notice,
  /** 待中标公示 */
  Not_Win_Notice,
  /** 完成招标 */
  Finish_Invite_Tender,
  /** 已废标 */
  Discard_Tender,
}

/** 招标 外部状态 */
export const BidOutStateTexts = {
  1: '待提交招标',
  2: '待平台审核招标',
  3: '平台审核不通过',
  4: '待招标报名',
  5: '待审核报名',
  6: '待提交资格预审',
  7: '待资格预审',
  8: '待投标',
  9: '待开标',
  10: '待评标',
  11: '待定标',
  12: '待中标公示',
  13: '完成招标',
  14: '已废标',
}

/** 招标 内部操作文本 */
export const BidInOpeartTexts = {
  1: '新增招标',
  2: '审核招标',
  3: '提交招标',
  4: '审核报名',
  5: '审核资格',
  6: '完成评标',
  7: '提交评标报告',
  8: '选择中标会员',
  9: '审核定标',
  10: '确认招标',
  11: '发送中标公示',
  12: '完成招标',
  13: '已废标',
}

/** 招标 外部操作文本 */
export const BidOutOpeartTexts = {
  1: '新增招标',
  2: '平台审核招标',
  3: '招标报名',
  4: '审核报名',
  5: '提交资格预审',
  6: '资格预审',
  7: '提交投标',
  8: '开标',
  9: '评标',
  10: '定标',
  11: '发送中标公示',
  12: '完成招标',
  13: '已废标',
}

/** 投标 内部状态工作流状态 */
export enum TenderInsideWorkState {
  /** 待招标报名 */
  Not_Submitted_Invite_Tender_Register = 1,
  /** 已提交招标报名 */
  Submitted_Invite_Tender_Register,
  /** 待提交资格预审 */
  Not_Submitted_Qualifications_Check,
  /** 已提交资格预审 */
  Submitted_Qualifications_Check,
  /** 待新增投标 */
  Not_Save_Submit_Tender,
  /** 待提交审核投标 */
  Not_Submitted_Check_Submit_Tender,
  /** 待审核投标 */
  Submitted_Check_Submit_Tender,
  /** 投标审核不通过 */
  Check_Submit_Tender_Not_Pass,
  /** 待提交投标 */
  Not_Submitted_Submit_Tender,
  /** 已提交投标 */
  Submitted_Submit_Tender,
}

/** 投标 内部状态 */
export const TenderInStateTexts = {
  1: '待招标报名',
  2: '已提交招标报名',
  3: '待提交资格预审',
  4: '已提交资格预审',
  5: '待新增投标',
  6: '待提交审核投标',
  7: '待审核投标',
  8: '投标审核不通过',
  9: '待提交投标',
  10: '已提交投标',
}

/** 投标 外部状态工作流状态 */
export enum TenderOutWorkState {
  /** 待招标报名 */
  Not_Invite_Tender_Register = 1,
  /** 待审核报名 */
  Not_Check_Register_Check,
  /** 报名审核不通过 */
  Register_Check_Not_Pass,
  /** 待提交资格预审 */
  Not_Submitted_Qualifications_Check,
  /** 待资格预审 */
  Not_Qualifications_Check,
  /** 资格预审不通过 */
  Qualifications_Check_Not_Pass,
  /** 待投标 */
  Not_Submit_Tender,
  /** 待开标 */
  Not_Open_Tender,
  /** 待评标 */
  Not_Selection_Tender,
  /** 待定标 */
  Not_Finish_Notice,
  /** 待中标公示 */
  Not_Win_Notice,
  /** 完成招标 */
  Finish_Invite_Tender,
  /** 已废标 */
  Discard_Tender,
}

/** 投标 外部状态 */
export const TenderOutStateTexts = {
  1: '待招标报名',
  2: '待审核报名',
  3: '报名审核不通过',
  4: '待提交资格预审',
  5: '待资格预审',
  6: '资格预审不通过',
  7: '待投标',
  8: '待开标',
  9: '待评标',
  10: '待定标',
  11: '待中标公示',
  12: '完成招标',
  13: '已废标',
}

/** 投标 内部操作文本 */
export const TenderInOpeartTexts = {
  1: '投标报名',
  2: '审核报名',
  3: '审核资格',
  4: '审核投标',
  5: '完成评标',
  6: '选择中标会员',
  7: '审核定标',
  8: '确认招标',
  9: '发送中标公示',
  10: '完成招标',
  11: '已废标',
}

/** 专家抽取通知状态 */
export const ExpertRectractStatus = {
  1: '待发送',
  2: '待确认',
  3: '已确认',
  4: '已拒绝',
  5: '已评标',
}

/** 页面类型 */
export const SELECT_NAME = {
  1: '平台首页',
  2: '企业商城首页',
  3: '渠道服务首页',
  4: '积分商城首页',
  5: '企业直采首页',
  6: '物流服务首页',
  7: '加工服务首页',
  8: '行情资讯首页',
}

/** 门户类型 */
export enum DOORTYPE {
  /** 店铺门户 */
  STORE_DOORTYPE = 1,
  /** 渠道门户 */
  PLACE_DOORTYPE,
  /** 采购门户 */
  PROCUREMENT_DOORTYPE,
}

// 与srm相关的订单类型
export const SRM_ORDER_MODE_LIST = [
  12, // 采购询价
  13, // 采购招标
  14, // 采购竞价
  15, // 请购单采购
]

// 页面访问类型
export enum VISIT_TYPE {
  ADD = 'add',
  EDIT = 'edit',
  VIEW = 'view',
}
