import React from 'react'
import { ColumnsType } from 'antd/es/table'
import { Link } from '@linkseeks/router-core'
import { GetEnhanceSupplierAllDetailsResponse } from '@apps/apis'
import { numFormat } from '@/utils/numberFomat'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
/**
 * 通知单明细
 */
export const columns: ColumnsType<
  GetEnhanceSupplierAllDetailsResponse['details'][0] & { isHasTax: 0 | 1; taxRate: number }
> = [
  {
    title: intl.formatMessage({ id: 'handling.assign.add.orderNo' }),
    dataIndex: 'orderNo',
    render: (text, record) => {
      return <Link to={`/orderAbility/purchaseOrder/orderList/detail?id=${record.orderId}`}>{text}</Link>
    },
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.product.id' })} / ${intl.formatMessage({
      id: 'handling.assign.add.product.name',
    })}`,
    dataIndex: 'id',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a>{record.productId}</a>
          <span style={{ marginTop: '8px' }}>{record.productName}</span>
        </div>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.category' }),
    dataIndex: 'category',
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.brandName' }),
    dataIndex: 'brand',
  },
  {
    // title: '订单数量/单位',
    title: `${intl.formatMessage({ id: 'handling.assign.add.orderNum' })}/${intl.formatMessage({
      id: 'handling.assign.add.product.unitName',
    })}`,
    dataIndex: 'unit',
    render: (text, record) => {
      const purchaseCount = +record.purchaseCount
      return (
        <div>
          <p>{numFormat(purchaseCount)}</p>
          <p>{record.unit}</p>
        </div>
      )
    },
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.product.surplus' })}/${intl.formatMessage({
      id: 'handling.assign.add.product.processNum',
    })}`,
    dataIndex: 'processNum',
    render: (text, record) => {
      return (
        <div>
          {record.surplusProcessNum} / {record.processNum}
        </div>
      )
    },
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.hasTax' })}/${intl.formatMessage({
      id: 'handling.assign.add.taxRate',
    })}`,
    dataIndex: 'isHasTax',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a>
            {record.isHasTax ? intl.formatMessage({ id: 'handling.shi' }) : intl.formatMessage({ id: 'handling.fou' })}
          </a>
          <span style={{ marginTop: '8px' }}>{record.taxRate}%</span>
        </div>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice' }),
    dataIndex: 'processPrice',
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.processTotalPrice' }),
    dataIndex: 'processTotalPrice',
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.notice.deliveryDate' }),
    dataIndex: 'deliveryDate',
    render: (text, record) => {
      return moment(text).format('YYYY-MM-DD')
    },
  },
]

export const productColumn = [
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.product.id' })} / ${intl.formatMessage({
      id: 'handling.assign.add.product.name',
    })}`,
    dataIndex: 'id',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a>{record.productId}</a>
          <span style={{ marginTop: '8px' }}>{record.productName}</span>
        </div>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.category' }),
    dataIndex: 'category',
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.brandName' }),
    dataIndex: 'brand',
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.unitName' }),
    dataIndex: 'unit',
    render: (text, record) => {
      // const purchaseCount = +record.purchaseCount
      return (
        <div>
          {/* <p>{numFormat((purchaseCount))}</p> */}
          <span>{record.unit}</span>
        </div>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.processNum' }),
    dataIndex: 'processNum',
    render: (text, record) => {
      return <div>{record.processNum}</div>
    },
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.hasTax' })}/${intl.formatMessage({
      id: 'handling.assign.add.taxRate',
    })}`,
    dataIndex: 'isHasTax',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>
            {record.isHasTax ? intl.formatMessage({ id: 'handling.shi' }) : intl.formatMessage({ id: 'handling.fou' })}
          </span>
          <span style={{ marginTop: '8px' }}>{record.taxRate}%</span>
        </div>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.processUnitPrice' }),
    dataIndex: 'processPrice',
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.processTotalPrice' }),
    dataIndex: 'processTotalPrice',
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.notice.deliveryDate' }),
    dataIndex: 'deliveryDate',
    render: (text, record) => {
      return moment(text).format('YYYY-MM-DD')
    },
  },
]
