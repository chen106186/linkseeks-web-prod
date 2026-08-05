import React from 'react'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { priceFormat } from '@/utils/numberFomat'
import IconMoney from '../components/IconMoney'
import { QuestionCircleIcon } from '@linkseeks/icons'
import { Tooltip } from 'antd'

/**
 * 待收账款结算详情columns
 */
export const pendingReceiveColumns: RecordColumns<any>[] = [
  { title: '单据号', key: 'orderNo', searchField: { main: true } },
  { title: '单据摘要', key: 'orderAbstract' },
  { title: '单据类型', key: 'settlementOrderTypeName' },
  { title: '订单类型', key: 'orderTypeName' },
  { title: '单据时间', key: 'orderTime', searchField: { type: 'DateSelect', name: 'sourceDate', title: '下单时间' } },
  {
    title: '单据总额',
    key: 'orderAmount',
    render: (text) => {
      return '￥' + text
    },
  },
  { title: '支付时间', key: 'payTime', searchField: { type: 'DateSelect', name: 'sourceDate2', title: '支付时间' } },
  {
    title: '代收金额',
    key: 'collectAmount',
    render: (text) => {
      return <IconMoney count={text} />
    },
  },
  {
    title: '平台佣金比例',
    key: 'ratio',
    render: (text, record) => {
      return record.ratio + '%'
    },
  },
  {
    title: '分销订单佣金',
    key: 'socialDistributionAmount',
    render: (text) => {
      return <IconMoney count={text} />
    },
  },
  {
    title: '团购订单佣金',
    key: 'communityGroupBuyingAmount',
    render: (text) => {
      return <IconMoney count={text} />
    },
  },
  {
    title: '平台佣金',
    key: 'brokerage',
    render: (text) => (
      <div>
        {text < 0 && '-'}
        <span>￥{priceFormat(Math.abs(text))}</span>
      </div>
    ),
  },
  {
    title: (
      <div>
        <span>本期结算金额</span>
        <Tooltip placement="top" title={'结算金额=代收商品金额-平台佣金'}>
          <QuestionCircleIcon color="#333" size={12} style={{ marginLeft: 4 }} />
        </Tooltip>
      </div>
    ),
    key: 'settlementAmount',
    render: (text) => {
      return <IconMoney count={text} />
    },
  },
]
