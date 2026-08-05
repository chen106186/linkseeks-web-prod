import dayjs from 'dayjs'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()

const translate = getWebIntl()
/**
 *  订单模块 Table Column 分离 （国际化统一配置）
 * @author: 莫雷
 */
export const CommodityIdColumn: any = {
  title: translate('web.resource.commodity.ID'),
  dataIndex: 'skuId',
  key: 'skuId',
  // align: 'center',
}

export const CommodityNoColumn: any = {
  title: translate('web.resource.commodity.No'),
  // align: 'center',
}

export const TradeNameColumn: any = {
  title: translate('web.resource.commodity.name'),
  dataIndex: 'productName',
  key: 'productName',
  // align: 'center',
}

export const MaterialNoColumn: any = {
  title: translate('web.resource.commodity.wuliaobianhao'),
  dataIndex: 'skuId',
  key: 'skuId',
  // align: 'center',
}

export const MaterialNameColumn: any = {
  title: translate('web.resource.commodity.wuliaomingcheng'),
  dataIndex: 'productName',
  key: 'productName',
  // align: 'center',
}

export const MaterialModelColumn: any = {
  title: translate('web.resource.commodity.guigexinghao'),
  dataIndex: 'spec',
  key: 'spec',
  // align: 'center',
}

export const ClassColumn: any = {
  title: translate('web.resource.commodity.category'),
  dataIndex: 'category',
  key: 'category',
  // align: 'center',
}

export const BrandColumn: any = {
  title: translate('web.resource.commodity.brand'),
  dataIndex: 'brand',
  key: 'brand',
  // align: 'center',
}

export const UntilColumn: any = {
  title: translate('web.common.unit'),
  dataIndex: 'unit',
  key: 'unit',
  // align: 'center',
}

export const OrderNoColumn: any = {
  title: translate('web.resource.order.orderNo'),
  dataIndex: 'orderNo',
  key: 'orderNo',
  // align: 'center',
}

export const OrderSummaryColumn: any = {
  title: translate('web.resource.order.dingdanzhaiyao'),
  // align: 'center',
}

export const OrderCreatedAtColumn: any = {
  title: translate('web.resource.order.xiadanshijian'),
  // align: 'center',
  render: (txt, rcoed) => dayjs(rcoed.createTime).format('YYYY-MM-DD HH:mm:ss'),
}

export const ReceivingAddressColumn: any = {
  title: translate('web.resource.logistics.shouhuodizhi'),
  // align: 'center',
}

export const OrderNumColumn: any = {
  title: translate('web.resource.logistics.daisonghuoshuliang'),
  dataIndex: 'purchaseCount',
  key: 'purchaseCount',
  // align: 'center',
}

export const OrderCountColumn: any = {
  title: translate('web.resource.order.dingdanshuliang'),
  dataIndex: 'purchaseCount',
  key: 'purchaseCount',
  // align: 'center',
}

export const DeliveryNumColumn: any = {
  title: translate('web.resource.logistics.songhuoshuliang'),
  // width: 100,
  dataIndex: 'deliveryCount',
  key: 'deliveryCount',
}

export const ConsigneeNumColumn: any = {
  title: translate('web.resource.logistics.shouhuoshuliang'),
  // align: 'center',
  dataIndex: 'receiveCount',
  key: 'receiveCount',
}

export const TransitNumColumn: any = {
  title: translate('web.resource.logistics.zaitushuliang'),
  // align: 'center',
  render: (txt) => txt,
}

export const DeliveredNumColumn: any = {
  title: translate('web.resource.logistics.daisonghuoshuliang'),
  // align: 'center',
}

export const PlannedDeliveryNumColumn: any = {
  title: translate('web.resource.logistics.jihuasonghuoshuliang'),
  // align: 'center',
}

export const FlowOnColumn: any = {
  title: translate('web.common.sortIndex'),
  // align: 'center',
}

export const FlowRoleColumn: any = {
  title: translate('web.common.controlRole'),
  // align: 'center',
}

export const FlowStatusColumn = {
  title: translate('web.common.status'),
  // align: 'center',
}

