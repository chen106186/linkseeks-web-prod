/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-12 17:01:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-03-15 11:47:30
 * @Description: 售后维修模块相关常量
 */
import themeColors from '../colors';

/* --------------------------------- 售后维修内部状态 -------------------------------- */
/**
 * 待提交
 */
export const REPAIR_INNER_STATUS_UNCOMMITTED = 1;
/**
 * 提交审核
 */
export const REPAIR_INNER_STATUS_COMMITTED = 2;
/**
 * 一级审核通过
 */
export const REPAIR_INNER_STATUS_SUCCESS_1 = 3;
/**
 * 二级审核通过
 */
export const REPAIR_INNER_STATUS_SUCCESS_2 = 4;
/**
 * 不接受申请
 */
export const REPAIR_INNER_STATUS_UNACCEPTABLE = 5;
/**
 * 确认接受申请
 */
export const REPAIR_INNER_STATUS_CONFIRMED_ACCEPTABLE = 6;
/**
 * 确认不接受申请
 */
export const REPAIR_INNER_STATUS_CONFIRMED_UNACCEPTABLE = 7;
/**
 * 确认售后完成
 */
export const REPAIR_INNER_STATUS_FINISHED = 8;
/**
 * 售后维修内部状态 Badge map
 */
export const REPAIR_INNER_STATUS_BADGE_MAP: { [key: number]: string } = {
  [REPAIR_INNER_STATUS_UNCOMMITTED]: 'gray',
  [REPAIR_INNER_STATUS_COMMITTED]: 'green',
  [REPAIR_INNER_STATUS_SUCCESS_1]: 'blue',
  [REPAIR_INNER_STATUS_SUCCESS_2]: 'blue',
  [REPAIR_INNER_STATUS_UNACCEPTABLE]: 'red',
  [REPAIR_INNER_STATUS_CONFIRMED_ACCEPTABLE]: 'blue',
  [REPAIR_INNER_STATUS_CONFIRMED_UNACCEPTABLE]: 'red',
  [REPAIR_INNER_STATUS_FINISHED]: 'green',
};
/**
 * 售后维修内部状态 color map
 */
export const REPAIR_INNER_STATUS_COLOR_MAP: { [key: number]: [string, string] } = {
  [REPAIR_INNER_STATUS_UNCOMMITTED]: [
    '#606266',
    '#EBECF0',
  ],
  [REPAIR_INNER_STATUS_COMMITTED]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
  [REPAIR_INNER_STATUS_SUCCESS_1]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REPAIR_INNER_STATUS_SUCCESS_2]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REPAIR_INNER_STATUS_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REPAIR_INNER_STATUS_CONFIRMED_ACCEPTABLE]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REPAIR_INNER_STATUS_CONFIRMED_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REPAIR_INNER_STATUS_FINISHED]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
};

/* --------------------------------- 售后维修外部状态 -------------------------------- */
/**
 * 待提交申请单
 */
export const REPAIR_OUTER_STATUS_UNCOMMITTED = 1;
/**
 * 待确认申请单
 */
export const REPAIR_OUTER_STATUS_UNCONFIRMED = 2;
/**
 * 不接受申请
 */
export const REPAIR_OUTER_STATUS_UNACCEPTABLE = 3;
/**
 * 接受申请
 */
export const REPAIR_OUTER_STATUS_ACCEPTABLE = 4;
/**
 * 售后完成
 */
export const REPAIR_OUTER_STATUS_FINISHED = 5;
/**
 * 售后维修外部状态 color map
 */
export const REPAIR_OUTER_STATUS_COLOR_MAP: { [key: number]: [string, string] } = {
  [REPAIR_OUTER_STATUS_UNCOMMITTED]: [
    '#606266',
    '#EBECF0',
  ],
  [REPAIR_OUTER_STATUS_UNCONFIRMED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REPAIR_OUTER_STATUS_UNACCEPTABLE]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [REPAIR_OUTER_STATUS_ACCEPTABLE]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [REPAIR_OUTER_STATUS_FINISHED]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
};
