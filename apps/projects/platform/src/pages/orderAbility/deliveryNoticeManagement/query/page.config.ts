export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '作废', key: 'void' },
    ],
    cache: true,
  },
  add: {
    authButtons: [{ name: '提交', key: 'submit' }],
  },
}
