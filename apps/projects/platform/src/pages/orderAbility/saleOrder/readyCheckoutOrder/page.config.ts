export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '查看详情', key: 'detail' },
      { name: '核销', key: 'writeOff' },
    ],
    cache: true,
  },
  edit: {
    authButtons: [{ name: '核销', key: 'writeOff' }],
  },
}
