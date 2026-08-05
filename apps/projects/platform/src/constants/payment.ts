import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
/**
 * ****支付能力 相关常量****
 */

/**
 *
 * 其中包括：支付方式管理，授信申请，授信管理，资金账户和资金账户管理
 *
 */

// 授信内部状态（上级）

/**
 * 待提交审核
 */
export const CREDIT_INNER_STATUS_UNCOMMITTED = 1
/**
 * 提交审核失败
 */
export const CREDIT_INNER_STATUS_COMMITTED_FAILED = 2
/**
 * 提交审核成功
 */
export const CREDIT_INNER_STATUS_COMMITTED_SUCCESS = 3
/**
 * 一级审核失败
 */
export const CREDIT_INNER_STATUS_FAILED_1 = 4
/**
 * 一级审核通过
 */
export const CREDIT_INNER_STATUS_SUCCESS_1 = 5
/**
 * 二级审核失败
 */
export const CREDIT_INNER_STATUS_FAILED_2 = 6
/**
 * 二级审核通过
 */
export const CREDIT_INNER_STATUS_SUCCESS_2 = 7
/**
 * 三级审核失败
 */
export const CREDIT_INNER_STATUS_FAILED_3 = 8
/**
 * 三级审核通过
 */
export const CREDIT_INNER_STATUS_SUCCESS_3 = 9
/**
 * 审核不通过
 */
export const CREDIT_INNER_STATUS_FAILED = 10
/**
 * 审核通过
 */
export const CREDIT_INNER_STATUS_CONFIRM_SUCCESS = 11
export const CREDIT_INNER_STATUS = {
  [CREDIT_INNER_STATUS_UNCOMMITTED]: translate('web.resource.order.addOfferTasksStep1'),
  [CREDIT_INNER_STATUS_COMMITTED_FAILED]: translate('web.resource.order.tijiaoshenheshibai'),
  [CREDIT_INNER_STATUS_COMMITTED_SUCCESS]: translate('web.resource.order.tijiaoshenhechenggong'),
  [CREDIT_INNER_STATUS_FAILED_1]: translate('web.resource.order.verifyFailed1'),
  [CREDIT_INNER_STATUS_SUCCESS_1]: translate('web.resource.order.verifySuccess1'),
  [CREDIT_INNER_STATUS_FAILED_2]: translate('web.resource.order.verifyFailed2'),
  [CREDIT_INNER_STATUS_SUCCESS_2]: translate('web.resource.order.verifySuccess2'),
  [CREDIT_INNER_STATUS_FAILED_3]: translate('web.resource.order.verifyFailed3'),
  [CREDIT_INNER_STATUS_SUCCESS_3]: translate('web.resource.order.verifySuccess3'),
  [CREDIT_INNER_STATUS_FAILED]: translate('web.resource.order.verifyFailed'),
  [CREDIT_INNER_STATUS_CONFIRM_SUCCESS]: translate('web.resource.order.verifySuccess'),
}

// 授信内部状态（下级）

/**
 * 待提交
 */
export const CREDIT_INNER_STATUS_UNCOMMITTED_PURCHASER = 1
/**
 * 已提交
 */
export const CREDIT_INNER_STATUS_COMMITTED_PURCHASER = 2
export const CREDIT_INNER_STATUS_PURCHASER = {
  [CREDIT_INNER_STATUS_UNCOMMITTED_PURCHASER]: translate('web.resource.order.daitijiao'),
  [CREDIT_INNER_STATUS_COMMITTED_PURCHASER]: translate('web.common.yitijiao'),
}

// 授信外部状态

/**
 * 待提交
 */
export const CREDIT_OUTER_STATUS_UNCOMMITTED = 1
/**
 * 待确认
 */
export const CREDIT_OUTER_STATUS_UNCONFIRMED = 2
/**
 * 接受申请
 */
export const CREDIT_OUTER_STATUS_SUCCESS = 3
/**
 * 不接受申请
 */
export const CREDIT_OUTER_STATUS_FAILED = 4
export const CREDIT_OUTER_STATUS = {
  [CREDIT_OUTER_STATUS_UNCOMMITTED]: translate('web.resource.order.daitijiao'),
  [CREDIT_OUTER_STATUS_UNCONFIRMED]: translate('web.resource.order.daiqueren'),
  [CREDIT_OUTER_STATUS_SUCCESS]: translate('web.resource.order.jieshoushenqing'),
  [CREDIT_OUTER_STATUS_FAILED]: translate('web.resource.order.bujieshoushenqing'),
}

