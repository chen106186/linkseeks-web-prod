import React, { useEffect, useMemo, useState } from 'react'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import logistics from '@/assets/imgs/logistics.png'
import logistics_form from '@/assets/imgs/logistics_form.png'
import logistics_address from '@/assets/imgs/logistics_address.png'
import logistics_cost from '@/assets/imgs/logistics_cost.png'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import Layout from './layout'
import { getLogisticsReportGetLogistics, GetLogisticsReportGetLogisticsResponse } from '@apps/apis'
import useGetAuth from '../../hooks/useGetAuth'
import { getCommodityWebMemberLogisticsWebFindCurrMemberLogistics } from '@apps/apis'

interface Iprops {}

const url = '/logisticsAbility/logisticsResult/orderResultSearchList'
const CREATE_INFO_MANAGE = '/logisticsAbility/infoManage'

// 物流中心：根据当前用户+当前角色是否有此物流能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 如果当前用户有创建物流公司门户权限，但还未创建物流公司门户，则显示：您还没有创建物流公司门户，请先创建物流公司门户，点击创建物流公司门户按钮，跳转物流能力-物流公司门户管理-创建物流公司门户页
// 1、物流派单：判断当前用户是否有待提交物流单权限，有则显示物流派单按钮与图标，点击跳转物流能力-物流单提交-待提交物流单，角标显示待提交状态的物流单单数
// 2、接单报价：判断当前用户是否有待确认物流单权限，有则显示待确认物流单按钮与图标，点击跳转物流能力-物流单处理-待确认物流单，角标显示待确认状态的物流单单数
// 3、发货地址管理：判断当前用户是否有发货地址管理权限，有则显示发货地址管理按钮与图标，点击跳转物流能力-物流管理-发货地址管理
// 4、收货地址管理：判断当前用户是否有收货地址管理权限，有则显示收货地址管理按钮与图标，点击跳转物流能力-物流管理-收货地址管理
// 5、运费模板管理：判断当前用户是否有运费模板管理权限，有则显示运费模板管理按钮与图标，点击跳转物流能力-物流管理-运费模板管理
const LogisticsCenter: React.FC<Iprops> = (props: Iprops) => {
  const { loading, responseData, ref, inViewPort } = useViewRequest<GetLogisticsReportGetLogisticsResponse, any>(
    getLogisticsReportGetLogistics as any,
    {},
  )
  const intl = useIntl()
  const { hasAbilityFunc, userAuth, authUrlList } = useGetAuth()
  const hasAbility = hasAbilityFunc('logisticsAbility')
  const [isShow, setIsShow] = useState(false)
  const [hasFetchData, setHasFetchData] = useState(false)

  useEffect(() => {
    const hasCreateInfoManageAuth = authUrlList?.includes(CREATE_INFO_MANAGE)
    if (!inViewPort || !hasCreateInfoManageAuth || hasFetchData) {
      return
    }
    async function getManagerData() {
      setHasFetchData(true)
      const { data, code } = await getCommodityWebMemberLogisticsWebFindCurrMemberLogistics({
        memberId: userAuth.memberId,
        roleId: userAuth.memberRoleId,
      } as any)
      if (code === 1000) {
        setIsShow(data === null)
      }
    }
    getManagerData()
  }, [inViewPort, userAuth, hasFetchData])

  const tagsList = useMemo(() => {
    const list = [
      {
        icon: logistics,
        title: intl.formatMessage({ id: 'home.logisticsCenter.title1', defaultMessage: '物流派单' }),
        url: '/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill',
        count: responseData?.logisticsList[0]?.count,
      },
      {
        icon: logistics_form,
        title: intl.formatMessage({ id: 'home.logisticsCenter.title2', defaultMessage: '接单报价' }),
        url: '/logisticsAbility/logisticsBillManage/waitConfirmLogisticsBill',
        count: responseData?.logisticsList[1]?.count,
      },
      {
        icon: logistics_address,
        title: intl.formatMessage({ id: 'home.logisticsCenter.title3', defaultMessage: '收货地址管理' }),
        url: '/logisticsAbility/logisticsAdminister/receivingAddress',
      },
      {
        icon: logistics_address,
        title: intl.formatMessage({ id: 'home.logisticsCenter.title4', defaultMessage: '发货地址管理' }),
        url: '/logisticsAbility/logisticsAdminister/shipmentsAddress',
      },
      {
        icon: logistics_cost,
        title: intl.formatMessage({ id: 'home.logisticsCenter.title5', defaultMessage: '运费模板' }),
        url: '/logisticsAbility/logisticsAdminister/freightTemplate',
      },
    ].filter((_item) => authUrlList?.includes(_item.url))
    return list
  }, [userAuth, responseData])

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.logisticsCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.logisticsCenter.layoutTips' })}
      extra={
        <Authorize url={url}>
          <div>
            <Link to={url}>{intl.formatMessage({ id: 'home.logisticsCenter.authorize.url' })}</Link>
          </div>
        </Authorize>
      }
      loading={loading}
    >
      {isShow && (
        <Layout.AlertTip
          content={intl.formatMessage({ id: 'home.logisticsCenter.alertTip' })}
          url={CREATE_INFO_MANAGE}
        />
      )}

      <Layout.Tag tagList={tagsList} />
    </Layout>
  )
}

export default LogisticsCenter
