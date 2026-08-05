export default {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '审核', key: 'submit' },
      { name: '批量审核通过', key: 'batchsubmit' },
      { name: '新建', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '删除', key: 'del' },
      { name: '批量删除', key: 'batchdel' },
    ],
    cache: true,
  },
  detail: {
    headerMeta: false,
    paddingMeta: false,
  },
}
