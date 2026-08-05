/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-16 16:33:38
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-03-24 17:50:17
 * @Description: 售后退货模块相关常量
 */
import themeColors from '../colors';

/* --------------------------------- 售后退款内部状态 -------------------------------- */
/**
 * 待提交
 */
export const REFUND_INNER_STATUS_UNCOMMITTED = 1;
/**
 * 提交审核
 */
export const REFUND_INNER_STATUS_COMMITTED = 2;
/**
 * 一级审核通过
 */
export const REFUND_INNER_STATUS_SUCCESS_1 = 3;
/**
 * 二级审核通过
 */
export const REFUND_INNER_STATUS_SUCCESS_2 = 4;
/**
 * 审核不通过(二级)
 */
export const REFUND_INNER_STATUS_UNACCEPTABLE = 5;
/**
 * 确认接受申请
 */
export const REFUND_INNER_STATUS_CONFIRMED_ACCEPTABLE = 6;
/**
 * 确认不接受申请
 */
export const REFUND_INNER_STATUS_CONFIRMED_UNACCEPTABLE = 7;
/**
 * 待新增退货发货单
 */
export const REFUND_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY = 8;
/**
 * 待审核退货发货单
 */
export const REFUND_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY = 9;
/**
 * 采购商待新增物流单
 */
export const REFUND_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS = 10;
/**
 * 采购商待确认物流单
 */
export const REFUND_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS = 11;
/**
 * 待确认退货发货
 */
export const REFUND_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY = 12;
/**
 * 待新增退货入库单
 */
export const REFUND_INNER_STATUS_NOT_ADDED_REFUND_STORAGE = 13;
/**
 * 待审核退货入库单
 */
export const REFUND_INNER_STATUS_UNREVIEWED_REFUND_STORAGE = 14;
/**
 * 待确认退货收货
 */
export const REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIVE = 15;
/**
 * 待确认退货回单
 */
export const REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT = 16;
/**
 * 待退款
 */
export const REFUND_INNER_STATUS_TO_BE_REFUNDED = 17;
/**
 * 待确认退款
 */
export const REFUND_INNER_STATUS_UNCONFIRMED_REFUNDED = 18;
/**
 * 退款失败
 */
export const REFUND_INNER_STATUS_REFUNDED_FAIL = 19;
/**
 * 退款成功
 */
export const REFUND_INNER_STATUS_REFUNDED_SUCCESS = 20;
/**
 * 待确认售后完成
 */
export const REFUND_INNER_STATUS_UNCONFIRMED_FINISHED = 21;
/**
 * 确认售后完成
 */
export const REFUND_INNER_STATUS_FINISHED = 22;
/**
 * 不接受物流单
 */
export const REFUND_INNER_STATUS_UNACCEPTED_LOGISTICS = 23;
/**
 * 审核不通过(提交)
 */
export const REFUND_INNER_STATUS_COMMIT_FAILED = 24;
/**
 * 审核不通过(一级)
 */
export const REFUND_INNER_STATUS_FAILED_1 = 25;
/**
 * 售后退款内部状态 Badge map
 */