// 授信还款状态

/**
 * 账单待还
 */
export const CREDIT_REPAYMENT_STATUS_OUTSTANDING = 1
/**
 * 待确认还款结果
 */
export const CREDIT_REPAYMENT_STATUS_UNCONFIRMED = 2
/**
 * 账单已还
 */
export const CREDIT_REPAYMENT_STATUS_PAID = 3
/**
 * 逾期
 */
export const CREDIT_REPAYMENT_STATUS_OVERDUE = 4
export const CREDIT_REPAYMENT_STATUS = {
  [CREDIT_REPAYMENT_STATUS_OUTSTANDING]: translate('web.resource.payment.zhangdandaihuan'),
  [CREDIT_REPAYMENT_STATUS_UNCONFIRMED]: translate('web.resource.payment.daiquerenhuankuanjieguo'),
  [CREDIT_REPAYMENT_STATUS_PAID]: translate('web.resource.payment.zhangdanyihuan'),
  [CREDIT_REPAYMENT_STATUS_OVERDUE]: translate('web.resource.payment.yuqi'),
}

// 授信状态

/**
 * 未申请
 */
export const CREDIT_STATUS_NOT_APPLIED = 1
/**
 * 申请中
 */
export const CREDIT_STATUS_APPLYING = 2
/**
 * 正常
 */
export const CREDIT_STATUS_NORMAL = 3
/**
 * 已冻结
 */
export const CREDIT_STATUS_FROZEN = 4
export const CREDIT_STATUS = {
  [CREDIT_STATUS_NOT_APPLIED]: translate('web.common.weishenqing'),
  [CREDIT_STATUS_APPLYING]: translate('web.common.shenqingzhong'),
  [CREDIT_STATUS_NORMAL]: translate('web.common.zhengchang'),
  [CREDIT_STATUS_FROZEN]: translate('web.common.yidongjie'),
}

// 账单交易项目

/**
 * 订单支付
 */
export const BILL_TRADE_OPERATION_ORDER_PAY = 1
/**
 * 订单退款
 */
export const BILL_TRADE_OPERATION_ORDER_RETURN = 2
/**
 * 还款
 */
export const BILL_TRADE_OPERATION_REPAYMENT = 3
export const BILL_TRADE_OPERATION = {
  [BILL_TRADE_OPERATION_ORDER_PAY]: translate('web.resource.payment.dingdanzhifu'),
  [BILL_TRADE_OPERATION_ORDER_RETURN]: translate('web.resource.payment.dingdantuikuan'),
  [BILL_TRADE_OPERATION_REPAYMENT]: translate('web.resource.payment.huankuan'),
}

// 支付渠道

/**
 * 无需支付
 */
export const PAY_CHANNEL_FREE = 0
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
 * 线下支付线上确认
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
 * 月结
 */
export const PAY_CHANNEL_MONTHLY_STATEMENT = 8
/**
 * 账期
 */
export const PAY_CHANNEL_PAYMENT_DAYS = 9
/**
 * 积分支付
 */
export const PAY_CHANNEL_INTEGRAL = 10

// 支付方式

/**
 * 线上支付
 */
export const PAY_WAY_ONLINE = 1
/**
 * 线下支付
 */
export const PAY_WAY_OFFLINE = 2
/**
 * 授信支付
 */
export const PAY_WAY_CREDIT = 3
/**
 * 货到付款
 */
export const PAY_WAY_COD = 4
/**
 * 账期
 */
export const PAY_WAY_DEADLINE = 5
/**
 * 月结
 */
export const PAY_WAY_MONTH = 6
/**
 * 合同内清算
 */
export const PAY_WAY_CONTRACT = 7

/**
 * 支付方式对应中文
 */
export const PAYWAY = {
  [PAY_WAY_ONLINE]: '线上支付',
  [PAY_WAY_OFFLINE]: '线下支付',
  [PAY_WAY_CREDIT]: '授信支付',
  [PAY_WAY_COD]: '货到付款',
  [PAY_WAY_DEADLINE]: '账期',
  [PAY_WAY_MONTH]: '月结',
  [PAY_WAY_CONTRACT]: '合同内清算',
}
