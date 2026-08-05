import { getWebIntl } from '@apps/locales'

export const PLATFORM_MEMBER_LEVEL = 'PLATFORM_MEMBER_LEVEL'

export const MEMBER_APPLICABLE_ROLE = 'MEMBER_APPLICABLE_ROLE'

const translate = getWebIntl()

export const anchorsArr = [
  {
    key: PLATFORM_MEMBER_LEVEL,
    label: translate('web.common.jibenxinxi'),
  },
  {
    key: MEMBER_APPLICABLE_ROLE,
    label: translate('web.resource.member.shiyonghuiyuanjuese'),
  },
]
