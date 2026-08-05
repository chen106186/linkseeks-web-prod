import React, { useRef } from 'react'
import { Typography, Space } from 'antd'
import StandardTable from '@/components/StandardTable'
import { priceFormat } from '@/utils/numberFomat'

import level1 from '@/assets/icons/the_first.png'
import level2 from '@/assets/icons/the_second.png'
import level3 from '@/assets/icons/the_third.png'

import Card from '../../../card'

import selfStyles from './index.less'
import { getIntl } from '@linkseeks/i18n'

const { Text } = Typography

const intl = getIntl()

const transforType = {
  1: intl.formatMessage({ id: 'detail.purchase.okText' }),
  0: intl.formatMessage({ id: 'detail.purchase.cancelText' }),
}

export interface TableCommonLayoutProps {
  layoutId?: string
  layoutTitle?: string
  id?: number
  number?: number
  fetch?: () => Promise<unknown>
  extra?: React.ReactNode
  effect?: any
}

const LowestQuotationRecord: React.FC<TableCommonLayoutProps> = (props: any) => {
  const { layoutId, layoutTitle, id, number, fetch, extra, effect } = props
  const currentRef = useRef({})

  const columns = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.name}</Text>
        </Space>
      ),
    },
    { title: intl.formatMessage({ id: 'detail.purchase.nameCode' }), dataIndex: 'model' },
    { title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }), dataIndex: 'category' },
    { title: intl.formatMessage({ id: 'detail.purchase.brand' }), dataIndex: 'brand' },
    {
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount1' }),
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
      dataIndex: 'unitPrice',
      render: (text: any, record: any) => (
        <Text type="secondary">
          {intl.formatMessage({ id: 'common.money' })}
          {priceFormat(text)}
        </Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.taxPrice' }),
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
        fetch({ id, number, ...params })
          .then((res: any) => {
            resolve(res.data)
          })
          .catch((error) => {
            console.warn(error)
          })
    })
  }

  const _returnBadge = (number) => {
    const _number = Number(number ?? 0)
    switch (_number) {
      case 0:
        return '-'
      case 1:
        return <img src={level1} alt={intl.formatMessage({ id: 'detail.purchase.label8' })} />
      case 2:
        return <img src={level2} alt={intl.formatMessage({ id: 'detail.purchase.label9' })} />
      case 3:
        return <img src={level3} alt={intl.formatMessage({ id: 'detail.purchase.label10' })} />
      default:
        return <div className={selfStyles.badge}>{_number}</div>
    }
  }

  return (
    <Card id={layoutId} title={layoutTitle} extra={extra}>
      <div className={selfStyles.baseItem}>
        <div className={selfStyles.label}>{intl.formatMessage({ id: 'detail.purchase.rankHeader' })}： </div>
        <div className={selfStyles.content}>{_returnBadge(effect?.ranking)}</div>
      </div>
      <div className={selfStyles.baseItem}>
        <div className={selfStyles.label}>
          {intl.formatMessage({ id: 'table.purchase.sumPrice' })}({intl.formatMessage({ id: 'detail.purchase.isTax' })}
          )：{' '}
        </div>
        <div className={selfStyles.content}>
          {effect?.reportPrice
            ? `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(effect?.reportPrice)}`
            : '-'}
        </div>
      </div>
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
export default LowestQuotationRecord
