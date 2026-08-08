export default {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '编辑', key: 'edit' },
      { name: '提交', key: 'submit' },
      { name: '删除', key: 'del' },
      { name: '新增', key: 'add' },
      { name: '批量删除', key: 'batchdel' },
      { name: '批量提交审核', key: 'batchedit' },
    ],
    cache: true,
  },
  detail: {
    headerMeta: false,
    paddingMeta: false,
  },
}
