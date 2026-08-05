export default {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'orderDetail' },
      { name: '批量确认对账', key: 'reconciliation' },
      { name: '批量确认收款', key: 'collection' },
      { name: '导出', key: 'export' },
    ],
    cache: true,
  },
  detail: {
    headerMeta: false,
    paddingMeta: false,
  },
}
