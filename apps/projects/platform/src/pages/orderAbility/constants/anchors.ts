import { tabLink } from '@apps/components/src/web/PageHeaderWrapper'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const BaseInfo: tabLink = {
  key: 'BaseInfo',
  label: translate('web.common.jibenxinxi'),
}

const BillsInfo: tabLink = {
  key: 'BillsInfo',
  label: translate('web.resource.commodity.danjuxinxi'),
}

const Distribution: tabLink = {
  key: 'Distribution',
  label: translate('web.resource.logistics.songhuoxinxi'),
}

const DeliveryInfo: tabLink = {
  key: 'DeliveryInfo',
  label: translate('web.resource.logistics.fahuoxinxi'),
}

const LogisticsInfo: tabLink = {
  key: 'LogisticsInfo',
  label: translate('web.resource.logistics.wuliuxinxi'),
}

const Material: tabLink = {
  key: 'Material',
  label: translate('web.resource.commodity.songhuowuliao'),
}

const ShippingInfo: tabLink = {
  key: 'ShippingInfo',
  label: translate('web.resource.logistics.songhuoxinxi'),
}

const DeliveryList: tabLink = {
  key: 'DeliveryList',
  label: translate('web.resource.commodity.songhuoliebiao'),
}

const Harvest: tabLink = {
  key: 'Harvest',
  label: translate('web.resource.logistics.shouhuoxinxi'),
}

const HarvestMaterial: tabLink = {
  key: 'HarvestMaterial',
  label: translate('web.resource.commodity.shouhuowuliao'),
}
const DeliveryMaterial: tabLink = {
  key: 'DeliveryMaterial',
  label: translate('web.resource.commodity.songhuowuliao'),
}

const HarvestGood: tabLink = {
  key: 'HarvestMaterial',
  label: translate('web.resource.commodity.shouhuoshangping'),
}
const DeliverytGood: tabLink = {
  key: 'DeliveryMaterial',
  label: translate('web.resource.commodity.songhuoshangping'),
}
const Circulation: tabLink = {
  key: 'Circulation',
  label: translate('web.common.liuzhuangjindu'),
}

const DeliveryNoticeCirculation: tabLink = {
  key: 'Circulation',
  label: translate('web.resource.commodity.songhuotongzhidanwaibuliuzhuang'),
}

const ExternalDeliveryPlanCirculation: tabLink = {
  key: 'ExternalDeliveryPlanCirculation',
  label: translate('web.resource.commodity.songhuojihuawaibuliuzhuang'),
}

const PlanMaterial: tabLink = {
  key: 'PlanMaterial',
  label: translate('web.resource.commodity.jihuasonghuowuliao'),
}

const PlanGood: tabLink = {
  key: 'PlanGood',
  label: translate('web.resource.commodity.jihuasonghuoshangping'),
  len: 0,
}

const PlannedDelivery: tabLink = {
  key: 'PlannedDelivery',
  label: translate('web.resource.commodity.jihuasonghuoshangping'),
  len: 0,
}

const DeliveryGood: tabLink = {
  key: 'DeliveryGood',
  label: translate('web.resource.commodity.songhuoshangping'),
}

const ExternalRoamRecord: tabLink = {
  key: 'ExternalDocumentFlowRecord',
  label: translate('web.common.liuzhuangjilu'),
}

const Remarks: tabLink = {
  key: 'Remarks',
  label: translate('web.common.remark'),
}

const AutoEnter: tabLink = {
  key: 'AutoEnter',
  label: translate('web.resource.commodity.zidongruku'),
}

const DeliveryNoteQuery: tabLink[] = [BillsInfo, Harvest, DeliveryInfo, LogisticsInfo]

const DeliveryPlanDetails: tabLink[] = [Circulation, BaseInfo, PlannedDelivery, PlanGood, ExternalRoamRecord]

const DeliveryPlanAwaitDetails: tabLink[] = [Circulation, BaseInfo, PlannedDelivery, Remarks, ExternalRoamRecord]

const DeliveryPlanCollaborationAnchors: tabLink[] = [
  Circulation,
  BaseInfo,
  PlannedDelivery,
  PlanGood,
  ExternalRoamRecord,
]

// deliveryNoticeManagement -> deliveryNoticeDetaitls
const DeliveryNoticeDetaitlsAnchors: tabLink[] = [
  Circulation,
  BaseInfo,
  ShippingInfo,
  // Material,
]

const B2BDeliveryNoticeDetaitlsAnchors: tabLink[] = [
  Circulation,
  BaseInfo,
  ShippingInfo,
  // DeliveryGood,
]

//  deliveryNoticeManagement -> deliveryNoticeAwaitSRM
//  deliveryNoticeManagement -> deliveryNoticeAwaitB2B
const DeliveryNoticeAwaitAnchors: tabLink[] = [
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
  AutoEnter,
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
}
