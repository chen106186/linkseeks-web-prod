export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '提交', key: 'submit' },
      { name: '批量提交', key: 'submitBatch' },
      { name: '删除', key: 'delete' },
      { name: '批量删除', key: 'deleteBatch' },
    ],
    cache: true,
  },
  add: {
    authButtons: [{ name: '保存', key: 'save' }],
  },
  edit: {
    authButtons: [{ name: '保存', key: 'save' }],
  },
}
