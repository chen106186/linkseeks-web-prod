export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '确认', key: 'edit' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '确认支付结果', key: 'confirm' }],
  },
}
