import React, { useState, useRef, useEffect } from 'react'
import { Spin, Input, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { UnorderedListOutlined, AppstoreOutlined, FileTextOutlined } from '@ant-design/icons'
import cx from 'classnames'
import SearchNoResult from '../SearchNoResult'
import SearchIcon from '@/assets/icons/searchIcon.png'
import { postMarketingWebCouponGoodsList } from '@apps/apis'
import { postProductShopMroGetCommodityList } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import useAgentInfo from '../../hooks/useAgentInfo'
import { COMMODITY_SHOW_TYPE, DEFAULT_CITY } from '../../constants'
import { PageHeaderWrapper } from '@apps/components'
import usePurchaseOrder from '../../hooks/usePurchaseOrder'
import { CouponCommodityItemType } from '../ProductList/types'
import ProductList from '../ProductList'
import { LAYOUT_TYPE } from '@/constants'

interface CouponParamType {
  couponId: number
  belongType: number
}

/**
 * 兼容转化处理两个获取商品接口返回字段不一样的情况
 */
function transformCommondityList(list: any[]) {
  return list.map((item) => ({
    ...item,
    productId: item.id,
    productName: item.name,
    price: item.preferentialPrice,
  }))
}

const makeUpList: React.FC = (props: any) => {
  const intl = useIntl()
  const { id, belongType, skuId } = useQuery()
  const [loading, setLoading] = useState<boolean>(true)
  const [showType, setShowType] = useState<COMMODITY_SHOW_TYPE>(COMMODITY_SHOW_TYPE.gird) // 展示方式：1：矩阵排列； 2:列表排列
  const [commodityList, setCommodityList] = useState<CouponCommodityItemType[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [couponInfo, setCouponInfo] = useState<CouponParamType>()
  const [searchProductName, setSearchProductName] = useState<string>()
  const clickFlag = useRef<boolean>(true)
  const { agentPurchaseOrderInfo } = useAgentInfo({ check: true })
  const { purchaseCount, saveOrUpdatePurchase } = usePurchaseOrder({
    mallId: agentPurchaseOrderInfo?.shopId,
    customerMemberId: agentPurchaseOrderInfo?.memberId,
    customerMemberRoleId: agentPurchaseOrderInfo?.roleId,
    customerMemberLevel: agentPurchaseOrderInfo?.memberLevel,
  })
  const mallId = agentPurchaseOrderInfo?.shopId
  const currentCity = DEFAULT_CITY

  // 是否是平台通用卷
  const isCommonCoupons = couponInfo?.belongType == 1

  useEffect(() => {
    const paramCelongType = belongType
    if (paramCelongType && id) {
      setCouponInfo({
        couponId: Number(id),
        belongType: Number(paramCelongType),
      })
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCommodityList = () => {
    // fix: 当平台通用卷时，更改调用方法
    // 对具体业务不清晰，还需观察是否正确
    // http://chandao.shushangyun.com/index.php?m=bug&f=view&bugID=21548
    const param: any = isCommonCoupons
      ? {
          shopId: mallId,
          couponId: couponInfo?.couponId,
          belongType: couponInfo?.belongType,
          provinceCode: currentCity?.provinceCode,
          cityCode: currentCity?.cityCode,
          priceTypeList: [1],
          pageSize: 10,
          current: 1,
        }
      : {
          shopId: mallId,
          couponId: couponInfo?.couponId,
          belongType: couponInfo?.belongType,
          provinceCode: currentCity?.provinceCode,
          cityCode: currentCity?.cityCode,
          pageSize: 10,
          current: 1,
        }

    if (searchProductName) {
      param[isCommonCoupons ? 'name' : 'productName'] = searchProductName
    }

    setLoading(true)
    const fn = isCommonCoupons ? postProductShopMroGetCommodityList : postMarketingWebCouponGoodsList
    fn(param, {
      headers: {
        shopId: String(mallId),
      },
    })
      .then((res) => {
        message.destroy()
        if (res.code === 1000) {
          if (isCommonCoupons) {
            setCommodityList(transformCommondityList(res.data.data) as CouponCommodityItemType[])
            setTotalCount(res.data.totalCount)
          } else {
            setCommodityList(res.data as CouponCommodityItemType[])
            setTotalCount(res.data.length)
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (couponInfo) {
      fetchCommodityList()
    }
  }, [couponInfo])

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
                      layoutType={isCommonCoupons ? LAYOUT_TYPE.activityMakeUpList : LAYOUT_TYPE.makeUpList}
                      type={showType}
                      jumpType="history"
                      onItemClick={(info) => handleAddPurchase(info)}
                      isMro={false}
                      isStore={false}
                      paramType="search"
                      path="/orderAbility/saleOrder/agentPurchaseOrder/commodityDetail"
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

export default makeUpList
