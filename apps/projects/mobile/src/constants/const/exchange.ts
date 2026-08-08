/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-24 17:42:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-04-19 10:33:43
 * @Description: 售后换货模块相关常量
 */
import themeColors from '../colors';

/* --------------------------------- 售后换货内部状态 -------------------------------- */
/**
 * 待提交
 */
export const EXCHANGE_INNER_STATUS_UNCOMMITTED = 1;
/**
 * 提交审核
 */
export const EXCHANGE_INNER_STATUS_COMMITTED = 2;
/**
 * 一级审核通过
 */
export const EXCHANGE_INNER_STATUS_SUCCESS_1 = 3;
/**
 * 二级审核通过
 */
export const EXCHANGE_INNER_STATUS_SUCCESS_2 = 4;
/**
 * 审核不通过(二级)
 */
export const EXCHANGE_INNER_STATUS_UNACCEPTABLE = 5;
/**
 * 确认接受申请
 */
export const EXCHANGE_INNER_STATUS_CONFIRMED_ACCEPTABLE = 6;
/**
 * 确认不接受申请
 */
export const EXCHANGE_INNER_STATUS_CONFIRMED_UNACCEPTABLE = 7;
/**
 * 待新增退货发货单
 */
export const EXCHANGE_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY = 8;
/**
 * 待审核退货发货单
 */
export const EXCHANGE_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY = 9;
/**
 * 采购商待新增物流单
 */
export const EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS = 10;
/**
 * 采购商待确认物流单
 */
export const EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS = 11;
/**
 * 待确认退货发货
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY = 12;
/**
 * 待新增退货入库单
 */
export const EXCHANGE_INNER_STATUS_NOT_ADDED_REFUND_STORAGE = 13;
/**
 * 待审核退货入库单
 */
export const EXCHANGE_INNER_STATUS_UNREVIEWED_REFUND_STORAGE = 14;
/**
 * 待确认退货收货
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIVE = 15;
/**
 * 待确认退货回单
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT = 16;
/**
 * 待新增换货发货单
 */
export const EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_DELIVERY = 17;
/**
 * 待审核换货发货单
 */
export const EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_DELIVERY = 18;
/**
 * 供应商待新增物流单
 */
export const EXCHANGE_INNER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS = 19;
/**
 * 供应商待确认物流单
 */
export const EXCHANGE_INNER_STATUS_SUPPLIER_UNCONFIRMED_LOGISTICS = 20;
/**
 * 待确认换货发货
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_DELIVERY = 21;
/**
 * 待新增换货入库单
 */
export const EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE = 22;
/**
 * 待审核换货入库单
 */
export const EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE = 23;
/**
 * 待确认换货收货
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE = 24;
/**
 * 待确认换货回单
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIPT = 25;
/**
 * 待确认售后完成
 */
export const EXCHANGE_INNER_STATUS_UNCONFIRMED_FINISHED = 26;
/**
 * 已确认售后完成
 */
export const EXCHANGE_INNER_STATUS_FINISHED = 27;
/**
 * 不接受退货物流单
 */
export const EXCHANGE_INNER_STATUS_UNACCEPTED_REFUND_LOGISTICS = 28;
/**
 * 不接受换货物流单
 */
export const EXCHANGE_INNER_STATUS_UNACCEPTED_REFUND_EXCHANGE = 29;
/**
 * 审核不通过(提交)
 */
export const EXCHANGE_INNER_STATUS_COMMIT_FAILED = 30;
/**
 * 审核不通过(一级)
 */
export const EXCHANGE_INNER_STATUS_FAILED_1 = 31;
/**
 * 审核不通过(二级)
 */
export const EXCHANGE_INNER_STATUS_FAILED_2 = 32;
/**
 * 售后换货内部状态 Badge map
 */
export const EXCHANGE_INNER_STATUS_BADGE_MAP: { [key: number]: string } = {
  [EXCHANGE_INNER_STATUS_UNCOMMITTED]: 'gray',
  [EXCHANGE_INNER_STATUS_COMMITTED]: 'green',
  [EXCHANGE_INNER_STATUS_SUCCESS_1]: 'blue',
  [EXCHANGE_INNER_STATUS_SUCCESS_2]: 'blue',
  [EXCHANGE_INNER_STATUS_UNACCEPTABLE]: 'red',
  [EXCHANGE_INNER_STATUS_CONFIRMED_ACCEPTABLE]: 'green',
  [EXCHANGE_INNER_STATUS_CONFIRMED_UNACCEPTABLE]: 'red',
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY]: 'red',
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY]: 'orange',
  [EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: 'red',
  [EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS]: 'orange',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY]: 'blue',
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REFUND_STORAGE]: 'red',
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REFUND_STORAGE]: 'orange',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIVE]: 'blue',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT]: 'blue',
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_DELIVERY]: 'red',
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_DELIVERY]: 'orange',
  [EXCHANGE_INNER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS]: 'red',
  [EXCHANGE_INNER_STATUS_SUPPLIER_UNCONFIRMED_LOGISTICS]: 'orange',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_DELIVERY]: 'blue',
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE]: 'red',
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE]: 'orange',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE]: 'blue',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIPT]: 'blue',
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_FINISHED]: 'blue',
  [EXCHANGE_INNER_STATUS_FINISHED]: 'green',
  [EXCHANGE_INNER_STATUS_UNACCEPTED_REFUND_LOGISTICS]: 'red',
  [EXCHANGE_INNER_STATUS_UNACCEPTED_REFUND_EXCHANGE]: 'red',
  [EXCHANGE_INNER_STATUS_COMMIT_FAILED]: 'red',
  [EXCHANGE_INNER_STATUS_FAILED_1]: 'red',
  [EXCHANGE_INNER_STATUS_FAILED_2]: 'red',
};
/**
 * 售后换货内部状态 color map
 */
