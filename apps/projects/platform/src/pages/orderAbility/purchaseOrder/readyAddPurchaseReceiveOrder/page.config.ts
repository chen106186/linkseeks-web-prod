export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '新增', key: 'add' },
      { name: '审核', key: 'examine' },
    ],
    cache: true,
  },
  add: {
    authButtons: [{ name: '保存', key: 'save' }],
  },
}
