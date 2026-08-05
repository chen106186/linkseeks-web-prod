import React, { Fragment, useEffect, useMemo, useState } from 'react'
import styles from './center.less'
import { Link } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import Layout, { IDataListProps } from './layout'
import Authorize from '../Authorize'
import useViewRequest from '../../hooks/useViewRequest'
import { getPurchaseReportGetPurchase, GetPurchaseReportGetPurchaseResponse } from '@apps/apis'
import { BellOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import useGetAuth from '../../hooks/useGetAuth'
import { getCommodityWebMemberPurchaseWebFindCurrMemberPurchase } from '@apps/apis'
interface Iprops {}

const { StaticsDataList } = Layout
const consumerUrl = '/procurementAbility/purchaseInquiry/inquiry'
const providerUrl = '/procurementAbility/offter/offter'

const KEY_TITLE = {
  purchaseInquiryList: getIntl().formatMessage({ id: 'home.purchaseCenter.purchaseInquiryList' }),
  quotedPriceList: getIntl().formatMessage({ id: 'home.purchaseCenter.quotedPriceList' }),
  confirmQuotedPriceList: getIntl().formatMessage({ id: 'home.purchaseCenter.confirmQuotedPriceList' }),
  biddingList: getIntl().formatMessage({ id: 'home.purchaseCenter.biddingList' }),
  onlineBiddingList: getIntl().formatMessage({ id: 'home.purchaseCenter.onlineBiddingList' }),
  inviteTenderList: getIntl().formatMessage({ id: 'home.purchaseCenter.inviteTenderList' }),
  tenderList: getIntl().formatMessage({ id: 'home.purchaseCenter.tenderList' }),
  needPlanList: getIntl().formatMessage({ id: 'home.purchaseCenter.needPlanList' }),
  purchasePlanList: getIntl().formatMessage({ id: 'home.purchaseCenter.purchasePlanList' }),
  requisitionsList: getIntl().formatMessage({ id: 'home.qinggoudan', defaultMessage: '请购单' }),
  demandPoolList: getIntl().formatMessage({ id: 'home.xuqiuchi', defaultMessage: '需求池' }),
}
/** memberType 是否是企业会员或是企业个人会员 */
const isBusiness = [1, 2]
// 采购中心：根据当前用户+当前角色是否有采购能力菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 进入采购中心：当前会员角色类型为服务消费则点击进入采购能力-采购询价--采购需求单查询页，如果当前会员角色类型为服务提供则点击进入采购能力--报价--报价单查询页
// 如果当前用户有创建采购门户权限，但还未创建采购门户，则显示：您还没有创建采购门户，请先创建采购门户，点击创建采购门户按钮，跳转采购能力-采购门户管理-创建采购门户页

const PurchaseCenter: React.FC<Iprops> = () => {
  const { loading, responseData, filterEmptyList, isError, ref, inViewPort, refresh } = useViewRequest<
    GetPurchaseReportGetPurchaseResponse,
    any
  >(getPurchaseReportGetPurchase as any, {})
  const intl = useIntl()
  const { userAuth, hasAbilityFunc, isConsumer } = useGetAuth()
  const hasAbility = hasAbilityFunc('procurementAbility')
  /** 是否是消费者即服务消费者 有权限 */
  const hasPurchaseAuth = isBusiness.includes(userAuth.memberType) && isConsumer
  /** 是否有采购门户 */
  const [hasPurchase, setHasPurchase] = useState<boolean>(false)
  const [hasFetchData, setHasFetchData] = useState(false)

  useEffect(() => {
    if (!inViewPort || !hasPurchaseAuth || hasFetchData) {
      return
    }
    async function findCurrMemberPurchase() {
      const { data, code } = await getCommodityWebMemberPurchaseWebFindCurrMemberPurchase()
      setHasFetchData(true)
      if (code === 1000) {
        setHasPurchase(data?.id ? true : false)
      }
    }
    findCurrMemberPurchase()
  }, [inViewPort, hasPurchaseAuth, hasFetchData])

  const purchaseCenterUrl = useMemo(() => (isConsumer ? consumerUrl : providerUrl), [userAuth])

  return (
    <Layout
      viewRef={ref}
      hasAuth={hasAbility}
      title={intl.formatMessage({ id: 'home.purchaseCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.purchaseCenter.layoutTips' })}
      extra={
        <Authorize url={purchaseCenterUrl}>
          <div>
            <Link to={purchaseCenterUrl}>{intl.formatMessage({ id: 'home.purchaseCenter.authorize.url' })}</Link>
          </div>
        </Authorize>
      }
      loading={loading}
      isError={isError}
      onRefresh={refresh}
    >
      <Fragment>
        {hasPurchaseAuth && !hasPurchase && (
          <div className={styles.ding_tips}>
            <div>
              <BellOutlined />
              <span style={{ marginLeft: '12px' }}>{intl.formatMessage({ id: 'home.purchaseCenter.dingTips' })}</span>
            </div>
            <Link to={`/procurementAbility/purchasDoor/purchasInfo`}>
              <Button size="small" type="primary">
                {intl.formatMessage({ id: 'home.purchaseCenter.dingTips.button' })}
              </Button>
            </Link>
          </div>
        )}
        <StaticsDataList title={KEY_TITLE} dataSource={filterEmptyList as unknown as IDataListProps['dataSource']} />
      </Fragment>
    </Layout>
  )
}

export default PurchaseCenter
