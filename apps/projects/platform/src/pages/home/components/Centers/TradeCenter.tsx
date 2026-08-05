import React, { useCallback } from 'react'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import Layout, { IDataListProps } from './layout'
import useGetAuth from '../../hooks/useGetAuth'
import { getMemberReportGetMember, GetMemberReportGetMemberResponse } from '@apps/apis'

interface Iprops {}

const KEY_TITLE = {
  commodityInquiryList: getIntl().formatMessage({ id: 'home.tradeCenter.commodityInquiryList' }),
  inquiryQuotationList: getIntl().formatMessage({ id: 'home.tradeCenter.inquiryQuotationList' }),
  confirmInquiryQuotationList: getIntl().formatMessage({ id: 'home.tradeCenter.confirmInquiryQuotationList' }),
  demandPublishList: getIntl().formatMessage({ id: 'home.tradeCenter.demandPublishList' }),
  demandQuotationList: getIntl().formatMessage({ id: 'home.tradeCenter.demandQuotationList' }),
  confirmDemandQuotationList: getIntl().formatMessage({ id: 'home.tradeCenter.confirmDemandQuotationList' }),
  saleOrderList: getIntl().formatMessage({ id: 'home.tradeCenter.saleOrderList' }),
  purchaseOrderList: getIntl().formatMessage({ id: 'home.tradeCenter.purchaseOrderList' }),
}

const productInquiry = '/dealAbility/productInquiry/inquirySearch'
const inquiryOffer = '/dealAbility/inquiryOffer/inquirySearch'
// 交易中心：根据当前用户+当前角色是否有交易能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 进入交易中心：当前会员角色类型为服务消费则点击进入交易能力-商品询价--询价单查询页，如果当前会员角色类型为服务提供则点击进入交易能力-询价报价--报价单查询页

const TradeCenter: React.FC<Iprops> = () => {
  const { loading, responseData, filterEmptyList, ref } = useViewRequest<GetMemberReportGetMemberResponse, any>(
    getMemberReportGetMember as any,
    {},
  )
  const intl = useIntl()
  const { hasAbilityFunc, isConsumer } = useGetAuth()
  const hasAbility = hasAbilityFunc('dealAbility')
  const url = isConsumer ? productInquiry : inquiryOffer

  return (
    <Layout
      viewRef={ref}
      hasAuth={hasAbility}
      title={intl.formatMessage({ id: 'home.tradeCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.tradeCenter.layoutTips' })}
      extra={
        <Authorize url={url}>
          <div>
            <Link to={url}>{intl.formatMessage({ id: 'home.tradeCenter.authorize.url' })}</Link>
          </div>
        </Authorize>
      }
      loading={loading}
    >
      <Layout.StaticsDataList
        title={KEY_TITLE}
        dataSource={filterEmptyList as unknown as IDataListProps['dataSource']}
      />
    </Layout>
  )
}

export default TradeCenter
