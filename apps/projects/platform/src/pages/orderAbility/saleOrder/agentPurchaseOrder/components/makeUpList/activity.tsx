import React, { useState, useRef, useEffect } from 'react'
import { Spin, Input, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { UnorderedListOutlined, AppstoreOutlined, FileTextOutlined } from '@ant-design/icons'
import cx from 'classnames'
import SearchNoResult from '../SearchNoResult'
import SearchIcon from '@/assets/icons/searchIcon.png'
import { postMarketingWebActivityGoodsRelationGoodsList } from '@apps/apis'
import { postProductShopPurchaseSaveOrUpdatePurchase } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import useAgentInfo from '../../hooks/useAgentInfo'
import { COMMODITY_SHOW_TYPE, DEFAULT_CITY } from '../../constants'
import { PageHeaderWrapper } from '@apps/components'
import usePurchaseOrder from '../../hooks/usePurchaseOrder'
import ProductList from '../ProductList'
import { CouponCommodityItemType } from '../ProductList/types'
import { LAYOUT_TYPE } from '@/constants'

interface ActivityParamType {
  activityId: number
  belongType: number
  skuId: number
}

const ActivityMakeUpList: React.FC = (props: any) => {
  const intl = useIntl()
  // const { id } = props.match?.params || {}
  const { id, belongType, skuId } = useQuery()
  const [loading, setLoading] = useState<boolean>(true)
  const [showType, setShowType] = useState<COMMODITY_SHOW_TYPE>(COMMODITY_SHOW_TYPE.gird) // 展示方式：1：矩阵排列； 2:列表排列
  const [commodityList, setCommodityList] = useState<CouponCommodityItemType[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [activityInfo, setActivityInfo] = useState<ActivityParamType>()
  const [searchProductName, setSearchProductName] = useState<string>()
  const clickFlag = useRef<boolean>(true)
  const { agentPurchaseOrderInfo } = useAgentInfo({ check: true })
  const { purchaseCount, saveOrUpdatePurchase } = usePurchaseOrder({
    orderId: agentPurchaseOrderInfo?.orderId,
    mallId: agentPurchaseOrderInfo?.shopId,
    customerMemberId: agentPurchaseOrderInfo?.memberId,
    customerMemberRoleId: agentPurchaseOrderInfo?.roleId,
    customerMemberLevel: agentPurchaseOrderInfo?.memberLevel,
  })
  const mallId = agentPurchaseOrderInfo?.shopId
  const currentCity = DEFAULT_CITY

  useEffect(() => {
    const paramBelongType = belongType
    const paramSkuId = skuId
    if (paramBelongType && paramSkuId && id) {
      setActivityInfo({
        activityId: Number(id),
        belongType: Number(paramBelongType),
        skuId: Number(paramSkuId),
      })
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCommodityList = () => {
    const param: any = {
      shopId: mallId,
      activityId: activityInfo?.activityId,
      belongType: activityInfo?.belongType,
      skuId: activityInfo?.skuId,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }

    if (searchProductName) {
      param.productName = searchProductName
    }

    setLoading(true)
    postMarketingWebActivityGoodsRelationGoodsList(param)
      .then((res) => {
        message.destroy()
        if (res.code === 1000 && res.data) {
          setCommodityList(res.data.commodityList || [])
          setTotalCount(res.data.commodityList.length)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (activityInfo) {
      fetchCommodityList()
    }
  }, [activityInfo])

  const handleAddPurchase = async (itemInfo: CouponCommodityItemType) => {
    if (clickFlag.current) {
      clickFlag.current = false
      const res = await saveOrUpdatePurchase({ skuId: itemInfo.skuId })
      if (res) {
        clickFlag.current = true
      } else {
        clickFlag.current = true
      }
    }
  }

  const handleSearch = () => {
    fetchCommodityList()
  }

  return (
    <PageHeaderWrapper
      extra={
        <div
          className={cx(styles.shopping_cart)}
          onClick={() => history.push('/orderAbility/saleOrder/agentPurchaseOrder/purchaseOrder')}
        >
          <FileTextOutlined className={styles.card_icon} translate={undefined} />
          <span>{intl.formatMessage({ id: 'index.Header.PurchaseOrder' })}</span>
          <div className={styles.badge}>{purchaseCount}</div>
        </div>
      }
    >
      <div className={styles.commodity}>
        <div className={styles.mall_container}>
          <div className={styles.commodity_container}>
            <div className={styles.commodity_main}>
              <div className={styles.tool_bar_wrap}>
                <div className={styles.tool_bar}>
                  <div className={styles.tool_bar_left}>
                    <div className={cx(styles.tool_bar_filter_item, styles.no_right_border)} style={{ paddingLeft: 8 }}>
                      <div className={styles.tool_bar_search}>
                        <Input
                          value={searchProductName}
                          onChange={(e) => setSearchProductName(e.target.value)}
                          className={styles.tool_bar_search_input}
                          onPressEnter={handleSearch}
                        />
                        <div className={styles.tool_bar_search_btn}>
                          <img src={SearchIcon} className={styles.tool_bar_search_btn_icon} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.tool_bar_right}>
                    <div className={styles.count}>
                      <span>{intl.formatMessage({ id: 'pay.pointsMall.common' })}</span>
                      <label>{totalCount}</label>
                      <span>{intl.formatMessage({ id: 'pay.pointsMall.Items' })}</span>
                    </div>
                    <div className={styles.showTypeBox}>
                      <AppstoreOutlined
                        translate={undefined}
                        className={cx(styles.icon, showType === COMMODITY_SHOW_TYPE.gird ? styles.active : '')}
                        onClick={() => setShowType(COMMODITY_SHOW_TYPE.gird)}
                      />
                    </div>
                    <div className={styles.showTypeBox}>
                      <UnorderedListOutlined
                        translate={undefined}
                        className={cx(styles.icon, showType === COMMODITY_SHOW_TYPE.list ? styles.active : '')}
                        onClick={() => setShowType(COMMODITY_SHOW_TYPE.list)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {(commodityList.length === 0 || !commodityList) && !loading ? (
                <SearchNoResult search="" />
              ) : (
                <>
                  <Spin spinning={loading}>
                    <ProductList
                      dataSource={commodityList}
                      layoutType={LAYOUT_TYPE.makeUpList}
                      type={showType}
                      isStore={false}
                      paramType="search"
                      jumpType="history"
                      path="/orderAbility/saleOrder/agentPurchaseOrder/commodityDetail"
                      onItemClick={(info) => handleAddPurchase(info)}
                    />
                  </Spin>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageHeaderWrapper>
  )
}

export default ActivityMakeUpList
