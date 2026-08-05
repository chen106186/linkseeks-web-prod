import React, { useRef, useState, useMemo } from 'react'
import StandardTable from '@/components/StandardTable'

import { priceFormat } from '@/utils/numberFomat'

import Card from '../../../card'
import { Space, Typography } from 'antd'
import { getIntl } from '@linkseeks/i18n'
const { Text } = Typography

export interface TableCommonLayoutProps {
  layoutId?: string
  layoutTitle?: string
  id?: number
  number?: number
  fetch?: () => Promise<unknown>
}

const intl = getIntl()

const transforType = {
  1: intl.formatMessage({ id: 'detail.purchase.okText' }),
  0: intl.formatMessage({ id: 'detail.purchase.cancelText' }),
}

const TableCommonLayout: React.FC<TableCommonLayoutProps> = (props: any) => {
  const { layoutId, layoutTitle, id, number, fetch } = props
  const currentRef = useRef({})
  const [tableData, setTableData] = useState<any[]>([])

  const _totalPrice = useMemo(() => {
    let _val = 0
    tableData?.forEach((item) => {
      return (_val = _val + item.price)
    })
    return _val
  }, [tableData])

  const columns = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.name}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount1' }),
      key: 'unit',
      dataIndex: 'unit',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{record.purchaseCount}</Text>
          <Text type="secondary">{text}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.isTax1' }),
      key: 'isTax',
      dataIndex: 'isTax',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{transforType[text]}</Text>
          <Text type="secondary">{`${record.taxRate ? `${record.taxRate}%` : ''}`}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxUnitPrice' }),
      key: 'unitPrice',
      dataIndex: 'unitPrice',
      render: (text: any, record: any) => (
        <Text type="secondary">
          {intl.formatMessage({ id: 'common.money' })}
          {priceFormat(text)}
        </Text>
      ),
    },
    {
      title: (
        <>
          <p>{intl.formatMessage({ id: 'detail.purchase.taxPrice' })}</p>
          {_totalPrice && (
            <p>
              ({intl.formatMessage({ id: 'common.money' })}
              {priceFormat(_totalPrice)})
            </p>
          )}
        </>
      ),
      key: 'price',
      dataIndex: 'price',
      render: (text: any, record: any) => (
        <Text type="secondary">
          {intl.formatMessage({ id: 'common.money' })}
          {priceFormat(text)}
        </Text>
      ),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      fetch &&
        fetch({ id, number, ...params }).then((res: any) => {
          setTableData(res.data.data)
          resolve(res.data)
        })
    })
  }

  return (
    <Card id={layoutId} title={layoutTitle}>
      <StandardTable
        keepAlive={false}
        currentRef={currentRef}
        columns={columns}
        tableProps={{ rowKew: 'id' }}
        fetchTableData={(params: any) => fetchData(params)}
      />
    </Card>
  )
}
export default TableCommonLayout
