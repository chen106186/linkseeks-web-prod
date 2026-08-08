export default {
  view: {
    headerMeta: false,
    paddingMeta: false,
    authButtons: [
      { name: '详情', key: 'detail' },
      { name: '手动结算', key: 'manualSettlement' },
      { name: '付款', key: 'pay' },
      { name: '查看付款凭证', key: 'viewPay' },
    ],
    cache: true,
  },
}
