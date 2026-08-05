export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '确认发货', key: 'edit' },
      { name: '导出订单商品清单', key: 'export' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '发货', key: 'send' }],
  },
}
