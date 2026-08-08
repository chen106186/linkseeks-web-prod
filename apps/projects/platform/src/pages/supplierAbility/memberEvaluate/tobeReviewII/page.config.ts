export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [{ name: '审核', key: 'detail' }],
    cache: true,
  },
  detail: {
    authButtons: [{ name: '审核', key: 'audit' }],
  },
}