export const FlowOptionsColumn: any = {
  title: translate('web.common.control'),
  // align: 'center',
}

export const FlowOptionsTimeColumn: any = {
  title: translate('web.common.controlTime'),
  // align: 'center',
}

export const FlowNoteColumn: any = {
  title: translate('web.common.shenheyijian'),
  // align: 'center',
}

export const PlanNumberColumn: any = {
  title: translate('web.resource.order.jihuabianhao'),
  // align: 'center',
}

export const PlanSummaryColumn: any = {
  title: translate('web.resource.order.jihuazhaiyao'),
  // align: 'center',
}

export const PlannedStartDateColumn: any = {
  title: translate('web.resource.order.jihuakaishiriqi'),
  // align: 'center',
}

export const PlannedEndDateColumn: any = {
  title: translate('web.resource.order.jihuajieshuriqi'),
  // align: 'center',
}

export const SupplyMemberColumn: any = {
  title: translate('web.resource.member.gongyinghuiyuan'),
  // align: 'center',
}

export const PurchasingMemberColumn: any = {
  title: translate('web.resource.order.caigouhuiyuan'),
  // align: 'center',
}

export const ExternalStateColumn: any = {
  title: translate('web.common.waibuzhuangtai'),
  // align: 'center',
}

export const OperationColumn: any = {
  title: translate('web.common.control'),
  // align: 'center',
}

export const OrderProductPositionVOSColumn: any = {
  title: intl.formatMessage({ id: 'order.orderProductPosition' }),
  dataIndex: 'orderProductPositionVOS',
  key: 'orderProductPositionVOS',
  render: (text) => (
    <>
      {text?.length > 0
        ? text?.map((item) => (
            <div>
              {item.positionName}:{item?.positionQuantity ?? 0}
            </div>
          ))
        : '--'}
    </>
  ),
}

export const OccupyInventoryVOSColumn: any = {
  title: (
    <Tooltip title={intl.formatMessage({ id: 'stockSellStorage.occupiedInventory.tooltips' })}>
      {intl.formatMessage({ id: 'stockSellStorage.occupiedInventory' })}
      <QuestionCircleOutlined style={{ color: '#909399', marginLeft: 5 }} />
    </Tooltip>
  ),
  dataIndex: 'occupyInventoryVOS',
  key: 'occupyInventoryVOS',
  render: (text) => (
    <>
      {text?.length > 0
        ? text?.map((item) => (
            <div>
              {item.positionName}:{item?.positionQuantity ?? 0}
            </div>
          ))
        : '--'}
    </>
  ),
}

export const AvailableForDeliveryQuantityColumn: any = {
  title: (
    <Tooltip title={intl.formatMessage({ id: 'stockSellStorage.availableForDeliveryQuantity.tooltips' })}>
      {intl.formatMessage({ id: 'stockSellStorage.availableForDeliveryQuantity' })}
      <QuestionCircleOutlined style={{ color: '#909399', marginLeft: 5 }} />
    </Tooltip>
  ),
  dataIndex: 'availableForDeliveryQuantity',
  key: 'availableForDeliveryQuantity',
}

export const PurchaseCountColumn: any = {
  title: translate('web.resource.order.dingdanshuliang'),
  dataIndex: 'purchaseCount',
  key: 'purchaseCount',
}

export const ResidueDeliveryNumColumn: any = {
  title: translate('web.resource.logistics.daisonghuoshuliang'),
  // align: 'center',
  dataIndex: 'deliveryCount',
  key: 'deliveryCount',
}

export const BatchJudgmentTypeColumn: any = {
  title: translate('web.resource.order.picipanding'),
  // align: 'center',
}

export const AcceptanceCountColumn: any = {
  title: translate('web.resource.order.yunshoushuliang'),
  // align: 'center',
}

export const ConcessionToReceiveCountColumn: any = {
  title: translate('web.resource.order.rangbujieshoushuliang'),
  // align: 'center',
}

export const RejectCountColumn: any = {
  title: translate('web.resource.order.jushoushuliang'),
  // align: 'center',
}
