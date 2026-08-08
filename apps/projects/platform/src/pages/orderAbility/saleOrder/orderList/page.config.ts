export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '导出', key: 'export' },
      { name: '转单', key: 'transfer' },
      { name: '取消', key: 'cancel' },
      { name: '中止', key: 'suspend' },
      { name: '评价', key: 'evaluate' },
      { name: '修改订单价格', key: 'modifyPrice' },
      { name: '修改订单', key: 'modifyOrder' },
      { name: '生成支付链接', key: 'generatePayChart' },
    ],
    cache: true,
  },
}
