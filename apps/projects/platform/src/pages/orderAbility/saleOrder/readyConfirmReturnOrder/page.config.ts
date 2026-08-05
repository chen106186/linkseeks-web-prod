export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '去确认回单', key: 'edit' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '去确认回单', key: 'confirm' }],
  },
}
