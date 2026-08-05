/**
 *  订单模块 Table Column 组装
 * @author: 莫雷
 */
import { Tooltip } from 'antd'
import { HarvestMaterialInput } from '../assets/context'
import {
  BrandColumn,
  ClassColumn,
  CommodityIdColumn,
  ConsigneeNumColumn,
  DeliveredNumColumn,
  DeliveryNumColumn,
  FlowNoteColumn,
  FlowOnColumn,
  FlowOptionsColumn,
  FlowOptionsTimeColumn,
  FlowRoleColumn,
  FlowStatusColumn,
  MaterialModelColumn,
  MaterialNameColumn,
  MaterialNoColumn,
  OrderCreatedAtColumn,
  OrderNoColumn,
  OrderSummaryColumn,
  OrderNumColumn,
  PlannedDeliveryNumColumn,
  TradeNameColumn,
  TransitNumColumn,
  UntilColumn,
  CommodityNoColumn,
  ReceivingAddressColumn,
  ResidueDeliveryNumColumn,
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
} from './table-column'

export const DeliveryNoteAddFromTableColumn: any = [
  MaterialNoColumn,
  MaterialNameColumn,
  ClassColumn,
  BrandColumn,
  UntilColumn,
  OrderNoColumn,
  OrderCreatedAtColumn,
  OrderNumColumn,
  DeliveryNumColumn,
  {
    ...ConsigneeNumColumn,
    width: 140,
    render: (_, rcode, index) => {
      return <HarvestMaterialInput value={rcode.DeliveryNum} index={index} keyup="ConsigneeNum" />
    },
    editable: true,
  },
]

export const OutStatusLogTableColumn: any = [
  FlowOnColumn,
  FlowRoleColumn,
  FlowStatusColumn,
  FlowOptionsColumn,
  FlowOptionsTimeColumn,
  FlowNoteColumn,
]

export const DeliveryNoticeTableColumn: any = [
  CommodityIdColumn,
  TradeNameColumn,
  ClassColumn,
  BrandColumn,
  UntilColumn,
  OrderNoColumn,
  OrderCreatedAtColumn,
  OrderNumColumn,
]
export const DeliveryNoticeTableDetailColumn: any = [
  ...DeliveryNoticeTableColumn,
  DeliveryNumColumn,
  ConsigneeNumColumn,
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
]
export const DeliveryNoticeTableColumnSRM: any = [
  MaterialNoColumn,
  MaterialNameColumn,
  MaterialModelColumn,
  ClassColumn,
  BrandColumn,
  UntilColumn,
  OrderNoColumn,
  OrderCreatedAtColumn,
  OrderNumColumn,
  DeliveryNumColumn,
  ConsigneeNumColumn,
]

