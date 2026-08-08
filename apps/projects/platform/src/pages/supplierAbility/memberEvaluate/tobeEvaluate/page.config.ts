export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [{ name: '处理', key: 'detail' }],
    cache: true,
  },
  detail: {
    authButtons: [{ name: '处理', key: 'operate' }],
  },
}
