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
  // ResidueDeliveryNumColumn,
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
  OrderProductPositionVOSColumn,
  OccupyInventoryVOSColumn,
  // PurchaseCountSumColumn,
  AvailableForDeliveryQuantityColumn,
  PurchaseCountColumn,
  OrderCountColumn,
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

export const DeliveryNoticeTableColumnB2B: any = [
  { ...CommodityIdColumn, width: 80 },
  { ...TradeNameColumn, width: 192 },
  { ...ClassColumn, width: 96 },
  { ...BrandColumn, width: 96 },
  { ...UntilColumn, width: 64 },
  { ...OrderNoColumn, width: 96 },
  { ...OrderCreatedAtColumn, width: 128 },
  { ...OrderProductPositionVOSColumn, width: 192 },
  { ...OccupyInventoryVOSColumn, width: 160 },
  { ...AvailableForDeliveryQuantityColumn, width: 96 },
  { ...PurchaseCountColumn, width: 96 },
  { ...OrderNumColumn, dataIndex: 'leftCount', key: 'leftCount', width: 96 },
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
  PurchaseCountColumn,
  ConsigneeNumColumn,
  { ...OrderNumColumn, dataIndex: 'leftCount', key: 'leftCount' },
]

export const DeliveryNoticeTableDetailColumnSRM: any = [
  ...DeliveryNoticeTableColumnSRM,
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
]
// 计划送货物料表格
export const PlannedDeliveryMaterialTableColumn: any = [
  { width: 80, ...MaterialNoColumn, dataIndex: 'skuId' },
  { width: 192, ...MaterialNameColumn, dataIndex: 'productName' },
  { dataIndex: 'spec', width: 128, ...MaterialModelColumn },
  { dataIndex: 'category', width: 96, ...ClassColumn },
  { dataIndex: 'brand', width: 96, ...BrandColumn },
  { dataIndex: 'unit', width: 64, ...UntilColumn },
  { width: 96, ...PurchaseCountColumn, dataIndex: 'purchaseCountSum' },
  { ...ConsigneeNumColumn, dataIndex: 'receiveCountSum', width: 96 },
  { ...TransitNumColumn, dataIndex: 'transitCountSum', width: 96 },
  { ...DeliveredNumColumn, dataIndex: 'leftCountSum', width: 96 },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCountSum', width: 128 },
]
// 计划送货商品表格
export const PlannedDeliveryProductTableColumn: any = [
  { width: 80, ...CommodityNoColumn, dataIndex: 'skuId' },
  { width: 192, ...TradeNameColumn, dataIndex: 'productName' },
  { dataIndex: 'category', width: 96, ...ClassColumn },
  { dataIndex: 'brand', width: 96, ...BrandColumn },
  { dataIndex: 'unit', width: 64, ...UntilColumn },
  { width: 96, ...PurchaseCountColumn, dataIndex: 'purchaseCountSum' },
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
  { dataIndex: 'purchaseCount', ...OrderCountColumn },
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

// 送货计划管理，协同  B2B通用 column
export const columnB2B = [
  { ...CommodityNoColumn, dataIndex: 'skuId', width: 110, ellipsis: true, fixed: 'left' },
  { ...TradeNameColumn, dataIndex: 'productName', width: 254, ellipsis: true, fixed: 'left' },
  { ...ClassColumn, dataIndex: 'category', width: 128, ellipsis: true, fixed: 'left' },
  { ...BrandColumn, dataIndex: 'brand', width: 128, ellipsis: true, fixed: 'left' },
  { ...UntilColumn, dataIndex: 'unit', width: 64, ellipsis: true, fixed: 'left' },
  { ...OrderNumColumn, dataIndex: 'purchaseCountSum', width: 96, ellipsis: true, fixed: 'left' },
  { ...ConsigneeNumColumn, dataIndex: 'receiveCountSum', width: 96, ellipsis: true },
  { ...TransitNumColumn, dataIndex: 'transitCountSum', width: 96, ellipsis: true },
  { ...DeliveredNumColumn, dataIndex: 'leftCountSum', width: 96, ellipsis: true },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCountSum', width: 104, ellipsis: true },
]

// 送货计划管理，协同  SRM通用 column
export const columnSRM = [
  { ...MaterialNoColumn, dataIndex: 'skuId', width: 110, ellipsis: true, fixed: 'left' },
  { ...MaterialNameColumn, dataIndex: 'productName', width: 192, ellipsis: true, fixed: 'left' },
  { ...MaterialModelColumn, dataIndex: 'spec', width: 128, ellipsis: true, fixed: 'left' },
  { ...ClassColumn, dataIndex: 'category', width: 96, ellipsis: true, fixed: 'left' },
  { ...BrandColumn, dataIndex: 'brand', width: 96, ellipsis: true, fixed: 'left' },
  { ...UntilColumn, dataIndex: 'unit', width: 64, ellipsis: true, fixed: 'left' },
  { ...OrderNumColumn, dataIndex: 'purchaseCountSum', width: 96, ellipsis: true, fixed: 'left' },
  { ...ConsigneeNumColumn, dataIndex: 'receiveCountSum', width: 96, ellipsis: true },
  { ...TransitNumColumn, dataIndex: 'transitCountSum', width: 96, ellipsis: true },
  { ...DeliveredNumColumn, dataIndex: 'leftCountSum', width: 96, ellipsis: true },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCountSum', width: 104, ellipsis: true },
]

//  送货计划管理 SRM，B2B 嵌套表格通用 column - 不带地址
export const initExpandIconColumn = [
  { ...OrderNoColumn, dataIndex: 'orderNo', width: 110, ellipsis: true, fixed: 'left' },
  { ...OrderSummaryColumn, dataIndex: 'orderDigest', width: 320, ellipsis: true, fixed: 'left' },
  { ...OrderCreatedAtColumn, dataIndex: 'createTime', width: 286, ellipsis: true, fixed: 'left' },
  { ...OrderNumColumn, dataIndex: 'purchaseCount', width: 96, ellipsis: true, fixed: 'left' },
  { ...ConsigneeNumColumn, dataIndex: 'receiveCount', width: 96, ellipsis: true },
  { ...TransitNumColumn, dataIndex: 'transitCount', width: 96, ellipsis: true },
  { ...DeliveredNumColumn, dataIndex: 'leftCount', width: 96, ellipsis: true },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCount', width: 104, ellipsis: true },
]

//  送货计划协同 SRM，B2B 嵌套表格通用 column - 带地址
export const jointExpandIconColumn = [
  { ...OrderNoColumn, dataIndex: 'orderNo', width: 110, ellipsis: true, fixed: 'left' },
  { ...OrderSummaryColumn, dataIndex: 'orderDigest', width: 218, ellipsis: true, fixed: 'left' },
  { ...OrderCreatedAtColumn, dataIndex: 'createTime', width: 188, ellipsis: true, fixed: 'left' },
  {
    ...ReceivingAddressColumn,
    dataIndex: 'provinceName',
    width: 168,
    ellipsis: true,
    fixed: 'left',
    render: (txt: string, record: any) => (
      <Tooltip
        placement="topLeft"
        title={
          <>
            <span>{`${txt ?? '-'}${record?.cityName ?? '-'}${record?.districtName ?? '-'}${record?.streetName ?? '-'}${
              record?.address ?? '-'
            }`}</span>
            <br />
            <span>
              {record?.consignee ?? '-'}&nbsp;&nbsp;{record?.phone ?? '-'}
            </span>
          </>
        }
      >
        <span>{`${txt ?? '-'}${record?.cityName ?? '-'}${record?.districtName ?? '-'}${record?.streetName ?? '-'}${
          record?.address ?? '-'
        }`}</span>
      </Tooltip>
    ),
  },
  { ...OrderNumColumn, dataIndex: 'purchaseCount', width: 96, ellipsis: true, fixed: 'left' },
  { ...ConsigneeNumColumn, dataIndex: 'receiveCount', width: 96, ellipsis: true },
  { ...TransitNumColumn, dataIndex: 'transitCount', width: 96, ellipsis: true },
  { ...DeliveredNumColumn, dataIndex: 'leftCount', width: 96, ellipsis: true },
  { ...PlannedDeliveryNumColumn, dataIndex: 'planCount', width: 104, ellipsis: true },
]
