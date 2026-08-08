export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '提交审核', key: 'edit' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '提交审核', key: 'submit' }],
  },
}
