import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const MEMBER_LEVEL_INFO = 'MEMBER_LEVEL_INFO'

export const MEMBER_RIGHT_SETTING = 'MEMBER_RIGHT_SETTING'

export const anchorsArr = [
  {
    key: MEMBER_LEVEL_INFO,
    label: intl.formatMessage({ id: 'member.memberLevel.levelInfo', defaultMessage: '会员等级信息' }),
  },
  {
    key: MEMBER_RIGHT_SETTING,
    label: intl.formatMessage({ id: 'member.memberLevel.rightsSetting', defaultMessage: '会员权益设置' }),
  },
]
