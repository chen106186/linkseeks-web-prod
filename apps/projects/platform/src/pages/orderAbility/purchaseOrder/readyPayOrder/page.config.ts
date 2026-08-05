export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '支付', key: 'edit' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '支付', key: 'pay' }],
  },
}
