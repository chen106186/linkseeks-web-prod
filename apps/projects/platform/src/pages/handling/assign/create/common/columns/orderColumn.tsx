import moment from 'moment'
import { ORDER_TYPE } from '@/constants/order'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const orderColumns = [
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.orderNo' })}/${intl.formatMessage({
      id: 'handling.description',
    })}`,
    dataIndex: 'orderNoAndDesc',
    render: (text, record) => {
      return (
        <div>
          <p>{record.orderNo}</p>
          <p>{record.orderThe}</p>
        </div>
      )
    },
  },
  {
    title: `${intl.formatMessage({ id: 'handling.purchasing.member' })}`,
    dataIndex: 'buyerMemberName',
  },
  {
    title: `${intl.formatMessage({ id: 'handling.order.time' })}`,
    dataIndex: 'createTime',
    render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: `${intl.formatMessage({ id: 'handling.order.statusName' })}`,
    dataIndex: 'outerStatusName',
  },
  {
    title: `${intl.formatMessage({ id: 'handling.order.type' })}`,
    dataIndex: 'orderTypeName',
    // render: (text, record) => {
    //   // ：1.询价采购2.需求采购3.现货采购4.集采5.渠道直采6.渠道现货7.积分兑换8.渠道积分兑换
    //   return (
    //     <span>{ORDER_TYPE[text] || ''}</span>
    //   )
    // }
  },
]

export const orderProductColumns = [
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.product.id' })}/${intl.formatMessage({
      id: 'handling.assign.add.product.name',
    })}`,
    dataIndex: 'id',
    render: (text, record) => {
      return `${record.orderProductId}/${record.name}`
    },
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.product.category' })}`,
    dataIndex: 'category',
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.product.brandName' })}`,
    dataIndex: 'brand',
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.product.unitName' })}`,
    dataIndex: 'unit',
  },
  {
    title: `${intl.formatMessage({ id: 'handling.assign.add.orderNum' })}`,
    dataIndex: 'purchaseCount',
    render: (text, record) => record.quantity,
  },
  {
    title: `${intl.formatMessage({ id: 'handling.restProcessNum' })}`,
    dataIndex: 'restNum',
    render: (text, record) => +record.quantity - (+record.enhanceCount || 0),
  },
  {
    title: `${intl.formatMessage({ id: 'handling.hasProcessNm' })}`,
    dataIndex: 'processNum',
    render: (text) => text || 0,
  },
]
