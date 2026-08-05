import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'

export const columns: RecordColumns<any>[] = [
  { title: '单据号', key: 'orderNo', searchField: { main: true } },
  { title: '单据摘要', key: 'orderAbstract' },
  { title: '单据类型', key: 'settlementOrderTypeName' },
  { title: '单据时间', key: 'orderTime', searchField: { type: 'DateSelect', name: 'sourceDate', title: '下单时间' } },
  { title: '订单类型', key: 'orderTypeName' },
  { title: '所需积分', key: 'orderScore' },
  { title: '支付积分', key: 'payScore' },
  { title: '支付时间', key: 'payTime', searchField: { type: 'DateSelect', name: 'sourceDate2', title: '支付时间' } },
  {
    title: '兑换比率',
    key: 'ratio',
    render: (text, record) => {
      return record.ratio + '%'
    },
  },
  {
    title: '本期结算金额',
    key: 'settlementAmount',
    render: (text, record) => '￥' + record.settlementAmount,
  },
]
