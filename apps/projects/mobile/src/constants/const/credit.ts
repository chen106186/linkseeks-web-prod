/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-05 11:05:54
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-03-15 11:47:17
 * @Description: 授信模块相关常量
 */
import themeColors from '../colors';

/* --------------------------------- 授信状态 -------------------------------- */
/**
 * 未申请
 */
export const CREDIT_STATUS_NOT_APPLIED = 1;
/**
 * 申请中
 */
export const CREDIT_STATUS_APPLYING = 2;
/**
 * 正常
 */
export const CREDIT_STATUS_NORMAL = 3;
/**
 * 已冻结
 */
export const CREDIT_STATUS_FROZEN = 4;
/**
 * 授信状态中文文本
 */
export const CREDIT_STATUS = {
  [CREDIT_STATUS_NOT_APPLIED]: '未申请',
  [CREDIT_STATUS_APPLYING]: '申请中',
  [CREDIT_STATUS_NORMAL]: '正常',
  [CREDIT_STATUS_FROZEN]: '已冻结',
};
/**
 * 授信状态 Badge map
 */
export const CREDIT_STATUS_BADGE_MAP: { [key: number]: string } = {
  [CREDIT_STATUS_NOT_APPLIED]: 'gray',
  [CREDIT_STATUS_APPLYING]: 'blue',
  [CREDIT_STATUS_NORMAL]: 'green',
  [CREDIT_STATUS_FROZEN]: 'red',
};

/* --------------------------------- 授信还款状态 -------------------------------- */
/**
 * 账单待还
 */
export const CREDIT_REPAYMENT_STATUS_OUTSTANDING = 1;
/**
 * 待确认还款结果
 */
export const CREDIT_REPAYMENT_STATUS_UNCONFIRMED = 2;
/**
 * 账单已还
 */
export const CREDIT_REPAYMENT_STATUS_PAID = 3;
/**
 * 逾期
 */
export const CREDIT_REPAYMENT_STATUS_OVERDUE = 4;
/**
 * 授信还款状态中文文本
 */
export const CREDIT_REPAYMENT_STATUS: { [key: number]: string } = {
  [CREDIT_REPAYMENT_STATUS_OUTSTANDING]: '账单待还',
  [CREDIT_REPAYMENT_STATUS_UNCONFIRMED]: '待确认还款结果',
  [CREDIT_REPAYMENT_STATUS_PAID]: '账单已还',
  [CREDIT_REPAYMENT_STATUS_OVERDUE]: '逾期',
};

/* --------------------------------- 授信账单记录状态 -------------------------------- */
/**
 * 待确认还款结果
 */
export const CREDIT_BILL_TRADE_STATUS_UNCONFIRMED = 1;
/**
 * 确认未到账
 */
export const CREDIT_BILL_TRADE_STATUS_NOT_RECEIVED = 2;
/**
 * 确认到账
 */
export const CREDIT_BILL_TRADE_STATUS_RECEIVED = 3;
/**
 * 授信账单记录状态中文文本
 */
export const CREDIT_BILL_TRADE_STATUS = {
  [CREDIT_BILL_TRADE_STATUS_UNCONFIRMED]: '待确认还款结果',
  [CREDIT_BILL_TRADE_STATUS_NOT_RECEIVED]: '确认未到账',
  [CREDIT_BILL_TRADE_STATUS_RECEIVED]: '确认到账',
};
/**
 * 授信账单记录状态 StatusText map
 */
export const CREDIT_BILL_TRADE_STATUSTEXT_MAP: { [key: number]: ('primary' | 'success' | 'danger') } = {
  [CREDIT_BILL_TRADE_STATUS_UNCONFIRMED]: 'primary',
  [CREDIT_BILL_TRADE_STATUS_NOT_RECEIVED]: 'danger',
  [CREDIT_BILL_TRADE_STATUS_RECEIVED]: 'success',
};

/* --------------------------------- 授信账单交易项目 -------------------------------- */
/**
 * 订单支付
 */
export const CREDIT_BILL_OPERATION_ORDER_PAY = 1;
/**
 * 订单退款
 */
export const CREDIT_BILL_OPERATION_ORDER_REFUND = 2;
/**
 * 还款
 */
export const CREDIT_BILL_OPERATION_REPAYMENT = 3;
/**
 * 授信账单交易项目中文文本
 */
export const CREDIT_BILL_OPERATION: { [key: number]: string } = {
  [CREDIT_BILL_OPERATION_ORDER_PAY]: '订单支付',
  [CREDIT_BILL_OPERATION_ORDER_REFUND]: '订单退款',
  [CREDIT_BILL_OPERATION_REPAYMENT]: '还款',
};

/* --------------------------------- 授信申请内部状态 -------------------------------- */
/**
 * 待提交
 */
export const CREDIT_INNER_STATUS_UNCOMMITTED = 1;
/**
 * 已提交
 */
export const CREDIT_INNER_STATUS_COMMITTED = 2;

/* --------------------------------- 授信申请外部状态 -------------------------------- */
/**
 * 待提交
 */
export const CREDIT_OUTER_STATUS_UNCOMMITTED = 1;
/**
 * 待确认
 */
export const CREDIT_OUTER_STATUS_UNCONFIRMED = 2;
/**
 * 接受申请
 */
export const CREDIT_OUTER_STATUS_SUCCESS = 3;
/**
 * 不接受申请
 */
export const CREDIT_OUTER_STATUS_FAILED = 4;
/**
 * 授信申请外部状态 Badge map
 */
export const CREDIT_OUTER_STATUS_BADGE_MAP: { [key: number]: string } = {
  [CREDIT_OUTER_STATUS_UNCOMMITTED]: 'gray',
  [CREDIT_OUTER_STATUS_UNCONFIRMED]: 'blue',
  [CREDIT_OUTER_STATUS_SUCCESS]: 'green',
  [CREDIT_OUTER_STATUS_FAILED]: 'red',
};
/**
 * 外部状态 color map
 */
export const OUTER_STATUS_COLOR_MAP: { [key: number]: [string, string] } = {
  [CREDIT_OUTER_STATUS_UNCOMMITTED]: [
    '#606266',
    '#EBECF0',
  ],
  [CREDIT_OUTER_STATUS_UNCONFIRMED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [CREDIT_OUTER_STATUS_FAILED]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [CREDIT_OUTER_STATUS_SUCCESS]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
};
