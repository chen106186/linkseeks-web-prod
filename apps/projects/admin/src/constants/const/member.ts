/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-21 14:06:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-03 18:42:40
 * @Description: 会员能力相关常量
 */
// ********************* 会员规则类型 ********************
export const VIP_RULE_TRANSACTION = 1 // 交易
export const VIP_RULE_LOGIN = 2 // 登录
export const VIP_RULE_COMMENT = 3 // 评论

// ********************* 会员状态 ********************
export const MEMBER_STATUS_NORMAL = 1 // 正常的
export const MEMBER_STATUS_FROZEN = 2 // 冻结的
export const MEMBER_STATUS_READY_LOGOFF = 6 // 待注销
export const MEMBER_STATUS = {
  [MEMBER_STATUS_NORMAL]: '正常',
  [MEMBER_STATUS_FROZEN]: '冻结',
}

// ********************* 会员类型 ********************
export const MEMBER_TYPE_CORPORATE = 1 // 企业会员
export const MEMBER_TYPE_INDIVIDUAL = 2 // 个人会员
export const MEMBER_TYPE_CHANNEL_CORPORATE = 3 // 渠道企业会员
export const MEMBER_TYPE_CHANNEL_INDIVIDUAL = 4 // 渠道个人会员
export const MEMBER_TYPE = {
  [MEMBER_TYPE_CORPORATE]: '企业会员',
  [MEMBER_TYPE_INDIVIDUAL]: '个人会员',
  [MEMBER_TYPE_CHANNEL_CORPORATE]: '渠道企业会员',
  [MEMBER_TYPE_CHANNEL_INDIVIDUAL]: '渠道个人会员',
}

// ********************* 会员申请来源 ********************
export const MEMBER_SOURCE_WEB_ENTERPRISE = 1 // Web企业商城
export const MEMBER_SOURCE_H5_ENTERPRISE = 2 // H5企业商城
export const MEMBER_SOURCE_APP_ENTERPRISE = 3 // APP企业商城
export const MEMBER_SOURCE_MINI_ENTERPRISE = 4 // 小程序企业商城
export const MEMBER_SOURCE_WEB_SCORE = 5 // WEB积分商城申请
export const MEMBER_SOURCE_H5_SCORE = 6 // H5积分商城申请
export const MEMBER_SOURCE_APP_SCORE = 7 // APP积分商城申请
export const MEMBER_SOURCE_MINI_SCORE = 8 //小程序积分商城申请
export const MEMBER_SOURCE_PLATFORM = 9 // 平台代录入
export const MEMBER_SOURCE_MERCHANTS = 10 // 商户代录入

export const MEMBER_SOURCE = {
  [MEMBER_SOURCE_WEB_ENTERPRISE]: 'Web企业商城',
  [MEMBER_SOURCE_H5_ENTERPRISE]: 'H5企业商城',
  [MEMBER_SOURCE_APP_ENTERPRISE]: 'APP企业商城',
  [MEMBER_SOURCE_MINI_ENTERPRISE]: '小程序企业商城',
  [MEMBER_SOURCE_WEB_SCORE]: 'WEB积分商城申请',
  [MEMBER_SOURCE_H5_SCORE]: 'H5积分商城申请',
  [MEMBER_SOURCE_APP_SCORE]: 'APP积分商城申请',
  [MEMBER_SOURCE_MINI_SCORE]: '小程序积分商城申请',
  [MEMBER_SOURCE_PLATFORM]: '平台代录入',
  [MEMBER_SOURCE_MERCHANTS]: '商户代录入',
}

// ********************* 会员内部状态（平台） ********************
/**
 * 待提交平台审核
 */
export const MEMBER_INNER_STATUS_TO_BE_COMMIT = 1
/**
 * 提交审核不通过
 */
export const MEMBER_INNER_STATUS_COMMIT_NOT_PASSED = 2
/**
 * 待平台审核(一级)
 */
export const MEMBER_INNER_STATUS_TO_BE_VERIFY_STEP1 = 3
/**
 * 审核会员不通过(一级)
 */
export const MEMBER_INNER_STATUS_VERIFY_STEP1_NOT_PASSED = 4
/**
 * 待平台审核(二级)
 */
export const MEMBER_INNER_STATUS_TO_BE_VERIFY_STEP2 = 5
/**
 * 审核会员不通过(二级)
 */
export const MEMBER_INNER_STATUS_VERIFY_STEP2_NOT_PASSED = 6
/**
 * 待确认会员
 */
export const MEMBER_INNER_STATUS_TO_CONFIRM = 7
/**
 * 平台审核不通过
 */
export const MEMBER_INNER_STATUS_VERIFY_NOT_PASSED = 8
/**
 * 审核通过
 */
export const MEMBER_INNER_STATUS_VERIFY_PASSED = 9

// ********************* 会员外部状态 ********************
/**
 * 待提交审核
 */
export const MEMBER_OUTER_STATUS_TO_PLATFORM_VERIFY = 1
/**
 * 待平台审核
 */
export const MEMBER_OUTER_STATUS_PLATFORM_VERIFYING = 2
/**
 * 审核通过
 */
export const MEMBER_OUTER_STATUS_PLATFORM_VERIFY_PASSED = 3
/**
 * 审核不通过
 */
export const MEMBER_OUTER_STATUS_PLATFORM_VERIFY_NOT_PASSED = 4
/**
 * 待审核会员入库
 */
export const MEMBER_OUTER_STATUS_DEPOSITING = 5
/**
 * 入库审核通过
 */
export const MEMBER_OUTER_STATUS_DEPOSITORY_PASSED = 6
/**
 * 入库审核不通过
 */
export const MEMBER_OUTER_STATUS_DEPOSITORY_NOT_PASSED = 7
/**
 * 待审核会员变更
 */
export const MEMBER_OUTER_STATUS_MODIFYING = 8
/**
 * 会员变更审核通过
 */
export const MEMBER_OUTER_STATUS_MODIFY_PASSED = 9
/**
 * 会员变更审核不通过
 */
export const MEMBER_OUTER_STATUS_MODIFY_NOT_PASSED = 10

/**
 * 会员等级层级options
 */
export const MEMBER_LEVEL_ENUM = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
  {
    label: '4',
    value: 4,
  },
  {
    label: '5',
    value: 5,
  },
  {
    label: '6',
    value: 6,
  },
  {
    label: '7',
    value: 7,
  },
  {
    label: '8',
    value: 8,
  },
  {
    label: '9',
    value: 9,
  },
  {
    label: '10',
    value: 10,
  },
]
