import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import add from '@/assets/imgs/add.png'
import subtraction from '@/assets/imgs/subtraction.png'
import { priceFormat } from '@/utils/numberFomat'

const intl = getIntl()

export const productNoticecolumns = [
  { title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.orderNo' }), dataIndex: 'orderNo' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.orderAbstract' }),
    dataIndex: 'orderAbstract',
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.orderTypeName' }),
    dataIndex: 'orderTypeName',
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.orderTime' }),
    dataIndex: 'orderTime',
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.orderAmount' }),
    dataIndex: 'orderAmount',
    render: (text) => {
      return intl.formatMessage({ id: 'common.money' }) + priceFormat(text)
    },
  },
  { title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.batch' }), dataIndex: 'batch' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.receiveTime' }),
    dataIndex: 'receiveTime',
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.receiveCount' }),
    dataIndex: 'receiveCount',
  },
  // {title: '加工单价', dataIndex: 'processPrice'},
  {
    title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.settlementAmount' }),
    dataIndex: 'settlementAmount',
    render: (text) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {(text !== 0 && <img src={text > 0 ? add : subtraction} width={16} height={16} />) || null}
          <span style={{ marginLeft: '8px' }}>{`${priceFormat(Math.abs(text))}`}</span>
        </div>
      )
    },
  },
]

export const logisticsColumn = [
  { title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.orderNo' }), dataIndex: 'orderNo' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.orderAbstract' }),
    dataIndex: 'orderAbstract',
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.orderTypeName' }),
    dataIndex: 'orderTypeName',
  },
  { title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.orderTime' }), dataIndex: 'orderTime' },
  { title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.totalCarton' }), dataIndex: 'totalCarton' },
  { title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.totalWeight' }), dataIndex: 'totalWeight' },
  { title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.totalVolume' }), dataIndex: 'totalVolume' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.tax' }),
    dataIndex: 'tax',
    render: (text, record) => {
      return record.isHasTax
        ? `${record.isHasTaxName}/${record.taxRate}`
        : intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.tax.none' })
    },
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.orderAmount' }),
    dataIndex: 'orderAmount',
    render: (text) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {(text !== 0 && <img src={text > 0 ? add : subtraction} width={16} height={16} />) || null}
          <span style={{ marginLeft: '8px' }}>{`${intl.formatMessage({ id: 'common.money' })}${priceFormat(
            Math.abs(text),
          )}`}</span>
        </div>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.acceptOrderTime' }),
    dataIndex: 'acceptOrderTime',
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.logisticsColumn.settlementAmount' }),
    dataIndex: 'settlementAmount',
    render: (text) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {(text !== 0 && <img src={text > 0 ? add : subtraction} width={16} height={16} />) || null}
          <span style={{ marginLeft: '8px' }}>{`${intl.formatMessage({ id: 'common.money' })}${priceFormat(
            Math.abs(text),
          )}`}</span>
        </div>
      )
    },
  },
]

export const orderColumns = [
  { title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.orderNo' }), dataIndex: 'orderNo' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.orderAbstract' }),
    dataIndex: 'orderAbstract',
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.orderTypeName' }),
    dataIndex: 'orderTypeName',
  },
  { title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.orderTime' }), dataIndex: 'orderTime' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.orderTypeName.2' }),
    dataIndex: 'orderTypeName',
  },
  { title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.orderAmount' }), dataIndex: 'orderAmount' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.tax' }),
    dataIndex: 'tax',
    render: (text, record) => {
      return record.isHasTax
        ? `${record.isHasTaxName}/${record.taxRate}`
        : intl.formatMessage({ id: 'balance.common.columns.orderColumns.tax.none' })
    },
  },
  { title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.batch' }), dataIndex: 'payCount' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.amount' }),
    dataIndex: 'payAmount',
    render: (text) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {(text !== 0 && <img src={text > 0 ? add : subtraction} width={16} height={16} />) || null}
          <span style={{ marginLeft: '8px' }}>{`${intl.formatMessage({ id: 'common.money' })}${priceFormat(
            Math.abs(text),
          )}`}</span>
        </div>
      )
    },
  },
  { title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.payTime' }), dataIndex: 'payTime' },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.orderColumns.settlementAmount' }),
    dataIndex: 'settlementAmount',
    render: (text) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {(text !== 0 && <img src={text > 0 ? add : subtraction} width={16} height={16} />) || null}
          <span style={{ marginLeft: '8px' }}>{`${intl.formatMessage({ id: 'common.money' })}${priceFormat(
            Math.abs(text),
          )}`}</span>
        </div>
      )
    },
  },
]
