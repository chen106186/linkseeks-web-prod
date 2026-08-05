/**
 * 会员类型枚举
 */
export enum MEMBER_TYPE_ENUM {
  /**
   * 企业会员 - 1
   */
  MERCHANT = 1,

  /**
   * 企业个人会员 - 2
   */
  MERCHANT_PERSONAL,

  /**
   * 渠道会员 - 3
   */
  CHANNEL,

  /**
   * 渠道个人会员 - 4
   */
  CHANNEL_PERSONAL,
}

export const MEMBER_TYPE_LIST = ['', '企业会员', '企业个人会员', '渠道会员', '渠道个人会员']

export const MEMBER_TYPE_MAP = {
  [MEMBER_TYPE_ENUM.MERCHANT]: '企业会员',
  [MEMBER_TYPE_ENUM.MERCHANT_PERSONAL]: '企业个人会员',
  [MEMBER_TYPE_ENUM.CHANNEL]: '渠道会员',
  [MEMBER_TYPE_ENUM.CHANNEL_PERSONAL]: '渠道个人会员',
}

export const MEMBER_TYPE_OPTION = [
  { value: MEMBER_TYPE_ENUM.MERCHANT, label: '企业会员' },
  { value: MEMBER_TYPE_ENUM.MERCHANT_PERSONAL, label: '企业个人会员' },
  { value: MEMBER_TYPE_ENUM.CHANNEL, label: '渠道会员' },
  { value: MEMBER_TYPE_ENUM.CHANNEL_PERSONAL, label: '渠道个人会员' },
]

/**
 * 角色类型枚举
 */
export enum ROLE_TYPE_ENUM {
  /**
   * 服务提供者 - 1
   */
  SERVICE_PROVIDER = 1,

  /**
   * 服务消费者 - 2
   */
  SERVICE_CONSUMER,

  /**
   * 平台 - 3
   */
  PLATFORM,
}

/**
 * 角色标签枚举
 */
export enum ROLE_TAGS_ENUM {
  /**
   * 会员 - 1
   */
  MEMBER = 1,

  /**
   * 客户 - 2
   */
  CUSTOMER,

  /**
   * 供应商 - 3
   */
  SUPPLIER,

  /**
   * 上游供应商 - 4
   */
  UPSTREAM_SUPPLIER,

  /**
   * 物流商 - 5
   */
  LOGISTICS_PROVIDERS,
}
