import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const MEMBER_VISIT_BASIC_INFO = 'MEMBER_VISIT_BASIC_INFO'

export const MEMBER_VISIT_FILES = 'MEMBER_VISIT_FILES'

export const anchorsArr = [
  {
    key: MEMBER_VISIT_BASIC_INFO,
    label: intl.formatMessage({ id: 'member.memberVisitManage.basic', defaultMessage: '基本信息' }),
  },
  {
    key: MEMBER_VISIT_FILES,
    label: intl.formatMessage({ id: 'member.memberVisitManage.files', defaultMessage: '附件' }),
  },
]
