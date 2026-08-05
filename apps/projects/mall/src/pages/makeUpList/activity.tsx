import React, { useState, useRef, useEffect } from 'react'
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons'
import { COMMODITY_SHOW_TYPE } from '@/constants'
import cx from 'classnames'
import { Spin, Input, message } from 'antd'
import SearchNoResult from '@/components/SearchNoResult'
import SearchIcon from '@/assets/icons/searchIcon.png'
import { postMarketingWebActivityGoodsRelationGoodsList, postProductShopPurchaseSaveOrUpdatePurchase } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { useLocation, useParams } from 'react-router-dom'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'
import { CouponCommodityItemType } from '@/components/ProductList/types'
import { getQueryString } from '@/utils/getUrlParam'
import { LAYOUT_TYPE } from '@/types/global'
import ProductList from '@/components/ProductList'
import HelmetProvider from '@/context/helmetProvider'
import styles from './index.module.less'

interface ActivityParamType {
  activityId: number
  belongType: number
  skuId: number
}

const ActivityMakeUpList: React.FC = () => {
  const translate = getWebIntl()
  const { mallInfo, userInfo, layoutType, currentCity } = useGlobalConext()
  const { updatePurchaseList } = usePurchaseOrderContext()
  const { id } = useParams()
  const { search } = useLocation()
  const [loading, setLoading] = useState<boolean>(true)
  const [showType, setShowType] = useState<COMMODITY_SHOW_TYPE>(COMMODITY_SHOW_TYPE.gird) // 展示方式：1：矩阵排列； 2:列表排列
  const [commodityList, setCommodityList] = useState<CouponCommodityItemType[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [activityInfo, setActivityInfo] = useState<ActivityParamType>()
  const [searchProductName, setSearchProductName] = useState<string>()
  const clickFlag = useRef<boolean>(true)

  useEffect(() => {
    const paramBelongType = getQueryString('belongType', search)
    const paramSkuId = getQueryString('skuId', search)
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
      shopId: mallInfo?.id,
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
    postMarketingWebActivityGoodsRelationGoodsList(param, { ctlType: 'none' })
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

  const checkoutUserInfo = (itemInfo: CouponCommodityItemType) => {
    if (userInfo) {
      if (userInfo.memberRoleType !== 2) {
        message.info(translate('web.resource.mall.currentRole'))
        return false
      }
      if (userInfo.memberId === itemInfo.memberId) {
        message.info(translate('web.resource.mall.bunenggoumaizijideshangpin'))
        return false
      }
      return true
    } else {
      message.info(translate('web.resource.mall.qingxiandenglu'))
      return false
    }
  }

  const handleAddPurchase = (itemInfo: CouponCommodityItemType) => {
    if (!checkoutUserInfo(itemInfo)) {
      return
    }

    if (clickFlag.current) {
      clickFlag.current = false
      const param: any = {
        commoditySkuId: itemInfo.skuId,
        count: 1,
      }

      const headers: any = {
        shopId: mallInfo?.id,
      }

      postProductShopPurchaseSaveOrUpdatePurchase(param, { headers, ctlType: 'none' })
        .then((res: any) => {
          clickFlag.current = true
          if (res.code === 1000) {
            message.destroy()
            message.success(translate('web.resource.mall.huopinyitianjiadaojinhuodan'))
            updatePurchaseList(mallInfo?.id)
          } else {
            message.error(res.message)
          }
        })
        .catch(() => {
          clickFlag.current = true
        })
    }
  }

  const handleSearch = () => {
    fetchCommodityList()
  }

  return (
    <HelmetProvider title={`${translate('web.resource.mall.huodongcoudan')}-${mallInfo?.name}`}>
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
                      <span>{translate('web.common.gong')}</span>
                      <label>{totalCount}</label>
                      <span>{translate('web.resource.mall.geshangpin')}</span>
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
                      layoutType={LAYOUT_TYPE.activity}
                      type={showType}
                      isStore={layoutType === LAYOUT_TYPE.joint}
                      path="/commodity/detail"
                      onItemClick={(info) => handleAddPurchase(info)}
                    />
                  </Spin>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default ActivityMakeUpList
