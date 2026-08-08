import React, { useState, useRef, useEffect } from 'react'
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons'
import { COMMODITY_SHOW_TYPE } from '@/constants'
import cx from 'classnames'
import { Spin, Input, message } from 'antd'
import SearchNoResult from '@/components/SearchNoResult'
import SearchIcon from '@/assets/icons/searchIcon.png'
import { postMarketingWebCouponGoodsList, postProductShopPurchaseSaveOrUpdatePurchase } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useLocation, useParams } from 'react-router-dom'
import { CouponCommodityItemType } from '@/components/ProductList/types'
import { getQueryString } from '@/utils/getUrlParam'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'
import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'
import ProductList from '@/components/ProductList'
import { LAYOUT_TYPE } from '@/types/global'
import styles from './index.module.less'

const makeUpList: React.FC = () => {
  const translate = getWebIntl()
  const { mallInfo, layoutType, userInfo, currentCity } = useGlobalConext()
  const { updatePurchaseList } = usePurchaseOrderContext()
  const { search } = useLocation()
  const { id } = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [showType, setShowType] = useState<COMMODITY_SHOW_TYPE>(COMMODITY_SHOW_TYPE.gird) // 展示方式：1：矩阵排列； 2:列表排列
  const [commodityList, setCommodityList] = useState<CouponCommodityItemType[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [searchProductName, setSearchProductName] = useState<string>()
  const clickFlag = useRef<boolean>(true)
  const paramCelongType = getQueryString('belongType', search)
  const [current, setCurrent] = useState<number>(1)
  const [lastScrollTop, setLastScrollTop] = useState<number>(0)
  const hasMore = useRef<boolean>(true)
  const loadingRef = useRef<boolean>(true)

  const handleLoadMore = () => {
    if (hasMore.current && !loadingRef.current) {
      setCurrent(current + 1)
      fetchCommodityList(current + 1)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      // 获取当前的滚动位置和页面高度
      const scrollTop = window.scrollY // 滚动的垂直位置
      const windowHeight = window.innerHeight // 浏览器窗口高度

      const footerDom = document.getElementById('footer')
      let footerHeight = 0
      if (footerDom) {
        footerHeight = footerDom.offsetHeight
      }

      const documentHeight = document.documentElement.scrollHeight - footerHeight // 文档总高度

      // 检查是否滚动到底部
      if (scrollTop > lastScrollTop && scrollTop + windowHeight >= documentHeight) {
        // 用户已经滚动到底部，触发所需的事件
        handleLoadMore()
      }

      // 更新上一次滚动位置
      setLastScrollTop(scrollTop)
    }

    // 监听滚动事件
    window.addEventListener('scroll', handleScroll)

    // 清除滚动事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollTop])

  const fetchCommodityList = (page = 1) => {
    const param: any = {
      shopId: mallInfo?.id,
      couponId: id,
      belongType: paramCelongType,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      pageSize: 10,
      current: page,
    }

    if (searchProductName) {
      param['productName'] = searchProductName
    }

    setLoading(true)
    loadingRef.current = true
    postMarketingWebCouponGoodsList(param, {
      headers: {
        shopId: String(mallInfo?.id),
      },
      ctlType: 'none',
    })
      .then((res) => {
        message.destroy()
        if (res.code === 1000 && res.data && res.data.length > 0) {
          const list = [...commodityList, ...res.data] as CouponCommodityItemType[]
          setCommodityList(list)
          setTotalCount(list.length)
        } else {
          hasMore.current = false
        }
      })
      .finally(() => {
        loadingRef.current = false
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCommodityList()
  }, [])

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
                      onItemClick={(info) => handleAddPurchase(info)}
                      isMro={false}
                      path="/commodity/detail"
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

export default makeUpList
