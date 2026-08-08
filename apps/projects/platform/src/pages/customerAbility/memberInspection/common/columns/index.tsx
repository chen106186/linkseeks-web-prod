import React from 'react'
import { ColumnsType } from 'antd/es/table'
import { GetMemberInspectPageResponseDetail } from '@apps/apis'
import moment from 'moment'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import StatusTag from '@/components/StatusTag'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
const columns: ColumnsType<GetMemberInspectPageResponseDetail> = [
  {
    title: translate('web.resource.member.memberName'),
    dataIndex: 'name',
    render: (text, record) => {
      return <Link to={`/customerAbility/memberInspection/detail?id=${record.id}`}>{record.name}</Link>
    },
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateTopic' })}`,
    dataIndex: 'subject',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateType' })}`,
    dataIndex: 'inspectTypeName',
    // filters: [],
    // onFilter: (_value, record) => record.inspectType === _value,
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateDate' })}`,
    dataIndex: 'inspectTime',
    sorter: (_a, _b) => moment(_a.inspectTime, 'YYYY-MM-DD').valueOf() - moment(_b.inspectTime, 'YYYY-MM-DD').valueOf(),
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateScore' })}`,
    dataIndex: 'score',
    sorter: (_a, _b) => +_a.score - +_b.score,
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.investigateResult' })}`,
    dataIndex: 'status',
    render: (text, record) => {
      const isFail = +record.score < 60
      return <StatusTag type={isFail ? 'danger' : 'primary'} title={record.result} />
    },
  },
  // {
  //   title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate'})}`,
  //   dataIndex: 'actions',
  //   render: (_text, _record) => {
  //     return (
  //       <Space>
  //         <a>{ intl.formatMessage({ id: 'member.memberInspection.common.columns.index.edit'}) }</a>
  //         <a>{ intl.formatMessage({ id: 'member.memberInspection.common.columns.index.delete'}) }</a>
  //       </Space>
  //     )
  //   }
  // }
]

export default columns
