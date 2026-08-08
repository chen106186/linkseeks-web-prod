export default {
  view: {
    paddingMeta: false,
    headerMeta: false,
    authButtons: [
      { name: '使用或冻结', key: 'enableOrFrozen' },
      { name: '变更', key: 'change' },
      { name: '价格库', key: 'toPriceLibrary' },
      { name: '库存', key: 'toStockSellStorage' },
      { name: '编辑', key: 'edit' },
      { name: '批量冻结', key: 'batchFrozon' },
      { name: '批量启用', key: 'batchEnable' },
    ],
    cache: true,
  },
}
