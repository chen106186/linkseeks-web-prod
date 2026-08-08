export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '批量提交', key: 'submitBatch' },
      { name: '提交订单', key: 'edit' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '提交订单', key: 'submit' }],
  },
}
