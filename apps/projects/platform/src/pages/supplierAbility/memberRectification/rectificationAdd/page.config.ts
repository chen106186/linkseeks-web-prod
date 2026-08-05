export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '新增', key: 'add' },
      { name: '编辑', key: 'edit' },
      { name: '删除', key: 'delete' },
      { name: '发送通知', key: 'sendRectifyNotice' },
    ],
    cache: true,
  },
  add: {
    authButtons: [
      {
        name: '新增',
        key: 'add',
      },
    ],
  },
  edit: {
    authButtons: [
      {
        name: '编辑',
        key: 'edit',
      },
    ],
  },
}
