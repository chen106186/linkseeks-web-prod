import React from 'react'
import type { ColumnsType } from 'antd/es/table'
import { Link } from '@linkseeks/router-core'
import type { GetEnhanceSupplierAllDetailsResponse } from '@apps/apis'
import { numFormat } from '@/utils/numberFomat'
import { formatTimeString } from '@/utils'

/**
 * 通知单明细
 */
export const columns: ColumnsType<
  GetEnhanceSupplierAllDetailsResponse['details'][0] & { isHasTax: 0 | 1; taxRate: number }
> = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    render: (text, record) => {
      return (
        <Link to={`/memberCenter/tranactionAbility/purchaseOrder/orderList/preview?id=${record.orderId}`}>{text}</Link>
      )
    },
  },
  {
    title: 'ID / 商品名称',
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
    title: '品类',
    dataIndex: 'category',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
  },
  {
    title: '订单数量/单位',
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
    title: '剩余/加工数量',
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
    title: '含税/税率',
    dataIndex: 'isHasTax',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a>{record.isHasTax ? '是' : '否'}</a>
          <span style={{ marginTop: '8px' }}>{record.taxRate}%</span>
        </div>
      )
    },
  },
  {
    title: '加工单价',
    dataIndex: 'processPrice',
  },
  {
    title: '加工费',
    dataIndex: 'processTotalPrice',
  },
  {
    title: '交期',
    dataIndex: 'deliveryDate',
    render: (text) => {
      return formatTimeString(text, 'YYYY-MM-DD')
    },
  },
]

export const productColumn = [
  {
    title: 'ID / 商品名称',
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
    title: '品类',
    dataIndex: 'category',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    render: (text, record) => {
      // const purchaseCount = +record.purchaseCount
      return (
        <div>
          {/* <p>{numFormat((purchaseCount))}</p> */}
          <p>{record.unit}</p>
        </div>
      )
    },
  },
  {
    title: '加工数量',
    dataIndex: 'processNum',
    render: (text, record) => {
      return <div>{record.processNum}</div>
    },
  },
  {
    title: '含税/税率',
    dataIndex: 'isHasTax',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{record.isHasTax ? '是' : '否'}</span>
          <span style={{ marginTop: '8px' }}>{record.taxRate}%</span>
        </div>
      )
    },
  },
  {
    title: '加工单价',
    dataIndex: 'processPrice',
  },
  {
    title: '加工费',
    dataIndex: 'processTotalPrice',
  },
  {
    title: '交期',
    dataIndex: 'deliveryDate',
    render: (text) => {
      return formatTimeString(text, 'YYYY-MM-DD')
    },
  },
]
