import StatusTag from '@/components/StatusTag'
import moment from 'moment'
import React from 'react'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const OuterStatusType = ['success', 'warning', 'default', 'danger', 'primary', 'nobility']

export const commonColumns = [
  {
    title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.evaluateNumberTopic' })}`,
    dataIndex: 'id',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Link to={`/supplierAbility/profile/rectificationQuery/detail?id=${record.id}`}>{record.rectifyNo}</Link>
          <p>{record.subject}</p>
        </div>
      )
    },
  },
  {
    title: `${intl.formatMessage({ id: 'supplier.supplierEvaluate.hooks.useGetDetailCommon.uppersupplierName' })}`,
    dataIndex: 'upperMemberName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyBeginTime' })}`,
    dataIndex: 'rectifyDayStart',
    sorter: (_a, _b) => moment(_a.rectifyTimeStart).valueOf() - moment(_b.rectifyTimeStart).valueOf(),
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyEndTime' })}`,
    dataIndex: 'rectifyDayEnd',
    sorter: (_a, _b) => moment(_a.rectifyTimeEnd).valueOf() - moment(_b.rectifyTimeEnd).valueOf(),
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyResult' })}`,
    dataIndex: 'agreeResultName',
    render: (text, record) => {
      if (record.agreeResult === null) {
        return ''
      }
      return record.agreeResultName
    },
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.outState' })}`,
    dataIndex: 'outerStatus',
    render: (text, record) => {
      const offset = record.outerStatus % OuterStatusType.length
      return <StatusTag type={OuterStatusType[offset] as 'success'} title={record.outerStatusName} />
    },
  },
]
