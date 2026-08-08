/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-18 17:36:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 18:01:11
 * @Description: 会员相关常量
 */
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/* --------------------------------- 会员类型 -------------------------------- */
/**
 * 企业会员
 */
export const MEMBER_TYPE_CORPORATE = 1
/**
 * 个人会员
 */
export const MEMBER_TYPE_INDIVIDUAL = 2
/**
 * 渠道企业会员
 */
export const MEMBER_TYPE_CHANNEL_CORPORATE = 3
/**
 * 渠道个人会员
 */
export const MEMBER_TYPE_CHANNEL_INDIVIDUAL = 4
/**
 * 会员类型对应中文
 */
export const MEMBER_TYPE = {
  [MEMBER_TYPE_CORPORATE]: intl.formatMessage({ id: 'member.constants.MEMBER_TYPE_CORPORATE' }),
  [MEMBER_TYPE_INDIVIDUAL]: intl.formatMessage({ id: 'member.constants.MEMBER_TYPE_INDIVIDUAL' }),
  [MEMBER_TYPE_CHANNEL_CORPORATE]: intl.formatMessage({ id: 'member.constants.MEMBER_TYPE_CHANNEL_CORPORATE' }),
  [MEMBER_TYPE_CHANNEL_INDIVIDUAL]: intl.formatMessage({ id: 'member.constants.MEMBER_TYPE_CHANNEL_INDIVIDUAL' }),
}

/* --------------------------------- 会员状态 -------------------------------- */
/**
 * 正常的
 */
export const MEMBER_STATUS_NORMAL = 1
/**
 * 冻结的
 */
export const MEMBER_STATUS_FROZEN = 2
export const MEMBER_STATUS = {
  [MEMBER_STATUS_NORMAL]: intl.formatMessage({ id: 'member.constants.MEMBER_STATUS_NORMAL' }),
  [MEMBER_STATUS_FROZEN]: intl.formatMessage({ id: 'member.constants.MEMBER_STATUS_FROZEN' }),
}

/* --------------------------------- 会员外部状态 -------------------------------- */
/**
 * 待提交审核
 */
export const MEMBER_OUTER_STATUS_TO_PLATFORM_VERIFY = 1
/**
 * 待平台审核
 */
export const MEMBER_OUTER_STATUS_PLATFORM_VERIFYING = 2
/**
 * 平台审核通过
 */
export const MEMBER_OUTER_STATUS_PLATFORM_VERIFY_PASSED = 3
/**
 * 平台审核不通过
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

/* --------------------------------- 会员内部状态（非平台会员，即上级不是平台会员） -------------------------------- */
/**
 * 待审核入库资料
 */
export const MEMBER_INNER_STATUS_TO_VERIFY_DEPOSITORY_DETAIL = 1
/**
 * 入库资料审核不通过
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_DETAIL_NOT_PASSED = 2
/**
 * 待审核入库资质
 */
export const MEMBER_INNER_STATUS_TO_VERIFY_DEPOSITORY_QUALIFICATION = 3
/**
 * 入库资质审核不通过
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_QUALIFICATION_NOT_PASSED = 4
/**
 * 待入库考察
 */
export const MEMBER_INNER_STATUS_TO_INSPECT_DEPOSITORY = 5
/**
 * 入库考察不通过
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_INSPECTION_NOT_PASSED = 6
/**
 * 待入库分类
 */
export const MEMBER_INNER_STATUS_TO_CLASSFIY_DEPOSITORY = 7
/**
 * 入库分类不通过
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_CLASSIFICATION_NOT_PASSED = 8
/**
 * 待审核入库(一级)
 */
export const MEMBER_INNER_STATUS_TO_DEPOSIT_GRADE_ONE = 9
/**
 * 入库审核不通过(一级)
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_GRADE_ONE_NOT_PASSED = 10
/**
 * 待审核入库(二级)
 */
export const MEMBER_INNER_STATUS_TO_DEPOSIT_GRADE_TWO = 11
/**
 * 待审核入库不通过(二级)
 */
