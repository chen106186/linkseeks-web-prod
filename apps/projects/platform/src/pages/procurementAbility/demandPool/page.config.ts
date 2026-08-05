export default {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '转合同', key: 'toContract' },
      { name: '转订单', key: 'toOrder' },
      { name: '转询价', key: 'toInquiry' },
      { name: '转招标', key: 'toBidding' },
      { name: '转竞价', key: 'toBidding2' },

      { name: '导入', key: 'import' },
    ],
    cache: true,
  },
  detail: {
    headerMeta: false,
    paddingMeta: false,
  },
}
