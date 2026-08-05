import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Badge } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { EyeAuthButton } from '@apps/components'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { MODIFIES_INNER_STATUS_BADGE_COLOR } from '../const'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
const modifiesColumn: <R extends { id: number; statusName: string }>(pathPrefix: string) => ColumnType<R>[] = (
  pathPrefix,
) => [
  {
    title: translate('web.resource.member.shenqingdanhao'),
    dataIndex: 'changeRequestFormNo',
    render: (text, record) => (
      <EyeAuthButton
        type={authUrl(pathPrefix, 'detail') ? 'link' : 'button'}
        url={`${pathPrefix}/detail?id=${record.id}`}
      >
        {text}
      </EyeAuthButton>
    ),
  },
  {
    title: translate('web.resource.member.shenqingdanzhaiyao'),
    dataIndex: 'changeRequestSummary',
  },
  {
    title: intl.formatMessage({ id: 'supplier.profile.name', defaultMessage: '供应商名称' }),
    dataIndex: 'memberName',
  },
  {
    title: translate('web.resource.member.dangqianjieduan'),
    dataIndex: 'currentLifecycleStage',
    render: (text) => <StatusTag type="default" title={text} />,
  },
  {
    title: translate('web.resource.member.mubiaojieduan'),
    dataIndex: 'targetLifecycleStage',
    render: (text) => <StatusTag type="default" title={text} />,
  },
  {
    title: translate('web.resource.member.danjushijian'),
    dataIndex: 'createTime',
  },
  {
    title: translate('web.common.neibuzhuangtai'),
    dataIndex: 'status',
    render: (text, record) => (
      <Badge color={MODIFIES_INNER_STATUS_BADGE_COLOR[text] || '#606266'} text={record.statusName} />
    ),
  },
]

export default modifiesColumn
