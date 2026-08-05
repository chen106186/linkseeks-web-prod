import React, { Fragment, useMemo } from 'react'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import Layout, { IDataListProps } from './layout'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import { getOrderReportGetOrder, GetOrderReportGetOrderResponse } from '@apps/apis'
import useGetAuth from '../../hooks/useGetAuth'
interface Iprops {}

const { StaticsDataList } = Layout
const purchaseOrderUrl = '/orderAbility/purchaseOrder/orderList'
const saleOrderUrl = '/orderAbility/saleOrder/orderList'

const KEY_TITLE = {
  saleOrderList: getIntl().formatMessage({ id: 'home.orderCenter.saleOrderList' }),
  purchaseOrderList: getIntl().formatMessage({ id: 'home.orderCenter.purchaseOrderList' }),
  deliveryPlanList: getIntl().formatMessage({ id: 'home.songhuojihua', defaultMessage: '送货计划' }),
  deliveryPlanCollaborationList: getIntl().formatMessage({
    id: 'home.songhuojihuaxietong',
    defaultMessage: '送货计划协同',
  }),
  deliveryNoticeList: getIntl().formatMessage({ id: 'home.songhuotongzhi', defaultMessage: '送货通知' }),
  deliveryNoticeCollaborationList: getIntl().formatMessage({
    id: 'home.songhuotongzhixietong',
    defaultMessage: '送货通知协同',
  }),
  receiptList: getIntl().formatMessage({ id: 'home.shouhuodan', defaultMessage: '收货单' }),
}

// 订单中心：根据当前用户+当前角色是否有订单能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 进入订单中心：当前会员角色类型为服务消费则点击进入订单能力-采购订单--订单查询页，如果当前会员角色类型为服务提供则点击进入订单能力-销售订单--订单查询页

const OrderCenter: React.FC<Iprops> = () => {
  const { loading, responseData, filterEmptyList, isError, ref } = useViewRequest<GetOrderReportGetOrderResponse, any>(
    getOrderReportGetOrder as any,
  )
  const intl = useIntl()
  const { hasAbilityFunc, isConsumer } = useGetAuth()
  const hasAbility = hasAbilityFunc('orderAbility')
  const orderCenterUrl = isConsumer ? purchaseOrderUrl : saleOrderUrl

  return (
    <Layout
      viewRef={ref}
      hasAuth={hasAbility}
      title={intl.formatMessage({ id: 'home.orderCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.orderCenter.layoutTips' })}
      extra={
        <Authorize url={orderCenterUrl}>
          <div>
            <Link to={orderCenterUrl}>{intl.formatMessage({ id: 'home.orderCenter.authorize.url' })}</Link>
          </div>
        </Authorize>
      }
      loading={loading}
      isError={isError}
    >
      <StaticsDataList title={KEY_TITLE} dataSource={filterEmptyList as unknown as IDataListProps['dataSource']} />
    </Layout>
  )
}

export default OrderCenter
