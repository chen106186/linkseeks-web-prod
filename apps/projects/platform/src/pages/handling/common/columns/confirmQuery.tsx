import React from 'react'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { Badge } from 'antd'
// import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import StatusTag from '@/components/StatusTag'
import { innerStatusColor, outerStatusType } from '../colors'

const intl = getIntl()
const commonColumns: ColumnsType<any> = [
  {
    title: intl.formatMessage({ id: 'handling.gongyinghuiyuan' }),
    dataIndex: 'supplierName',
  },
  {
    title: intl.formatMessage({ id: 'handling.danjushijian' }),
    dataIndex: 'createTime',
    sorter: (a, b) => a.createTime - b.createTime,
    render: (text, record) => moment(text).format('YYYY-MM-DD'),
  },
  {
    title: intl.formatMessage({ id: 'handling.waibuzhuangtai' }),
    dataIndex: 'outerStatus',
    render: (text, record: any) => {
      const offset = record.outerStatus % 5
      return <StatusTag title={record.outerStatusName} type={outerStatusType[offset] as 'success'}></StatusTag>
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.neibuzhuangtai' }),
    dataIndex: 'innerStatus',
    render: (text, record: any) => {
      const offset = record.processInnerStatus % 12
      return (
        <Badge text={record.innerStatusName} color={innerStatusColor[offset]}></Badge>
        // record.innerStatusName
      )
    },
  },
]

const setColumnsByLinks = (link: string) => {
  const linksColumns: ColumnsType<any> = [
    {
      title: intl.formatMessage({ id: 'handling.tongzhidanhaozhaiyao' }),
      dataIndex: 'des',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* <EyeAuthButton url={`${link}?id=${record.id}`}>{record.noticeNo}</EyeAuthButton> */}
            <Link to={`${link}?id=${record.id}`}>{record.noticeNo}</Link>

            <span style={{ marginTop: '8px' }}>{record.summary}</span>
          </div>
        )
      },
    },
  ]
  return linksColumns.concat(commonColumns)
}

export default setColumnsByLinks
