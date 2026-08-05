export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '批量新增', key: 'batchAddRepository' },
      { name: '批量编辑', key: 'batchEdit' },
      { name: '库存调拨', key: 'adjustRepository' },
      { name: '状态', key: 'status' },
    ],
    cache: true,
  },
}
