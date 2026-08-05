import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const MEMBER_LEVEL_INFO = 'MEMBER_LEVEL_INFO'

export const MEMBER_RIGHT_SETTING = 'MEMBER_RIGHT_SETTING'

export const anchorsArr = [
  {
    key: MEMBER_LEVEL_INFO,
    label: translate('web.resource.member.huiyuandengjixinxi'),
  },
  {
    key: MEMBER_RIGHT_SETTING,
    label: translate('web.resource.member.huiyuanquanyishezhi'),
  },
]