export const EXCHANGE_INNER_STATUS_COLOR_MAP: { [key: number]: [string, string] } = {
  [EXCHANGE_INNER_STATUS_UNCOMMITTED]: [
    '#606266',
    '#EBECF0',
  ],
  [EXCHANGE_INNER_STATUS_COMMITTED]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
  [EXCHANGE_INNER_STATUS_SUCCESS_1]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_SUCCESS_2]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_CONFIRMED_ACCEPTABLE]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
  [EXCHANGE_INNER_STATUS_CONFIRMED_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REFUND_STORAGE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REFUND_STORAGE]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIVE]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_DELIVERY]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [EXCHANGE_INNER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_SUPPLIER_UNCONFIRMED_LOGISTICS]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_DELIVERY]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE]: [
    themeColors.orange[5],
    themeColors.orange[0],
  ],
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIPT]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_UNCONFIRMED_FINISHED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_INNER_STATUS_FINISHED]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
  [EXCHANGE_INNER_STATUS_UNACCEPTED_REFUND_LOGISTICS]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_UNACCEPTED_REFUND_EXCHANGE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_COMMIT_FAILED]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_FAILED_1]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_INNER_STATUS_FAILED_2]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
};

/* --------------------------------- 售后换货外部状态 -------------------------------- */
/**
 * 待提交申请单
 */
export const EXCHANGE_OUTER_STATUS_UNCOMMITTED = 1;
/**
 * 待确认申请单
 */
export const EXCHANGE_OUTER_STATUS_UNCONFIRMED = 2;
/**
 * 不接受申请
 */
export const EXCHANGE_OUTER_STATUS_UNACCEPTABLE = 3;
/**
 * 接受申请
 */
export const EXCHANGE_OUTER_STATUS_ACCEPTABLE = 4;
/**
 * 待新增退货发货单
 */
export const EXCHANGE_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY = 5;
/**
 * 采购商待新增物流单
 */
export const EXCHANGE_OUTER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS = 6;
/**
 * 待退货发货
 */
export const EXCHANGE_OUTER_STATUS_REFUND_DELIVERY = 7;
/**
 * 待新增退货入库单
 */
export const EXCHANGE_OUTER_STATUS_NOT_ADDED_REFUND_STORAGE = 8;
/**
 * 待退货收货
 */
export const EXCHANGE_OUTER_STATUS_REFUND_RECEIVE = 9;
/**
 * 待确认退货回单
 */
export const EXCHANGE_OUTER_STATUS_UNCONFIRMED_REFUND_RECEIPT = 10;
/**
 * 待新增换货发货单
 */
export const EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_DELIVERY = 11;
/**
 * 供应商待新增物流单
 */
export const EXCHANGE_OUTER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS = 12;
/**
 * 待换货发货
 */
export const EXCHANGE_OUTER_STATUS_REPLACE_DELIVERY = 13;
/**
 * 待新增换货入库单
 */
export const EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_STORAGE = 14;
/**
 * 待换货收货
 */
export const EXCHANGE_OUTER_STATUS_REPLACE_RECEIVE = 15;
/**
 * 待确认换货回单
 */
export const EXCHANGE_OUTER_STATUS_UNCONFIRMED_REPLACE_RECEIPT = 16;
/**
 * 待确认售后完成
 */
export const EXCHANGE_OUTER_STATUS_UNCONFIRMED_FINISHED = 17;
/**
 * 售后完成
 */
export const EXCHANGE_OUTER_STATUS_FINISHED = 18;
/**
 * 售后换货外部状态 color map
 */
export const EXCHANGE_OUTER_STATUS_COLOR_MAP: { [key: number]: [string, string] } = {
  [EXCHANGE_OUTER_STATUS_UNCOMMITTED]: [
    '#606266',
    '#EBECF0',
  ],
  [EXCHANGE_OUTER_STATUS_UNCONFIRMED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_OUTER_STATUS_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_ACCEPTABLE]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_REFUND_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_NOT_ADDED_REFUND_STORAGE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_REFUND_RECEIVE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_UNCONFIRMED_REFUND_RECEIPT]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_REPLACE_DELIVERY]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_STORAGE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_REPLACE_RECEIVE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [EXCHANGE_OUTER_STATUS_UNCONFIRMED_REPLACE_RECEIPT]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_OUTER_STATUS_UNCONFIRMED_FINISHED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [EXCHANGE_OUTER_STATUS_FINISHED]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
};

/* --------------------------------- 退货工作流相关 -------------------------------- */
/**
 * 售后换货默认流程
 */
export const EXCHANGE_GOODS_OUTER_DELIVERY = 20;
/**
 * 售后换货手工发货
 */
export const EXCHANGE_GOODS_MANUAL_DELIVERY = 30;
