import React from 'react'
import type { ColumnsType } from 'antd/es/table'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import type { GetEnhanceSupplierAllDetailsResponse } from '@apps/apis'
import { Link } from '@linkseeks/router-core'
import DescProgress from '@/components/DescProgress'

/**
 * 收发货统计, 订单
 */

const statisticsColumns: ColumnsType<
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
    title: '加工数量/单位',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a>{record.processNum}</a>
          <span style={{ marginTop: '8px' }}>{record.unit}</span>
        </div>
      )
    },
  },
  {
    title: '交期',
    dataIndex: 'deliveryDate',
    render: (text) => {
      return formatTimeString(text, 'YYYY-MM-DD')
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
    title: '已发货/未发货',
    dataIndex: 'receiveNum',
    render: (text, record) => {
      const descOptions = [
        {
          title: '已发货',
          value: record.deliverNum,
        },
        {
          title: '未发货',
          value: record.notDeliverNum,
        },
      ]
      return <DescProgress descriptions={descOptions} />
    },
  },
  {
    title: '已收货',
    dataIndex: 'receiveNum',
  },
  {
    title: '差异数量',
    dataIndex: 'differenceNum',
  },
  // {
  //   title: '未发货',
  //   dataIndex: "notDeliverNum"
  // }
]

const productColumns = statisticsColumns.slice(1)

/**
 * 收发货详情
 */
const infoOrderColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    render: (text, record) => {
      // orderId, orderDetailId
      return (
        <EyeAuthButton url={`/memberCenter/tranactionAbility/saleOrder/orderList/preview?id=${record.orderId}`}>
          {text}
        </EyeAuthButton>
      )
    },
  },
  {
    title: 'ID',
    dataIndex: 'productId',
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
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
  },
  {
    title: '加工数量',
    dataIndex: 'processNum',
  },
  {
    title: '发货数量',
    dataIndex: 'deliverNum',
  },
]

const infoProductColumns = infoOrderColumns.slice(1)

export { statisticsColumns, productColumns, infoOrderColumns, infoProductColumns }
