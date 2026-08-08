import React from 'react'
import { Drawer, Table, Space, Typography } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { formatTimeString } from '@/utils'
import { getIntl } from '@linkseeks/i18n'

interface DrawerLayoutProps {
  dataSource: any
  visible: boolean
  onClose: () => void
}
const intl = getIntl()
const DrawerLayout: React.FC<DrawerLayoutProps> = (props: any) => {
  const { dataSource, visible, onClose } = props

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchasePlanNo' }),
      key: 'needPlanNo',
      dataIndex: 'needPlanNo',
      render: (text: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{text}</Typography.Text>
          <Typography.Text>{record.summary}</Typography.Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.label44' }),
      key: 'startTime',
      dataIndex: 'startTime',
      render: (text: any, record: any) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{formatTimeString(text, 'YYYY-MM-DD')}</Typography.Text>
          <Typography.Text>{formatTimeString(record.endTime, 'YYYY-MM-DD')}</Typography.Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.department' }),
      key: 'department',
      dataIndex: 'department',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.userName' }),
      key: 'userName',
      dataIndex: 'userName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.needCount' }),
      key: 'needCount',
      dataIndex: 'needCount',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.costPrice' }),
      key: 'costPrice',
      dataIndex: 'costPrice',
      render: (text: any) => (
        <>
          {text
            ? `${intl.formatMessage({ id: 'common.money' })}${text.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0`}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.needPrice' }),
      key: 'needPrice',
      dataIndex: 'needPrice',
      render: (text: any) => (
        <>
          {text
            ? `${intl.formatMessage({ id: 'common.money' })}${text.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0`}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.arriveTime' }),
      key: 'arriveTime',
      dataIndex: 'arriveTime',
      render: (text: any) => formatTimeString(text, 'YYYY-MM-DD'),
    },
  ]

  return (
    <Drawer
      title={intl.formatMessage({ id: 'detail.purchase.modalTitle26' })}
      placement="right"
      visible={visible}
      onClose={onClose}
      width="72.9%"
    >
      <Table rowKey={'id'} columns={columns} dataSource={dataSource} />
    </Drawer>
  )
}
export default DrawerLayout
