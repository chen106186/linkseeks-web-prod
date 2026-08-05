import { Radio } from 'antd'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const TableMemberColumn = [
  {
    title: '',
    render: (t, r) => {
      return <Radio value={r} />
    },
  },
  {
    title: translate('web.common.sortIndex'),
    dataIndex: 'id',
  },
  {
    title: translate('web.resource.member.memberSupperId'),
    dataIndex: 'memberId',
  },
  {
    title: translate('web.resource.member.memberSupperName'),
    dataIndex: 'name',
  },
  {
    title: translate('web.resource.member.memberSupperType'),
    dataIndex: 'memberTypeName',
  },
  {
    title: translate('web.resource.member.huiyuanjuese'),
    dataIndex: 'roleName',
  },
  {
    title: translate('web.resource.member.level'),
    dataIndex: 'levelTag',
  },
]
