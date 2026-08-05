import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 订单类型
 *
 * ALL 全部
 *
 * STORE_PURCHASE 现货采购
 *
 * INQUIRY_PURCHASE 询价采购
 *
 * CHANNEL_PURCHASE 渠道直采
 *
 * CHANNEL_STORE 渠道现货
 */
export const ORDER_TYPE = {
  ALL: intl.formatMessage({ id: 'order.all', defaultMessage: '全部' }),
  STORE_PURCHASE: intl.formatMessage({ id: 'order.storePurchase', defaultMessage: '现货采购' }),
  INQUIRY_PURCHASE: intl.formatMessage({ id: 'order.inquiryPurchase', defaultMessage: '询价采购' }),
  CHANNEL_PURCHASE: intl.formatMessage({ id: 'order.channelPurchase', defaultMessage: '渠道直采' }),
  CHANNEL_STORE: intl.formatMessage({ id: 'order.channelStore', defaultMessage: '渠道现货' }),
}

// 订单审核状态
export const ORDER_EXAMINE_STATUS = {
  ALL: intl.formatMessage({ id: 'order.all', defaultMessage: '全部' }),
  TO_BE_SUBMITTED: intl.formatMessage({ id: 'order.toBeSubmitted', defaultMessage: '待提交审核' }),
  REVIEWED_LEVEL_1: intl.formatMessage({ id: 'order.reviewedLevel1', defaultMessage: '待审核(一级)' }),
  REVIEWED_LEVEL_2: intl.formatMessage({ id: 'order.reviewedLevel2', defaultMessage: '待审核(二级)' }),
  TO_BE_CONFIRMED: intl.formatMessage({ id: 'order.toBeConfirmed', defaultMessage: '待确认' }),
}

// 订单类型对应的值
export const ORDER_TYPE_VALUE_MAP = {
  ALL: '', // 全部
  STORE_PURCHASE: 3, // 现货采购
  INQUIRY_PURCHASE: 1, // 询价采购
  CHANNEL_PURCHASE: 5, // 渠道直采
  CHANNEL_STORE: 6, // 渠道现货
}

// 值对应的类型
export const ORDER_VALUE_TYPE = {
  [ORDER_TYPE_VALUE_MAP.STORE_PURCHASE]: intl.formatMessage({ id: 'order.storePurchase', defaultMessage: '现货采购' }),
  [ORDER_TYPE_VALUE_MAP.INQUIRY_PURCHASE]: intl.formatMessage({
    id: 'order.inquiryPurchase',
    defaultMessage: '询价采购',
  }),
  [ORDER_TYPE_VALUE_MAP.CHANNEL_PURCHASE]: intl.formatMessage({
    id: 'order.channelPurchase',
    defaultMessage: '渠道直采',
  }),
  [ORDER_TYPE_VALUE_MAP.CHANNEL_STORE]: intl.formatMessage({ id: 'order.channelStore', defaultMessage: '渠道现货' }),
}

// 订单内部状态对应的值
export enum ORDER_INNER_STATUS {
  TO_BE_SUBMITTED = 101, // 待提交审核
  REVIEWED_LEVEL_1 = 103, // 待审核(一级)
  REVIEWED_LEVEL_2 = 105, // 待审核(二级)
  TO_BE_CONFIRMED = 107, // 待确认
}

// 订单审核列表按钮文本
export const INNER_STATUS_LIST_BTN = {
  [ORDER_INNER_STATUS.TO_BE_SUBMITTED]: intl.formatMessage({ id: 'order.submitForReview', defaultMessage: '提交审核' }),
  [ORDER_INNER_STATUS.REVIEWED_LEVEL_1]: intl.formatMessage({ id: 'order.review', defaultMessage: '审核' }),
  [ORDER_INNER_STATUS.REVIEWED_LEVEL_2]: intl.formatMessage({ id: 'order.review', defaultMessage: '审核' }),
  [ORDER_INNER_STATUS.TO_BE_CONFIRMED]: intl.formatMessage({ id: 'order.confirm', defaultMessage: '确认' }),
}

// 订单审核详情同意按钮文本
export const INNER_STATUS_AGREE_BTN = {
  [ORDER_INNER_STATUS.TO_BE_SUBMITTED]: intl.formatMessage({ id: 'order.approved', defaultMessage: '审核通过' }),
  [ORDER_INNER_STATUS.REVIEWED_LEVEL_1]: intl.formatMessage({ id: 'order.approved', defaultMessage: '审核通过' }),
  [ORDER_INNER_STATUS.REVIEWED_LEVEL_2]: intl.formatMessage({ id: 'order.approved', defaultMessage: '审核通过' }),
  [ORDER_INNER_STATUS.TO_BE_CONFIRMED]: intl.formatMessage({
    id: 'order.confirmationPassed',
    defaultMessage: '确认通过',
  }),
}

// 订单审核详情不同意按钮文本
export const INNER_STATUS_DISAGREE_BTN = {
  [ORDER_INNER_STATUS.TO_BE_SUBMITTED]: intl.formatMessage({ id: 'order.notApproved', defaultMessage: '审核不通过' }),
  [ORDER_INNER_STATUS.REVIEWED_LEVEL_1]: intl.formatMessage({ id: 'order.notApproved', defaultMessage: '审核不通过' }),
  [ORDER_INNER_STATUS.REVIEWED_LEVEL_2]: intl.formatMessage({ id: 'order.notApproved', defaultMessage: '审核不通过' }),
  [ORDER_INNER_STATUS.TO_BE_CONFIRMED]: intl.formatMessage({
    id: 'order.confirmationFailed',
    defaultMessage: '确认不通过',
  }),
}

// 订单外部部状态对应的值
export enum ORDER_OUTER_STATUS {
  TO_PAY = 6, // 待支付
}
