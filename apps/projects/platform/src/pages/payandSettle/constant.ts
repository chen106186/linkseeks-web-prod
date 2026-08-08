/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-15 15:41:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-18 11:20:03
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import {
  CREDIT_REPAYMENT_STATUS_OUTSTANDING,
  CREDIT_REPAYMENT_STATUS_UNCONFIRMED,
  CREDIT_REPAYMENT_STATUS_PAID,
  CREDIT_REPAYMENT_STATUS_OVERDUE,
  CREDIT_OUTER_STATUS_UNCOMMITTED,
  CREDIT_OUTER_STATUS_UNCONFIRMED,
  CREDIT_OUTER_STATUS_SUCCESS,
  CREDIT_OUTER_STATUS_FAILED,
  CREDIT_INNER_STATUS_UNCOMMITTED,
  CREDIT_INNER_STATUS_COMMITTED_FAILED,
  CREDIT_INNER_STATUS_COMMITTED_SUCCESS,
  CREDIT_INNER_STATUS_FAILED_1,
  CREDIT_INNER_STATUS_SUCCESS_1,
  CREDIT_INNER_STATUS_SUCCESS_2,
  CREDIT_INNER_STATUS_FAILED_2,
  CREDIT_INNER_STATUS_FAILED_3,
  CREDIT_INNER_STATUS_SUCCESS_3,
  CREDIT_INNER_STATUS_FAILED,
  CREDIT_INNER_STATUS_CONFIRM_SUCCESS,
  CREDIT_STATUS_NOT_APPLIED,
  CREDIT_STATUS_APPLYING,
  CREDIT_STATUS_NORMAL,
  CREDIT_STATUS_FROZEN,
  CREDIT_INNER_STATUS_UNCOMMITTED_PURCHASER,
  CREDIT_INNER_STATUS_COMMITTED_PURCHASER,
} from '@/constants/payment'

const intl = getIntl()

// 授信状态 Badge map

// 账单交易状态
export const BILL_TRADE_STATUS_UNCONFIRMED = 1 // 待确认还款结果
export const BILL_TRADE_STATUS_OUTSTANDIND = 2 // 确认未到账
export const BILL_TRADE_STATUS_RECEIVED = 3 // 确认到账

// 账单状态 StatusTag map
export const BILL_TRADE_STATUS_TAB_MAP = {
  [BILL_TRADE_STATUS_UNCONFIRMED]: 'primary',
  [BILL_TRADE_STATUS_OUTSTANDIND]: 'danger',
  [BILL_TRADE_STATUS_RECEIVED]: 'success',
}

// 还款状态 StatusTag map
export const CREDIT_REPAYMENT_STATUS_TAG_MAP = {
  [CREDIT_REPAYMENT_STATUS_OUTSTANDING]: 'default',
  [CREDIT_REPAYMENT_STATUS_UNCONFIRMED]: 'primary',
  [CREDIT_REPAYMENT_STATUS_PAID]: 'success',
  [CREDIT_REPAYMENT_STATUS_OVERDUE]: 'danger',
}

// 授信状态 Badge map
export const CREDIT_STATUS_BADGE_MAP = {
  [CREDIT_STATUS_NOT_APPLIED]: '#FF991F',
  [CREDIT_STATUS_APPLYING]: '#00A98F',
  [CREDIT_STATUS_NORMAL]: '#00A98F',
  [CREDIT_STATUS_FROZEN]: '#E63F3B',
}

// 授信状态 StatusTag map
export const CREDIT_STATUS_TAG_MAP = {
  [CREDIT_STATUS_NOT_APPLIED]: 'warning',
  [CREDIT_STATUS_APPLYING]: 'success',
  [CREDIT_STATUS_NORMAL]: 'success',
  [CREDIT_STATUS_FROZEN]: 'danger',
}

// 授信外部状态
export const CREDIT_OUTER_STATUS_TAG_MAP = {
  [CREDIT_OUTER_STATUS_UNCOMMITTED]: 'default',
  [CREDIT_OUTER_STATUS_UNCONFIRMED]: 'primary',
  [CREDIT_OUTER_STATUS_SUCCESS]: 'success',
  [CREDIT_OUTER_STATUS_FAILED]: 'danger',
}

