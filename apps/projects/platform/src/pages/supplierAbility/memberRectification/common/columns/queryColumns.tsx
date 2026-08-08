import React from 'react'
import { ColumnsType } from 'antd/es/table'
import { Link } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import StatusTag from '@/components/StatusTag'
import { GetMemberRectifySummaryPageResponseDetail } from '@apps/apis'
import moment from 'moment'

const intl = getIntl()

/**
 * 列表页column
 */
const OuterStatusType = ['success', 'warning', 'default', 'danger', 'primary', 'nobility']
const format = 'YYYY-MM-DD'

const listColumns: ColumnsType<GetMemberRectifySummaryPageResponseDetail> = [
  {
    title: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.columns.index.supplierName' })}`,
    dataIndex: 'name',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyBeginTime' })}`,
    dataIndex: 'rectifyDayStart',
    sorter: (a, b) => moment(a.rectifyDayStart, format).valueOf() - moment(b.rectifyDayStart, format).valueOf(),
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyEndTime' })}`,
    dataIndex: 'rectifyDayEnd',
    sorter: (a, b) => moment(a.rectifyDayEnd, format).valueOf() - moment(b.rectifyDayEnd, format).valueOf(),
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyResult' })}`,
    dataIndex: 'agreeResultName',
    render: (text, record) => {
      return record.agreeResult ? record.agreeResultName : ''
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

export const setColumnsByLinks = (link?: { [key: string]: string }, blackList?: string[]) => {
  const linksColumns: ColumnsType<any> = [
    {
      title: `${intl.formatMessage({
        id: 'member.memberRectification.common.columns.queryColumns.rectifyNoAndTopic',
      })}`,
      dataIndex: 'des',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(link?.['detail'] && <Link to={`${link?.['detail']}?id=${record.id}`}>{record.rectifyNo}</Link>) || (
              <span>{record.id}</span>
            )}
            <p>{record.subject}</p>
          </div>
        )
      },
    },
  ]
  const filteredColumns =
    blackList && blackList.length > 0
      ? listColumns.filter((_item) => !blackList.includes((_item as any).dataIndex))
      : listColumns
  return linksColumns.concat(filteredColumns)
}
// export default listColumns;
