export default {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '批量审核通过', key: 'batchsubmit' },
      { name: '批量删除', key: 'batchdel' },
    ],
    cache: true,
  },
  detail: {
    headerMeta: false,
    paddingMeta: false,
  },
}