export const DeliveryNoticeTableDetailColumnSRM: any = [
  ...DeliveryNoticeTableColumnSRM,
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
]
// 计划送样物料表格
export const PlannedDeliveryMaterialTableColumn: any = [
  { width: 80, ...MaterialNoColumn, dataIndex: 'skuId' },
  { width: 192, ...MaterialNameColumn, dataIndex: 'productName' },
  { dataIndex: 'spec', width: 128, ...MaterialModelColumn },
  { dataIndex: 'category', width: 96, ...ClassColumn },
  { dataIndex: 'brand', width: 96, ...BrandColumn },
  { dataIndex: 'unit', width: 64, ...UntilColumn },
  { width: 96, ...OrderNumColumn, dataIndex: 'purchaseCountSum' },
  { ...ConsigneeNumColumn, dataIndex: 'receiveCountSum', width: 96 },
  { ...TransitNumColumn, dataIndex: 'transitCountSum', width: 96 },
  { ...DeliveredNumColumn, dataIndex: 'leftCountSum', width: 96 },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCountSum', width: 128 },
]
export const PlannedDeliveryMaterialTableColumn1: any = [
  { width: 80, ...MaterialNoColumn, dataIndex: 'skuId' },
  { width: 192, ...MaterialNameColumn, dataIndex: 'productName' },
  { dataIndex: 'spec', width: 128, ...MaterialModelColumn },
  { dataIndex: 'category', width: 96, ...ClassColumn },
  { dataIndex: 'brand', width: 96, ...BrandColumn },
  { dataIndex: 'unit', width: 64, ...UntilColumn },
]
// 计划送货商品表格
export const PlannedDeliveryProductTableColumn: any = [
  { width: 80, ...CommodityNoColumn, dataIndex: 'skuId' },
  { width: 192, ...TradeNameColumn, dataIndex: 'productName' },
  { dataIndex: 'category', width: 96, ...ClassColumn },
  { dataIndex: 'brand', width: 96, ...BrandColumn },
  { dataIndex: 'unit', width: 64, ...UntilColumn },
  { width: 96, ...OrderNumColumn, dataIndex: 'purchaseCountSum' },
  { ...ConsigneeNumColumn, dataIndex: 'receiveCountSum', width: 96 },
  { ...TransitNumColumn, dataIndex: 'transitCountSum', width: 96 },
  { ...DeliveredNumColumn, dataIndex: 'leftCountSum', width: 96 },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCountSum', width: 128 },
]
// 计划送货物料子表格
export const PlannedDeliveryMaterialExpandableTableColumn: any = [
  { dataIndex: 'orderNo', ...OrderNoColumn },
  { dataIndex: 'orderDigest', ...OrderSummaryColumn },
  { dataIndex: 'createTime', ...OrderCreatedAtColumn },
  { dataIndex: 'purchaseCount', ...OrderNumColumn },
  { dataIndex: 'receiveCount', ...ConsigneeNumColumn },
  { dataIndex: 'transitCount', ...TransitNumColumn },
  { dataIndex: 'leftCount', ...DeliveredNumColumn },
  { dataIndex: 'planCount', ...PlannedDeliveryNumColumn },
]

// 外部单据流转记录
export const ExternalRoamRecordTableColumn: any = [
  { ...FlowOnColumn, dataIndex: 'id' },
  { ...FlowRoleColumn, dataIndex: 'operatorRoleName' },
  { ...FlowStatusColumn, dataIndex: 'statusName' },
  { ...FlowOptionsColumn, dataIndex: 'operation' },
  { ...FlowOptionsTimeColumn, dataIndex: 'createTime' },
  { ...FlowNoteColumn, dataIndex: 'remark' },
]

// 送货物料
export const DeliveryMaterialsTableColumn: any = [
  { ...MaterialNoColumn, dataIndex: 'skuId' },
  { ...MaterialNameColumn, dataIndex: 'productName' },
  { ...MaterialModelColumn, dataIndex: 'type' },
  { ...ClassColumn, dataIndex: 'category' },
  { ...BrandColumn, dataIndex: 'brand' },
  { ...UntilColumn, dataIndex: 'unit' },
  { ...OrderNoColumn, dataIndex: 'orderNo' },
  { ...OrderCreatedAtColumn, dataIndex: 'createTime' },
  { ...OrderNumColumn, dataIndex: 'purchaseCount' },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCount' },
]

// 送货商品
export const DeliveryGoodsTableColumn: any = [
  { ...CommodityIdColumn, dataIndex: 'skuId' },
  { ...TradeNameColumn, dataIndex: 'productName' },
  { ...MaterialModelColumn, dataIndex: 'type' },
  { ...ClassColumn, dataIndex: 'category' },
  { ...BrandColumn, dataIndex: 'brand' },
  { ...UntilColumn, dataIndex: 'unit' },
  { ...OrderNoColumn, dataIndex: 'orderNo' },
  { ...OrderCreatedAtColumn, dataIndex: 'createTime' },
  { ...OrderNumColumn, dataIndex: 'purchaseCount' },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCount' },
]
