/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-21 18:17:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-04-22 19:44:33
 * @Description: 会员模块相关常量
 */
import themeColors from '../colors';

/* --------------------------------- 外部状态 -------------------------------- */
/**
 * 待提交审核
 */
export const OUTER_STATUS_TO_BE_SUBMIT = 0;
/**
 * 待审核
 */
export const OUTER_STATUS_UNREVIEWED = 1;
/**
 * 审核不通过
 */
export const OUTER_STATUS_AUDIT_FAILED = 2;
/**
 * 审核通过
 */
export const OUTER_STATUS_AUDIT_SUCCESS = 3;
/**
 * 外部状态 Badge map
 */
export const OUTER_STATUS_BADGE_MAP: { [key: number]: string } = {
  [OUTER_STATUS_TO_BE_SUBMIT]: 'yellow',
  [OUTER_STATUS_UNREVIEWED]: 'blue',
  [OUTER_STATUS_AUDIT_FAILED]: 'red',
  [OUTER_STATUS_AUDIT_SUCCESS]: 'green',
};
/**
 * 外部状态 color map
 */
export const OUTER_STATUS_COLOR_MAP: { [key: number]: [string, string] } = {
  [OUTER_STATUS_TO_BE_SUBMIT]: [
    themeColors.yellow[5],
    themeColors.yellow[0],
  ],
  [OUTER_STATUS_UNREVIEWED]: [
    themeColors.blue[5],
    themeColors.blue[0],
  ],
  [OUTER_STATUS_AUDIT_FAILED]: [
    themeColors.red[5],
    themeColors.red[0],
  ],
  [OUTER_STATUS_AUDIT_SUCCESS]: [
    themeColors.green[5],
    themeColors.green[0],
  ],
};

/* --------------------------------- 会员状态 -------------------------------- */
/**
 * 正常
 */
export const MEMBER_STATUS_NORMAL = 1;
/**
 * 冻结
 */
export const MEMBER_STATUS_FROZEN = 2;
/**
 * 会员状态字体颜色 map
 */
export const MEMBER_STATUS_TEXT_COLOR_MAP: { [key: number]: string } = {
  [MEMBER_STATUS_NORMAL]: '#606266',
  [MEMBER_STATUS_FROZEN]: themeColors.red[5],
};

/* --------------------------------- 会员等级类型 -------------------------------- */
/**
 * 平台会员
 */
export const LEVEL_TYPE_PLATFORM = 1;
/**
 * 商户会员
 */
export const LEVEL_TYPE_MERCHANT = 2;
/**
 * 渠道会员
 */
export const LEVEL_TYPE_CHANNEL = 3;
