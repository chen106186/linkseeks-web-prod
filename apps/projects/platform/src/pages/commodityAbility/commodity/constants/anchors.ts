import { AnchorsItem } from '@/components/AnchorPage'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
const BaseInfo: AnchorsItem = {
  key: 'BaseInfo',
  name: translate('web.common.jibenxinxi'),
}
const DeliverInfo: AnchorsItem = {
  key: 'DeliverInfo',
  name: translate('web.resource.commodity.songyangxinxi'),
}

const BillsInfo: AnchorsItem = {
  key: 'BillsInfo',
  name: translate('web.resource.commodity.danjuxinxi'),
}

const Distribution: AnchorsItem = {
  key: 'Distribution',
  name: translate('web.resource.logistics.songhuoxinxi'),
}

const DeliveryInfo: AnchorsItem = {
  key: 'DeliveryInfo',
  name: translate('web.resource.logistics.fahuoxinxi'),
}

const LogisticsInfo: AnchorsItem = {
  key: 'LogisticsInfo',
  name: translate('web.resource.logistics.wuliuxinxi'),
}

const Material: AnchorsItem = {
  key: 'Material',
  name: translate('web.resource.logistics.songyangwuliao'),
}

const ShippingInfo: AnchorsItem = {
  key: 'ShippingInfo',
  name: translate('web.resource.logistics.songhuoxinxi'),
}

const DeliveryList: AnchorsItem = {
  key: 'DeliveryList',
  name: translate('web.resource.commodity.songhuoliebiao'),
}

const Harvest: AnchorsItem = {
  key: 'Harvest',
  name: translate('web.resource.logistics.shouhuoxinxi'),
}

const HarvestMaterial: AnchorsItem = {
  key: 'HarvestMaterial',
  name: translate('web.resource.commodity.shouhuowuliao'),
}
const DeliveryMaterial: AnchorsItem = {
  key: 'DeliveryMaterial',
  name: translate('web.resource.commodity.songhuowuliao'),
}

const HarvestGood: AnchorsItem = {
  key: 'HarvestMaterial',
  name: translate('web.resource.commodity.shouhuoshangping'),
}
const DeliverytGood: AnchorsItem = {
  key: 'DeliveryMaterial',
  name: translate('web.resource.commodity.songhuoshangping'),
}
const Circulation: AnchorsItem = {
  key: 'Circulation',
  name: translate('web.common.liuzhuangjindu'),
}

const DeliveryNoticeCirculation: AnchorsItem = {
  key: 'Circulation',
  name: translate('web.resource.commodity.songhuotongzhidanwaibuliuzhuang'),
}

const ExternalDeliveryPlanCirculation: AnchorsItem = {
  key: 'ExternalDeliveryPlanCirculation',
  name: translate('web.resource.commodity.songhuojihuawaibuliuzhuang'),
}

const PlanMaterial: AnchorsItem = {
  key: 'PlanMaterial',
  name: translate('web.resource.commodity.jihuasonghuowuliao'),
}

const PlanGood: AnchorsItem = {
  key: 'PlanGood',
  name: translate('web.resource.commodity.jihuasonghuoshangping'),
  len: 0,
}

const PlannedDelivery: AnchorsItem = {
  key: 'PlannedDelivery',
  name: translate('web.resource.commodity.jihuasonghuoshangping'),
  len: 0,
}

const DeliveryGood: AnchorsItem = {
  key: 'DeliveryGood',
  name: translate('web.resource.commodity.songhuoshangping'),
}

const ExternalRoamRecord: AnchorsItem = {
  key: 'ExternalDocumentFlowRecord',
  name: translate('web.common.liuzhuangjilu'),
}

const Remarks: AnchorsItem = {
  key: 'Remarks',
  name: translate('web.common.remark'),
}
const DeliveryNoteQuery: AnchorsItem[] = [BillsInfo, Harvest, DeliveryInfo, LogisticsInfo]

const DeliveryPlanDetails: AnchorsItem[] = [Circulation, BaseInfo, PlannedDelivery, PlanGood, ExternalRoamRecord]

const DeliveryPlanAwaitDetails: AnchorsItem[] = [Circulation, BaseInfo, PlannedDelivery, Remarks, ExternalRoamRecord]

const DeliveryPlanCollaborationAnchors: AnchorsItem[] = [
  Circulation,
  BaseInfo,
  PlannedDelivery,
  PlanGood,
  ExternalRoamRecord,
]

// deliveryNoticeManagement -> deliveryNoticeDetaitls
const DeliveryNoticeDetaitlsAnchors: AnchorsItem[] = [
  Circulation,
  BaseInfo,
  ShippingInfo,
  // Material,
]

const B2BDeliveryNoticeDetaitlsAnchors: AnchorsItem[] = [
  Circulation,
  BaseInfo,
  ShippingInfo,
  // DeliveryGood,
]

//  deliveryNoticeManagement -> deliveryNoticeAwaitSRM
//  deliveryNoticeManagement -> deliveryNoticeAwaitB2B
const DeliveryNoticeAwaitAnchors: AnchorsItem[] = [
  Circulation,
  BaseInfo,
  ShippingInfo,
  DeliveryList,
  Remarks,
  ExternalRoamRecord,
]

export {
  BaseInfo,
  BillsInfo,
  DeliveryInfo,
  LogisticsInfo,
  Material,
  Distribution,
  Harvest,
  HarvestMaterial,
  DeliveryMaterial,
  Circulation,
  DeliveryNoticeCirculation,
  PlanMaterial,
  PlanGood,
  ExternalRoamRecord,
  DeliveryNoteQuery,
  DeliveryPlanDetails,
  DeliveryGood,
  DeliveryPlanAwaitDetails,
  Remarks,
  DeliveryPlanCollaborationAnchors,
  PlannedDelivery,
  DeliveryNoticeDetaitlsAnchors,
  B2BDeliveryNoticeDetaitlsAnchors,
  ShippingInfo,
  DeliveryList,
  DeliveryNoticeAwaitAnchors,
  ExternalDeliveryPlanCirculation,
  HarvestGood,
  DeliverytGood,
  DeliverInfo,
}
