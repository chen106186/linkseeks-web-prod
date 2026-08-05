export const EXTRA_MESSAGE_TYPE = {
  order: [
    { label: '订单号', key: 'orderNo' },
    { label: '订单金额', key: 'amount' },
    { label: '订单摘要', key: 'digest' },
    { label: '下单时间', key: 'createTime' },
    { label: '订单状态', key: 'outerStatusName' },
    { label: '订单类型', key: 'orderTypeName' },
  ],
  commodity: [
    { label: '商品ID', key: 'id', render: (v, record) => v?.commodityId || v?.id },
    { label: '商品品类', key: 'customerCategory', render: (v, record) => v?.categoryName || v?.customerCategory?.name },
    { label: '商品名称', key: 'name', render: (v, record) => v.commodityName || v.name },
    { label: '品牌', key: 'brand', render: (v) => v?.brandName || v?.name },
    { label: '价格', key: 'min', render: (v) => (v.min ? `${v.min}-${v.max}` : '暂无') },
  ],
  after: [
    { label: '申请单号', key: 'applyNo' },
    { label: '单据时间', key: 'applyTime' },
    { label: '申请单摘要', key: 'applyAbstract' },
    { label: '申请单状态', key: 'outerStatusName' },
  ],
}
