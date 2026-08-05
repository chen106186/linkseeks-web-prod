import React, { useCallback, useMemo } from 'react'
import { Space } from 'antd'
import styles from './center.less'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import Layout from './layout'
import useGetAuth from '../../hooks/useGetAuth'
// import { getReportMemberHomeGetMarketingReport, GetReportMemberHomeGetMarketingReportResponse } from '@apps/apis'

interface Iprops {}

// TODO
const MarketingCenter: React.FC<Iprops> = () => {
  const { loading, filterEmptyList, isError, ref } = useViewRequest<any, any>(() => {}, {})
  const intl = useIntl()
  const { userAuth, hasAbilityFunc } = useGetAuth()
  const hasAbility = hasAbilityFunc('marketingAbility')
  const { StaticsDataList } = Layout
  const KEY_TITLE = {
    marketingMerchantList: intl.formatMessage({
      id: 'home.shangjiayingxiaohuodongguanli',
      defaultMessage: '商家营销活动管理',
    }),
    marketingPlatformList: intl.formatMessage({ id: 'home.pingtaiyingxiaohuodong', defaultMessage: '平台营销活动' }),
    marketingMerchantCouponList: intl.formatMessage({
      id: 'home.shangjiayouhuiquanguanli',
      defaultMessage: '商家优惠券管理',
    }),
  }

  return (
    <Layout
      hasAuth={hasAbility}
      viewRef={ref}
      title={intl.formatMessage({ id: 'home.yingxiaozhongxin', defaultMessage: '营销中心' })}
      tips={intl.formatMessage({ id: 'home.tigonghuodongyouhuiquan', defaultMessage: '提供活动、优惠券管理等功能。' })}
      loading={loading}
      isError={isError}
      extra={
        <Space>
          <Authorize url={'/marketingAbility'}>
            <div>
              <Link to={'/marketingAbility'}>
                {intl.formatMessage({ id: 'home.jinruyingxiaozhongxin', defaultMessage: '进入营销中心' })}
              </Link>
            </div>
          </Authorize>
        </Space>
      }
    >
      <StaticsDataList title={KEY_TITLE} dataSource={filterEmptyList} />
    </Layout>
  )
}

export default MarketingCenter
