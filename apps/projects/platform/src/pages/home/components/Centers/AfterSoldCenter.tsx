import React, { useCallback } from 'react'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import { getAftersalesReportGetAfterSales, GetAftersalesReportGetAfterSalesResponse } from '@apps/apis'
import Layout, { IDataListProps } from './layout'
import useGetAuth from '../../hooks/useGetAuth'

interface Iprops {}

const KEY_TITLE = {
  repairApplyList: getIntl().formatMessage({ id: 'home.afterSoldCenter.repairApplyList' }),
  repairHandleList: getIntl().formatMessage({ id: 'home.afterSoldCenter.repairHandleList' }),
  replaceApplyList: getIntl().formatMessage({ id: 'home.afterSoldCenter.replaceApplyList' }),
  replaceHandleList: getIntl().formatMessage({ id: 'home.afterSoldCenter.replaceHandleList' }),
  returnApplyList: getIntl().formatMessage({ id: 'home.afterSoldCenter.returnApplyList' }),
  returnHandleList: getIntl().formatMessage({ id: 'home.afterSoldCenter.returnHandleList' }),
}
const EXCHANGE_APPLICATION = `/afterAbility/exchangeApplication/exchangeQuery`
const EXCHANGE_HANDLE = '/afterAbility/exchangeManage/exchangeQuery'

// 售后中心：根据当前用户+当前角色是否有此售后能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 进入售后中心：当前会员角色类型为服务消费则点击进入售后能力-售后换货申请--换货申请单查询页，如果当前会员角色类型为服务提供则点击进入售后能力-售后换货处理--换货申请单查询页

const AfterSoldCenter: React.FC<Iprops> = () => {
  const intl = useIntl()
  const { loading, responseData, ref, filterEmptyList, isError } = useViewRequest<
    GetAftersalesReportGetAfterSalesResponse,
    any
  >(getAftersalesReportGetAfterSales as any, {})
  const { hasAbilityFunc, isConsumer } = useGetAuth()
  const hasAbility = hasAbilityFunc('afterService')
  const url = isConsumer ? EXCHANGE_APPLICATION : EXCHANGE_HANDLE

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.afterSoldCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.afterSoldCenter.layoutTips' })}
      extra={
        <Authorize url={url}>
          <div>
            <Link to={url}>{intl.formatMessage({ id: 'home.afterSoldCenter.authorize.url' })}</Link>
          </div>
        </Authorize>
      }
      loading={loading}
      isError={isError}
    >
      <Layout.StaticsDataList
        title={KEY_TITLE}
        dataSource={filterEmptyList as unknown as IDataListProps['dataSource']}
      />
    </Layout>
  )
}

export default AfterSoldCenter
