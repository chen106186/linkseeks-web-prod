import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const PLATFORM_MEMBER_LEVEL = 'PLATFORM_MEMBER_LEVEL'

export const MEMBER_APPLICABLE_ROLE = 'MEMBER_APPLICABLE_ROLE'

export const anchorsArr = [
  {
    key: PLATFORM_MEMBER_LEVEL,
    label: intl.formatMessage({ id: 'member.memberLevel.basic', defaultMessage: '基本信息' }),
  },
  {
    key: MEMBER_APPLICABLE_ROLE,
    label: intl.formatMessage({ id: 'member.memberLevel.applicableMemberRoles', defaultMessage: '适用会员角色' }),
  },
]