export const REFUND_INNER_STATUS_BADGE_MAP: { [key: number]: string } = {
  [REFUND_INNER_STATUS_UNCOMMITTED]: 'gray',
  [REFUND_INNER_STATUS_COMMITTED]: 'green',
  [REFUND_INNER_STATUS_SUCCESS_1]: 'blue',
  [REFUND_INNER_STATUS_SUCCESS_2]: 'blue',
  [REFUND_INNER_STATUS_UNACCEPTABLE]: 'red',
  [REFUND_INNER_STATUS_CONFIRMED_ACCEPTABLE]: 'green',
  [REFUND_INNER_STATUS_CONFIRMED_UNACCEPTABLE]: 'red',
  [REFUND_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY]: 'red',
  [REFUND_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY]: 'orange',
  [REFUND_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: 'red',
  [REFUND_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS]: 'orange',
  [REFUND_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY]: 'blue',
  [REFUND_INNER_STATUS_NOT_ADDED_REFUND_STORAGE]: 'red',
  [REFUND_INNER_STATUS_UNREVIEWED_REFUND_STORAGE]: 'orange',
  [REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIVE]: 'blue',
  [REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT]: 'blue',
  [REFUND_INNER_STATUS_TO_BE_REFUNDED]: 'red',
  [REFUND_INNER_STATUS_UNCONFIRMED_REFUNDED]: 'blue',
  [REFUND_INNER_STATUS_REFUNDED_FAIL]: 'red',
  [REFUND_INNER_STATUS_REFUNDED_SUCCESS]: 'green',
  [REFUND_INNER_STATUS_UNCONFIRMED_FINISHED]: 'blue',
  [REFUND_INNER_STATUS_FINISHED]: 'green',
  [REFUND_INNER_STATUS_UNACCEPTED_LOGISTICS]: 'red',
  [REFUND_INNER_STATUS_COMMIT_FAILED]: 'red',
  [REFUND_INNER_STATUS_FAILED_1]: 'red',
};
/**
 * 售后退款内部状态 color map
 */
export const REFUND_INNER_STATUS_COLOR_MAP: { [key: number]: [string, string] } = {
  [REFUND_INNER_STATUS_UNCOMMITTED]: [
    '#606266',
    '#EBECF0',
  ],
  [REFUND_INNER_STATUS_COMMITTED]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
  [REFUND_INNER_STATUS_SUCCESS_1]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_INNER_STATUS_SUCCESS_2]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_INNER_STATUS_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_CONFIRMED_ACCEPTABLE]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
  [REFUND_INNER_STATUS_CONFIRMED_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [REFUND_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [REFUND_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_INNER_STATUS_NOT_ADDED_REFUND_STORAGE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_UNREVIEWED_REFUND_STORAGE]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIVE]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_INNER_STATUS_TO_BE_REFUNDED]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_UNCONFIRMED_REFUNDED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_INNER_STATUS_REFUNDED_FAIL]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_REFUNDED_SUCCESS]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
  [REFUND_INNER_STATUS_UNCONFIRMED_FINISHED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_INNER_STATUS_FINISHED]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
  [REFUND_INNER_STATUS_UNACCEPTED_LOGISTICS]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_COMMIT_FAILED]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_INNER_STATUS_FAILED_1]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
};

/* --------------------------------- 售后退款外部状态 -------------------------------- */
/**
 * 待提交申请单
 */
export const REFUND_OUTER_STATUS_UNCOMMITTED = 1;
/**
 * 待确认申请单
 */
export const REFUND_OUTER_STATUS_UNCONFIRMED = 2;
/**
 * 不接受申请
 */
export const REFUND_OUTER_STATUS_UNACCEPTABLE = 3;
/**
 * 接受申请
 */
export const REFUND_OUTER_STATUS_ACCEPTABLE = 4;
/**
 * 待新增退货发货单
 */
export const REFUND_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY = 5;
/**
 * 采购商待新增物流单
 */
export const REFUND_OUTER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS = 6;
/**
 * 待退货发货
 */
export const REFUND_OUTER_STATUS_REFUND_DELIVERY = 7;
/**
 * 待新增退货入库单
 */
export const REFUND_OUTER_STATUS_NOT_ADDED_REFUND_STORAGE = 8;
/**
 * 待退货收货
 */
export const REFUND_OUTER_STATUS_REFUND_RECEIVE = 9;
/**
 * 待确认退货回单
 */
export const REFUND_OUTER_STATUS_UNCONFIRMED_REFUND_RECEIPT = 10;
/**
 * 待退款
 */
export const REFUND_OUTER_STATUS_TO_BE_REFUNDED = 11;
/**
 * 待确认退款
 */
export const REFUND_OUTER_STATUS_UNCONFIRMED_REFUNDED = 12;
/**
 * 确认退款未到账
 */
export const REFUND_OUTER_STATUS_NOT_RECEIVED = 13;
/**
 * 待确认售后完成
 */
export const REFUND_OUTER_STATUS_UNCONFIRMED_FINISHED = 14;
/**
 * 售后完成
 */
export const REFUND_OUTER_STATUS_FINISHED = 15;
/**
 * 售后退款外部状态 color map
 */
