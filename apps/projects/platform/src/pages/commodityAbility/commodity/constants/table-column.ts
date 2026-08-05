import dayjs from 'dayjs'

/**
 *  订单模块 Table Column 分离 （国际化统一配置）
 * @author: 莫雷
 */
export const CommodityIdColumn: any = {
  title: '商品ID',
  dataIndex: 'skuId',
  key: 'skuId',
  // align: 'center',
}

export const CommodityNoColumn: any = {
  title: '商品编号',
  // align: 'center',
}

export const TradeNameColumn: any = {
  title: '商品名称',
  dataIndex: 'productName',
  key: 'productName',
  // align: 'center',
}

export const MaterialNoColumn: any = {
  title: '物料编号',
  dataIndex: 'skuId',
  key: 'skuId',
  // align: 'center',
}

export const MaterialNameColumn: any = {
  title: '物料名称',
  dataIndex: 'productName',
  key: 'productName',
  // align: 'center',
}

export const MaterialModelColumn: any = {
  title: '规格型号',
  dataIndex: 'spec',
  key: 'spec',
  // align: 'center',
}

export const ClassColumn: any = {
  title: '品类',
  dataIndex: 'category',
  key: 'category',
  // align: 'center',
}

export const BrandColumn: any = {
  title: '品牌',
  dataIndex: 'brand',
  key: 'brand',
  // align: 'center',
}

export const UntilColumn: any = {
  title: '单位',
  dataIndex: 'unit',
  key: 'unit',
  // align: 'center',
}

export const OrderNoColumn: any = {
  title: '订单号',
  dataIndex: 'orderNo',
  key: 'orderNo',
  // align: 'center',
}

export const OrderSummaryColumn: any = {
  title: '订单摘要',
  // align: 'center',
}

export const OrderCreatedAtColumn: any = {
  title: '需求时间',
  // align: 'center',
  render: (txt, rcoed) => dayjs(rcoed.createTime).format('YYYY-MM-DD HH:mm:ss'),
}

export const ReceivingAddressColumn: any = {
  title: '收货地址',
  // align: 'center',
}

export const OrderNumColumn: any = {
  title: '订单数量',
  dataIndex: 'purchaseCount',
  key: 'purchaseCount',
  // align: 'center',
}

export const DeliveryNumColumn: any = {
  title: '送货数量',
  // width: 100,
  dataIndex: 'deliveryCount',
  key: 'deliveryCount',
}

export const ConsigneeNumColumn: any = {
  title: '收货数量',
  // align: 'center',
  dataIndex: 'receiveCount',
  key: 'receiveCount',
}

export const TransitNumColumn: any = {
  title: '在途数量',
  // align: 'center',
  render: (txt, rcoed) => txt,
}

export const DeliveredNumColumn: any = {
  title: '待送货数量',
  // align: 'center',
}

export const PlannedDeliveryNumColumn: any = {
  title: '计划送货数量',
  // align: 'center',
}

export const FlowOnColumn: any = {
  title: '序号',
  // align: 'center',
}

export const FlowRoleColumn: any = {
  title: '操作角色',
  // align: 'center',
}

export const FlowStatusColumn = {
  title: '状态',
  // align: 'center',
}

export const FlowOptionsColumn: any = {
  title: '操作',
  // align: 'center',
}

export const FlowOptionsTimeColumn: any = {
  title: '操作时间',
  // align: 'center',
}

export const FlowNoteColumn: any = {
  title: '审核意见',
  // align: 'center',
}

export const PlanNumberColumn: any = {
  title: '计划编号',
  // align: 'center',
}

export const PlanSummaryColumn: any = {
  title: '计划摘要',
  // align: 'center',
}

export const PlannedStartDateColumn: any = {
  title: '计划开始日期',
  // align: 'center',
}

export const PlannedEndDateColumn: any = {
  title: '计划结束日期',
  // align: 'center',
}

export const SupplyMemberColumn: any = {
  title: '供应会员',
  // align: 'center',
}

export const PurchasingMemberColumn: any = {
  title: '采购会员',
  // align: 'center',
}

export const ExternalStateColumn: any = {
  title: '外部状态',
  // align: 'center',
}

export const OperationColumn: any = {
  title: '操作',
  // align: 'center',
}