export const MEMBER_INNER_STATUS_DEPOSITORY_GRADE_TWO_NOT_PASSED = 12
/**
 * 待确认入库
 */
export const MEMBER_INNER_STATUS_TO_COMFIRM_DEPOSITORY = 13
/**
 * 审核通过
 */
export const MEMBER_INNER_STATUS_VERIFY_PASSED = 14
/**
 * 审核不通过
 */
export const MEMBER_INNER_STATUS_VERIFY_NOT_PASSED = 15
/**
 * 待审核会员变更(一级)
 */
export const MEMBER_INNER_STATUS_VERIFY_TO_MODIFY_GRADE_ONE = 16
/**
 * 会员变更审核不通过(一级)
 */
export const MEMBER_INNER_STATUS_MODIFY_GRADE_ONE_NOT_PASSED = 17
/**
 * 待审核会员变更(二级)
 */
export const MEMBER_INNER_STATUS_TO_MODIFY_GRADE_TWO = 18
/**
 * 会员变更审核不通过(二级)
 */
export const MEMBER_INNER_STATUS_MODIFY_GRADE_TWO_NOT_PASSED = 19
/**
 * 待确认会员变更
 */
export const MEMBER_INNER_STATUS_TO_COMFIRM_MODIFY = 20
/**
 * 会员变更审核通过
 */
export const MEMBER_INNER_STATUS_MODIFY_PASSED = 21
/**
 * 会员变更审核不通过
 */
export const MEMBER_INNER_STATUS_MODIFY_NOT_PASSED = 22

/* --------------------------------- 会员内部状态（平台会员） -------------------------------- */
/**
 * 待提交平台审核
 */
export const PLATFORM_MEMBER_INNER_STATUS_TO_BE_COMMIT = 1
/**
 * 提交审核不通过
 */
export const PLATFORM_MEMBER_INNER_STATUS_COMMIT_NOT_PASSED = 2
/**
 * 待平台审核(一级)
 */
export const PLATFORM_MEMBER_INNER_STATUS_TO_BE_VERIFY_STEP1 = 3
/**
 * 审核会员不通过(一级)
 */
export const PLATFORM_MEMBER_INNER_STATUS_VERIFY_STEP1_NOT_PASSED = 4
/**
 * 待平台审核(二级)
 */
export const PLATFORM_MEMBER_INNER_STATUS_TO_BE_VERIFY_STEP2 = 5
/**
 * 审核会员不通过(二级)
 */
export const PLATFORM_MEMBER_INNER_STATUS_VERIFY_STEP2_NOT_PASSED = 6
/**
 * 待确认会员
 */
export const PLATFORM_MEMBER_INNER_STATUS_TO_CONFIRM = 7
/**
 * 平台审核不通过
 */
export const PLATFORM_MEMBER_INNER_STATUS_VERIFY_NOT_PASSED = 8
/**
 * 平台审核通过
 */
export const PLATFORM_MEMBER_INNER_STATUS_VERIFY_PASSED = 9

/* --------------------------------- 会员等级类型枚举 -------------------------------- */
/**
 * 平台会员
 */
export const MEMBER_LEVEL_TYPE_PLATFORM = 1
/**
 * 商户会员
 */
export const MEMBER_LEVEL_TYPE_MERCHANT = 2
/**
 * 渠道会员
 */
export const MEMBER_LEVEL_TYPE_CHANNEL = 3
/**
 * 会员等级类型枚举对应中文
 */
export const MEMBER_LEVEL_TYPE = {
  [MEMBER_LEVEL_TYPE_PLATFORM]: intl.formatMessage({ id: 'member.constants.MEMBER_LEVEL_TYPE_PLATFORM' }),
  [MEMBER_LEVEL_TYPE_MERCHANT]: intl.formatMessage({ id: 'member.constants.MEMBER_LEVEL_TYPE_MERCHANT' }),
  [MEMBER_LEVEL_TYPE_CHANNEL]: intl.formatMessage({ id: 'member.constants.MEMBER_LEVEL_TYPE_CHANNEL' }),
}

