export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '新增', key: 'add' },
      { name: '查看详情', key: 'detail' },
      { name: '状态', key: 'status' },
      { name: '编辑', key: 'edit' },
      { name: '删除', key: 'delete' },
    ],
    cache: true,
  },
  detail: {
    authButtons: [{ name: '保存', key: 'submit' }],
  },
  add: {
    authButtons: [{ name: '保存', key: 'submit' }],
  },
  edit: {
    authButtons: [{ name: '保存', key: 'submit' }],
  },
}
