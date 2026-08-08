import React from 'react'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { Badge } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { GetEnhanceSupplierAllDetailsResponse } from '@apps/apis'
import { Link } from '@linkseeks/router-core'
import DescProgress from '@/components/DescProgress'
import { getIntl } from '@linkseeks/i18n'

/**
 * 收发货统计, 订单
 */

const intl = getIntl()
const statisticsColumns: ColumnsType<
  GetEnhanceSupplierAllDetailsResponse['details'][0] & { isHasTax: 0 | 1; taxRate: number }
> = [
  {
    // title: '订单号',
    title: intl.formatMessage({ id: 'handling.assign.add.orderNo' }),
    dataIndex: 'orderNo',
    render: (text, record) => {
      return <Link to={`/orderAbility/purchaseOrder/orderList/detail?id=${record.orderId}`}>{text}</Link>
    },
  },
  {
    // title: 'ID / 商品名称',
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
    // title: '品类',
    dataIndex: 'category',
  },
  {
    // title: '品牌',
    title: intl.formatMessage({ id: 'handling.assign.add.product.brandName' }),
    dataIndex: 'brand',
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.orderNum' })}/${intl.formatMessage({
      id: 'handling.assign.add.product.unitName',
    })}`,
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
    // title: '交期',
    title: intl.formatMessage({ id: 'handling.assign.add.notice.deliveryDate' }),
    dataIndex: 'deliveryDate',
    render: (text, record) => {
      return moment(text).format('YYYY-MM-DD')
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
    title: intl.formatMessage({ id: 'handling.yifahuoweifahuo' }),
    dataIndex: 'receiveNum',
    render: (text, record) => {
      const descOptions = [
        {
          title: intl.formatMessage({ id: 'handling.yifahuo' }),
          value: record.deliverNum,
        },
        {
          title: intl.formatMessage({ id: 'handling.weifahuo' }),
          value: record.notDeliverNum,
        },
      ]
      return <DescProgress descriptions={descOptions} />
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.yishouhuo' }),
    dataIndex: 'receiveNum',
  },
  {
    title: intl.formatMessage({ id: 'handling.chayishuliang' }),
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
    // title: '订单号',
    title: intl.formatMessage({ id: 'handling.assign.add.orderNo' }),
    dataIndex: 'orderNo',
    render: (text, record) => {
      // orderId, orderDetailId
      return <EyeAuthButton url={`/orderAbility/saleOrder/orderList/detail?id=${record.orderId}`}>{text}</EyeAuthButton>
    },
  },
  {
    title: 'ID',
    dataIndex: 'productId',
  },
  {
    // title: '商品名称',
    title: intl.formatMessage({ id: 'handling.assign.add.product.name' }),
    dataIndex: 'productName',
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
  },
  {
    title: intl.formatMessage({ id: 'handling.assign.add.product.processNum' }),
    dataIndex: 'processNum',
  },
  {
    title: intl.formatMessage({ id: 'handling.fahuoshuliang' }),
    dataIndex: intl.formatMessage({ id: 'handling.assign.add.product.deliverNum' }),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.picipandin' }),
    dataIndex: 'batchJudgmentType',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.yunxushuliang' }),
    dataIndex: 'acceptanceCount',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.rangbujieshoushuliang' }),
    dataIndex: 'concessionToReceiveCount',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.jushoushuliang' }),
    dataIndex: 'rejectCount',
  },
]

const infoProductColumns = infoOrderColumns.slice(1)

export { statisticsColumns, productColumns, infoOrderColumns, infoProductColumns }
