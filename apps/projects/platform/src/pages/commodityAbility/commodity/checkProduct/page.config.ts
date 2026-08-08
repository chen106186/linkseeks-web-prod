export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '审核', key: 'examine' },
      { name: '审核', key: 'batchExamine' },
    ],
    cache: true,
  },
  detail: {
    authButtons: [{ name: '审核', key: 'examine' }],
  },
}
