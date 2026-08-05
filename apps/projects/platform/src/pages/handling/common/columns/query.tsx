import React from 'react'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { Badge } from 'antd'
// import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { Link } from '@linkseeks/router-core'
import StatusTag from '@/components/StatusTag'
import { innerStatusColor, outerStatusType } from '../colors'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
const commonColumns: ColumnsType<any> = [
  {
    title: intl.formatMessage({ id: 'handling.processName' }),
    dataIndex: 'processName',
  },
  {
    title: intl.formatMessage({ id: 'handling.docTime' }),
    dataIndex: 'createTime',
    sorter: (a, b) => a.createTime - b.createTime,
    render: (text, record) => moment(text).format('YYYY-MM-DD'),
  },
  {
    title: intl.formatMessage({ id: 'handling.outerStatus' }),
    dataIndex: 'outerStatus',
    render: (text, record: any) => {
      const offset = record.outerStatus % 6
      return <StatusTag title={record.outerStatusName} type={outerStatusType[offset] as 'success'}></StatusTag>
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.innerStatus' }),
    dataIndex: 'innerStatus',
    render: (text, record: any) => {
      const offset = record.supplierInnerStatus % 12
      return <Badge color={innerStatusColor[offset]} text={record.innerStatusName}></Badge>
    },
  },
]

const setColumnsByLinks = (link: string) => {
  const linksColumns: ColumnsType<any> = [
    {
      title: intl.formatMessage({ id: 'handling.noticeficationNumAndDesc' }),
      dataIndex: 'des',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to={`${link}?id=${record.id}`}>{record.noticeNo}</Link>
            {/* <EyeAuthButton url={`${link}?id=${record.id}`}>{</EyeAuthButton> */}
            <span style={{ marginTop: '8px' }}>{record.summary}</span>
          </div>
        )
      },
    },
  ]
  return linksColumns.concat(commonColumns)
}

export default setColumnsByLinks