export const REFUND_OUTER_STATUS_COLOR_MAP: { [key: number]: [string, string] } = {
  [REFUND_OUTER_STATUS_UNCOMMITTED]: [
    '#606266',
    '#EBECF0',
  ],
  [REFUND_OUTER_STATUS_UNCONFIRMED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_OUTER_STATUS_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_OUTER_STATUS_ACCEPTABLE]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_OUTER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_OUTER_STATUS_REFUND_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_OUTER_STATUS_NOT_ADDED_REFUND_STORAGE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_OUTER_STATUS_REFUND_RECEIVE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_OUTER_STATUS_UNCONFIRMED_REFUND_RECEIPT]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_OUTER_STATUS_TO_BE_REFUNDED]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REFUND_OUTER_STATUS_UNCONFIRMED_REFUNDED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_OUTER_STATUS_NOT_RECEIVED]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [REFUND_OUTER_STATUS_UNCONFIRMED_FINISHED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REFUND_OUTER_STATUS_FINISHED]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
};

/* --------------------------------- 退货发货明细内部状态 -------------------------------- */
/**
 * 未确认发货
 */
export const MAIL_INNER_STATUS_UNCONFIRMED_DELIVER = 1;
/**
 * 已确认发货
 */
export const MAIL_INNER_STATUS_CONFIRMED_DELIVER = 2;
/**
 * 已确认收货
 */
export const MAIL_INNER_STATUS_CONFIRMED_RECEIVING = 3;
/**
 * 确认回单
 */
export const MAIL_INNER_STATUS_CONFIRMED_BACK = 4;
/**
 * 售后退款内部状态 Badge map
 */
export const MAIL_INNER_STATUS_BADGE_MAP: { [key: number]: string } = {
  [MAIL_INNER_STATUS_UNCONFIRMED_DELIVER]: 'gray',
  [MAIL_INNER_STATUS_CONFIRMED_DELIVER]: 'green',
  [MAIL_INNER_STATUS_CONFIRMED_RECEIVING]: 'gray',
  [MAIL_INNER_STATUS_CONFIRMED_BACK]: 'green',
};

/* --------------------------------- 退货工作流相关 -------------------------------- */
/**
 * 售后退货外部流转
 */
export const REFUND_GOODS_OUTER_DELIVERY = 18;
/**
 * 售后退货手工发货
 */
export const REFUND_GOODS_MANUAL_DELIVERY = 31;

/* --------------------------------- 退款明细内部状态 -------------------------------- */
/**
 * 未退款
 */
export const RETURN_INNER_STATUS_NO_REFUND = 1;
/**
 * 退款失败
 */
export const RETURN_INNER_STATUS_REFUND_FAILED = 2;
/**
 * 退款成功
 */
export const RETURN_INNER_STATUS_REFUND_SUCCESS = 3;

/* --------------------------------- 退款明细外部状态 -------------------------------- */
/**
 * 未退款
 */
export const RETURN_OUTER_STATUS_NO_REFUND = 1;
/**
 * 待确认退款
 */
export const RETURN_OUTER_STATUS_UNCONFIRMED_REFUND = 2;
/**
 * 退款未到账
 */
export const RETURN_OUTER_STATUS_NOT_RECEIVED = 3;
/**
 * 退款到账
 */
export const RETURN_OUTER_STATUS_RECEIVED = 4;
/**
 * 无须退款
 */
export const RETURN_OUTER_STATUS_NEED_NOT = 5;

/* --------------------------------- 退款外部状态 -------------------------------- */
// 退款外部状态 Badge map
export const REFUND_OUTER_STATUS_TAG_MAP: { [key: number]: string } = {
  [RETURN_OUTER_STATUS_NO_REFUND]: 'red',
  [RETURN_OUTER_STATUS_UNCONFIRMED_REFUND]: 'blue',
  [RETURN_OUTER_STATUS_NOT_RECEIVED]: 'orange',
  [RETURN_OUTER_STATUS_RECEIVED]: 'green',
  [RETURN_OUTER_STATUS_NEED_NOT]: 'green',
};