/* --------------------------------- 会员规则类型 -------------------------------- */
/**
 * 交易
 */
export const VIP_RULE_TRANSACTION = 1
/**
 * 登录
 */
export const VIP_RULE_LOGIN = 2
/**
 * 评论
 */
export const VIP_RULE_COMMENT = 3

/* --------------------------------- 会员角色类型 -------------------------------- */
/**
 * 服务提供者
 */
export const MEMBER_ROLE_TYPE_SERVICE_PROVIDER = 1
/**
 * 服务消费者
 */
export const MEMBER_ROLE_TYPE_SERVICE_CONSUMER = 2

/* --------------------------------- 会员邀请码状态 -------------------------------- */
/**
 * 未发送
 */
export const MEMBER_INVITE_CODE_NO_SEND = 1
/**
 * 未注册
 */
export const MEMBER_INVITE_CODE_NO_REGISTER = 2
/**
 * 已注册
 */
export const MEMBER_INVITE_CODE_REGISTER = 3
/**
 * 已失效
 */
export const MEMBER_INVITE_CODE_INVALID = 4

/* --------------------------------- 发票类型 -------------------------------- */
/**
 * 增值税专用发票
 */
export const MEMBER_INVOICE_TYPE_1 = 1
/**
 * 普通发票
 */
export const MEMBER_INVOICE_TYPE_2 = 2
/**
 * 机动车专用发票
 */
export const MEMBER_INVOICE_TYPE_3 = 3
/**
 * 机打发票
 */
export const MEMBER_INVOICE_TYPE_4 = 4
/**
 * 定额发票
 */
export const MEMBER_INVOICE_TYPE_5 = 5
/**
 * 会员等级类型枚举对应中文
 */
export const MEMBER_INVOICE_TYPE = {
  [MEMBER_INVOICE_TYPE_1]: intl.formatMessage({ id: 'member.constants.MEMBER_INVOICE_TYPE_1' }),
  [MEMBER_INVOICE_TYPE_2]: intl.formatMessage({ id: 'member.constants.MEMBER_INVOICE_TYPE_2' }),
  [MEMBER_INVOICE_TYPE_3]: intl.formatMessage({ id: 'member.constants.MEMBER_INVOICE_TYPE_3' }),
  [MEMBER_INVOICE_TYPE_4]: intl.formatMessage({ id: 'member.constants.MEMBER_INVOICE_TYPE_4' }),
  [MEMBER_INVOICE_TYPE_5]: intl.formatMessage({ id: 'member.constants.MEMBER_INVOICE_TYPE_5' }),
}

/* --------------------------------- 税点 -------------------------------- */
/**
 * 17%
 */
export const MEMBER_TAX_POINT_1 = 17
/**
 * 11%
 */
export const MEMBER_TAX_POINT_2 = 11
/**
 * 6%
 */
export const MEMBER_TAX_POINT_3 = 6
/**
 * 3%
 */
export const MEMBER_TAX_POINT_4 = 3
/**
 * 0%
 */
export const MEMBER_TAX_POINT_5 = 0
/**
 * 会员等级类型枚举对应中文
 */
export const MEMBER_TAX_POINT = {
  [MEMBER_TAX_POINT_1]: intl.formatMessage({ id: 'member.constants.MEMBER_TAX_POINT_1' }),
  [MEMBER_TAX_POINT_2]: intl.formatMessage({ id: 'member.constants.MEMBER_TAX_POINT_2' }),
  [MEMBER_TAX_POINT_3]: intl.formatMessage({ id: 'member.constants.MEMBER_TAX_POINT_3' }),
  [MEMBER_TAX_POINT_4]: intl.formatMessage({ id: 'member.constants.MEMBER_TAX_POINT_4' }),
  [MEMBER_TAX_POINT_5]: intl.formatMessage({ id: 'member.constants.MEMBER_TAX_POINT_5' }),
}

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

export enum MEMBER_LABEL {
  /** 会员 */
  'member' = 'member',
  /** 客户 */
  'customer' = 'customer',
  /** 供应商 */
  'supplier' = 'supplier',
}