// 授信内部部状态 Badge map
export const CREDIT_INNER_STATUS_BADGE_MAP = {
  [CREDIT_INNER_STATUS_UNCOMMITTED]: '#669EDE',
  [CREDIT_INNER_STATUS_COMMITTED_FAILED]: '#EF6260',
  [CREDIT_INNER_STATUS_COMMITTED_SUCCESS]: '#41CC9E',
  [CREDIT_INNER_STATUS_FAILED_1]: '#EF6260',
  [CREDIT_INNER_STATUS_SUCCESS_1]: '#41CC9E',
  [CREDIT_INNER_STATUS_FAILED_2]: '#EF6260',
  [CREDIT_INNER_STATUS_SUCCESS_2]: '#41CC9E',
  [CREDIT_INNER_STATUS_FAILED_3]: '#EF6260',
  [CREDIT_INNER_STATUS_SUCCESS_3]: '#41CC9E',
  [CREDIT_INNER_STATUS_FAILED]: '#EF6260',
  [CREDIT_INNER_STATUS_CONFIRM_SUCCESS]: '#41CC9E',
  [CREDIT_INNER_STATUS_FAILED]: '#EF6260',
}

// 授信内部部状态 Badge map
export const CREDIT_INNER_STATUS_BADGE_MAP_PURCHASER = {
  [CREDIT_INNER_STATUS_UNCOMMITTED_PURCHASER]: '#669EDE',
  [CREDIT_INNER_STATUS_COMMITTED_PURCHASER]: '#41CC9E',
}

/**
 * 资金账户相关常量
 */

// 交易记录状态
export const statusMap = {
  '1': { title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.1' }), type: 'warning' },
  '2': { title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.2' }), type: 'success' },
  '3': { title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.3' }), type: 'default' },
  '4': { title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.4' }), type: 'success' },
  '5': { title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.5' }), type: 'danger' },
  '6': {
    title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.6' }),
    type: 'processing',
  },
  '7': { title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.7' }), type: 'danger' },
  '8': { title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.8' }), type: 'success' },
  '9': { title: intl.formatMessage({ id: 'payandSettle.constant.statusMap.9' }), type: 'success' },
}

// 流转状态
export const moveStatusMap = {
  '2': {
    title: intl.formatMessage({ id: 'payandSettle.constant.moveStatusMap.1' }),
    type: 'danger',
  },
  '1': {
    title: intl.formatMessage({ id: 'payandSettle.constant.moveStatusMap.2' }),
    type: 'success',
  },
}

// 会员状态
export const memberStatusMap = {
  '1': {
    title: intl.formatMessage({ id: 'payandSettle.constant.memberStatusMap.1' }),
    type: 'success',
  },
  '2': {
    title: intl.formatMessage({ id: 'payandSettle.constant.memberStatusMap.2' }),
    type: 'danger',
  },
}

// 账户状态
export const accountStatusMap = {
  '1': {
    title: intl.formatMessage({ id: 'payandSettle.constant.accountStatusMap.1' }),
    className: 'commonStatusValid',
  },
  '2': {
    title: intl.formatMessage({ id: 'payandSettle.constant.accountStatusMap.2' }),
    className: 'commonStatusNoPass',
  },
}

// 会员等级类型
export const memberLevelTypeMap = {
  '1': intl.formatMessage({ id: 'payandSettle.constant.memberLevelTypeMap.1' }),
  '2': intl.formatMessage({ id: 'payandSettle.constant.memberLevelTypeMap.2' }),
  '3': intl.formatMessage({ id: 'payandSettle.constant.memberLevelTypeMap.3' }),
}

// 操作项目
export const operationMap = {
  '1': { title: intl.formatMessage({ id: 'payandSettle.constant.operationMap.1' }), operator: '+' },
  '2': { title: intl.formatMessage({ id: 'payandSettle.constant.operationMap.2' }), operator: '-' },
  '3': { title: intl.formatMessage({ id: 'payandSettle.constant.operationMap.3' }), operator: '-' },
  '4': { title: intl.formatMessage({ id: 'payandSettle.constant.operationMap.4' }), operator: '+' },
  '5': { title: intl.formatMessage({ id: 'payandSettle.constant.operationMap.5' }), operator: '+' },
}

// 会员类型
export const accountMemberType = {
  '1': intl.formatMessage({ id: 'payandSettle.constant.accountMemberType.1' }),
  '2': intl.formatMessage({ id: 'payandSettle.constant.accountMemberType.2' }),
  '3': intl.formatMessage({ id: 'payandSettle.constant.accountMemberType.3' }),
  '4': intl.formatMessage({ id: 'payandSettle.constant.accountMemberType.4' }),
}
