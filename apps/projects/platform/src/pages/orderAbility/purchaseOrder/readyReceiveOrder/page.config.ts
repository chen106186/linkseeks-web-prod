export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '确认收货', key: 'edit' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '收货', key: 'collect' }],
  },
}
