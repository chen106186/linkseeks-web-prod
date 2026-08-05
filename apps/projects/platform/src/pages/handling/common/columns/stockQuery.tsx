import React from 'react'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { Badge } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { innerStatusColor, outerStatusType } from '../colors'
import StatusTag from '@/components/StatusTag'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
const intl = getIntl()

const commonColumns: ColumnsType<any> = [
  {
    title: intl.formatMessage({ id: 'handling.jiagongqiyemingcheng' }),
    dataIndex: 'processName',
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
      const offset = record.supplierInnerStatus % 12
      return (
        <Badge text={record.innerStatusName} color={innerStatusColor[offset]}></Badge>
        // record.innerStatusName
      )
    },
  },
]

/**
 * 待新增加工入库单 以及 待收货生产通知单
 * @param links
 * @returns
 */
const setColumnsByLinks = (links: { [key: string]: string }) => {
  const isStorage: boolean = 'storage' in links
  const type: 'storage' | 'deliver' = isStorage ? 'storage' : 'deliver'

  const linksColumns: ColumnsType<any> = [
    {
      title: intl.formatMessage({ id: 'handling.tongzhidanhaozhaiyao' }),
      dataIndex: 'des',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <EyeAuthButton url={`${links['detail']}?id=${record.id}`}>{record.noticeNo}</EyeAuthButton>
            <span style={{ marginTop: '8px' }}>{record.summary}</span>
          </div>
        )
      },
    },
  ]
  const batchColum = {
    title: intl.formatMessage({ id: 'handling.fahuopicirukudan' }),
    dataIndex: 'batch',
    render: (text: any, record: any) => {
      const id: number = isStorage ? record.storageId : record.deliveryId
      return (
        // <EyeAuthButton url={`${url}?id=${id}`} >{record[`${type}No`]}</EyeAuthButton>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>
            {intl.formatMessage({ id: 'handling.di' })}
            {record.deliveryBatch}
            {intl.formatMessage({ id: 'handling.pici' })}
          </span>
          {id && <Link to={`${links[type]}?id=${id}`}>{record[`${type}No`]}</Link>}
          {/* <EyeAuthButton url={`${links[type]}?id=${id}`} >{record[`${type}No`]}</EyeAuthButton> */}
        </div>
      )
    },
  }
  const tempColumns = [...commonColumns]
  tempColumns.splice(2, 0, batchColum)
  return linksColumns.concat(tempColumns)
}

export default setColumnsByLinks
