import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const MEMBER_VISIT_BASIC_INFO = 'MEMBER_VISIT_BASIC_INFO'

export const MEMBER_VISIT_FILES = 'MEMBER_VISIT_FILES'

export const anchorsArr = [
  {
    key: MEMBER_VISIT_BASIC_INFO,
    label: translate('web.common.jibenxinxi'),
  },
  {
    key: MEMBER_VISIT_FILES,
    label: translate('web.resource.member.fujian'),
  },
]
