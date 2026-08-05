import { priceFormat } from '@/utils/numberFomat'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'

export const columns: RecordColumns<any>[] = [
  { title: '单据号', key: 'orderNo', searchField: { main: true } },
  { title: '单据摘要', key: 'orderAbstract' },
  { title: '单据类型', key: 'settlementOrderTypeName' },
  {
    title: '单据时间',
    key: 'orderTime',
    searchField: {
      type: 'DateRange',
      name: ['orderStartTime', 'orderEndTime'],
      placeholder: ['下单开始时间', '下单结束时间'],
    },
  },
  {
    title: '单据总额',
    key: 'orderAmount',
    render: (text) => `￥${priceFormat(text)}`,
  },
  {
    title: '优惠券金额',
    key: 'couponAmount',
    render: (text) => `￥${priceFormat(text)}`,
  },
  { title: '优惠券券码', key: 'couponNo' },
  {
    title: '支付时间',
    key: 'payTime',
    searchField: {
      type: 'DateRange',
      name: ['payStartTime', 'payEndTime'],
      placeholder: ['支付开始时间', '支付结束时间'],
    },
  },
  {
    title: '本期结算金额',
    key: 'settlementAmount',
    render: (text) => `￥${priceFormat(text)}`,
  },
]
