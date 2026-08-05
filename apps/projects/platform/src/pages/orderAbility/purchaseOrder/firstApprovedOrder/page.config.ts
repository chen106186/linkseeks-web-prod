export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '审核', key: 'edit' },
      { name: '查看详情', key: 'detail' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '提交', key: 'submit' }],
  },
}
