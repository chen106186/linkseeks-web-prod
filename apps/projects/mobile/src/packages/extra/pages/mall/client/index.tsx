import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useCallback, useEffect, useRef, useLayoutEffect, useMemo, Fragment } from 'react'
import { getSystemInfoSync, createSelectorQuery, setNavigationBarColor } from '@apps/mobile-services/utils/taro'
import { ScrollView } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import MallTabBottom from '@/components/MallTabBottom'
import CommonMallHeader from '@/components/CommonMallHeader'
import MarketingCard from '@/components/MarketingCard'
import CouponModal from '@/components/CouponModal'
import useStores from '@/store/useStores'
import { priceFormat } from '@/utils/numberFormat'
import { getRemainingDays } from '@/utils/date'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { getMarketingMobileActivityActivityCardAdorn, postMarketingMobileCouponAutoReceive } from '@apps/apis'
import CommonBanner from './components/CommonBanner'
import CommonNavCard from './components/CommonNavCard'
import SuggestTabs from '@/components/SuggestTabs'
import { usePageInit } from '@/hooks/usePageInit'
import {
  MARKETING_COMPONENTS_NAMES,
  MARKETING_COMPONENTS_TYPE,
  MOBILE_DESIGN_COMPONENT,
} from '@apps/design-ui/src/constants'
import { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { shareAppMessage, shareTimeline } from '@/utils/share'

const MallHome: React.FC = () => {
  const {
    templateStore: { clientMallDesignConfig, adornId, getClientMallDesignConfig, getMallConfigLoading },
    userStore: { shopAndSite, userInfo },
    locationStore: { currentCity },
  } = useStores()
  const [refreshing, setRefreshing] = useState(false)
  const [couponModalVisible, setCouponModalVisible] = useState<boolean>(false)
  const [designConfig, setDesignConfig] = useState<Record<string, any>>()
  const [couponList, setCouponList] = useState<any[]>()
  const [activeKey, setActiveKey] = useState<number>(0)
  const [subScroll, setSubScroll] = useState<boolean>(false)
  const [scrollTop, setScrollTop] = useState<number>()
  const currentActiveKey = useRef<number>(0)
  const headerViewHeight = useRef<number>(0)
  const scrollTopRef = useRef<number>(0)
  const recommendRef = useRef<{
    loadMore: () => void
  }>()
  const WINHEIGHT = getSystemInfoSync().windowHeight
  const lowerThreshold = WINHEIGHT
  // 记录每个子swiperImte滚动高度
  const swiperScrollTop = useRef<{
    [key: string]: number
  }>({
    swiper0: 0,
    swiper1: 0,
    swiper2: 0,
    swiper3: 0,
  })
  useLayoutEffect(() => {
    createSelectorQuery()
      .select('#mallHeader')
      .boundingClientRect((res: any) => {
        if (res && res.height > 0) {
          headerViewHeight.current = res.height
        }
      })
      .exec()
  }, [clientMallDesignConfig])
  const handleTabChange = (index: number) => {
    if (activeKey !== index) {
      setActiveKey(index)
      currentActiveKey.current = index
      if (scrollTopRef.current && subScroll) {
        // 防止高度一样，无法出发滚动
        if (swiperScrollTop.current[`swiper${index}`] === scrollTop) {
          swiperScrollTop.current[`swiper${index}`] = swiperScrollTop.current[`swiper${index}`] + 0.1
        }
        setScrollTop(swiperScrollTop.current[`swiper${index}`])
      }
    }
  }

  // 记录每个tab的滚动位置
  const handleScroll = (e) => {
    createSelectorQuery()
      .select('.at-tabs__header')
      .boundingClientRect((res: any) => {
        if (res && e.detail.deltaY < 0) {
          if (res.top <= headerViewHeight.current) {
            setNavigationBarColor({
              frontColor: '#000000',
              backgroundColor: '#ffffff',
            })
            setSubScroll(true)
          }
        } else {
          if (res.top > headerViewHeight.current + 10) {
            swiperScrollTop.current = {
              swiper0: scrollTopRef.current,
              swiper1: scrollTopRef.current,
              swiper2: scrollTopRef.current,
              swiper3: scrollTopRef.current,
            }
            setSubScroll(false)
          }
        }
        if (res && scrollTopRef.current && e.detail.scrollTop >= scrollTopRef.current) {
          swiperScrollTop.current[`swiper${currentActiveKey.current}`] = e.detail.scrollTop
        }
      })
      .exec()
  }
  const handleLoadMore = () => {
    recommendRef.current?.loadMore()
  }
  const getCouponConfig = async (
    couponDetails: {
      id: number
      belongType: number
      [key: string]: any
    }[],
  ) => {
    if (couponDetails && couponDetails.length > 0) {
      const _params: any = {
        shopId: shopAndSite?.id,
        couponList: couponDetails.map((item) => ({
          couponId: item.id,
          belongType: item.belongType,
        })),
      }
      try {
        const _detailData = await postMarketingMobileCouponAutoReceive(_params)
        if (_detailData.code === 1000) {
          const _list = _detailData.data.map((item: any) => ({
            ...item,
            expiredDay: getRemainingDays(item?.releaseTimeEnd),
          }))
          setCouponList(_list)
          if (_list.length > 0) {
            setCouponModalVisible(true)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  /** 获取营销活动数据 */
  const getDesignConfig = async (config: any) => {
    try {
      const finalDesignConfig: Record<string, any> = {}
      const designConfigKeys = Object.keys(config)
      for (const key of designConfigKeys) {
        const componentName = key.split('-')[0] as MOBILE_DESIGN_COMPONENT
        if (componentName === MOBILE_DESIGN_COMPONENT.MarketingCard) {
          const marketingCardConfig = config[key]
          const marketingCardHeaderConfig = marketingCardConfig?.children[0]?.props
          const marketingCommodityIds = marketingCardConfig?.children[1]?.children
            ?.filter((item) => item.props?.id)
            .map((item) => item.props?.id)
          if (marketingCommodityIds.length > 0) {
            const res = await getMarketingMobileActivityActivityCardAdorn({
              ids: marketingCommodityIds.join(','),
            } as any)
            if (res.code === 1000 && res.data && res.data.length > 0) {
              if (marketingCardConfig.props.type === MARKETING_COMPONENTS_NAMES.SetMeal) {
                const _item = res.data[0]
                marketingCardHeaderConfig['details'] = {
                  ..._item,
                  img: _item.productImgUrl,
                  title: _item.productName,
                  discountPrice: _item.price,
                  buy: 0,
                }
              } else {
                marketingCardHeaderConfig['list'] = res.data
                  .sort((a, b) => marketingCommodityIds.indexOf(a.id) - marketingCommodityIds.indexOf(b.id))
                  .map((item) => ({
                    ...item,
                    img: item.productImgUrl,
                    info: item.label,
                    originalPrice: priceFormat(item.price),
                    discountPrice: priceFormat(item.activityPrice || item.price),
                  }))
              }
            }
          }
          finalDesignConfig[key] = {
            ...config[key],
            props: {
              ...config[key].props,
              ...marketingCardHeaderConfig,
            },
          }
        } else {
          finalDesignConfig[key] = config[key]
        }
      }
      setDesignConfig(finalDesignConfig)
    } catch (error) {
      console.log(error)
    }
  }
  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    getClientMallDesignConfig().then(() => {
      setTimeout(() => {
        setRefreshing(false)
      }, 1500)
    })
  }, [])
  usePageInit()
  useEffect(() => {
    if (!designConfig) {
      getClientMallDesignConfig()
    }
  }, [])
  useEffect(() => {
    if (clientMallDesignConfig) {
      getDesignConfig({
        ...clientMallDesignConfig,
      })
    }
  }, [clientMallDesignConfig])
  useEffect(() => {
    if (designConfig) {
      if (userInfo) {
        const details = designConfig?.['CouponsModal']?.children?.map((item) => item.props) || []
        getCouponConfig(details)
      }
    }
  }, [designConfig])
  const _couponModalClose = () => {
    setCouponModalVisible(!couponModalVisible)
  }
  const sortDesignComponentList = useMemo(() => {
    if (designConfig && Object.keys(designConfig).length > 0) {
      if (designConfig && Object.keys(designConfig).length > 0) {
        const designComponentList: {
          componentName: string
          [key: string]: any
        }[] = []
        Object.keys(designConfig).forEach((key) => {
          const componentName = key.split('-')[0] as MOBILE_DESIGN_COMPONENT
          if (![MOBILE_DESIGN_COMPONENT.HeaderNav, MOBILE_DESIGN_COMPONENT.BottomNavigation].includes(componentName)) {
            designComponentList.push({
              componentName,
              sort: designConfig[key].sort,
              props: designConfig[key].props || {},
              children: designConfig[key].children || [],
            })
          }
        })
        const sortDesignComponentList = designComponentList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        return sortDesignComponentList
      }
    }
    return []
  }, [designConfig])

  /** 渲染自定义装修组件 */
  const renderDesignComponent = (componentItem: { [key: string]: any; componentName: string }) => {
    if (componentItem.props?.visible === false) {
      return undefined
    }
    const details =
      componentItem?.children?.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            ...item.props,
            details: item.children.map((childItem) => childItem.props),
          }
        }
        return item.props
      }) || []
    switch (componentItem.componentName) {
      case MOBILE_DESIGN_COMPONENT.Banner:
        return (
          <CommonBanner
            bannerList={details}
            shopId={shopAndSite?.id}
            provinceCode={currentCity?.provinceCode}
            cityCode={currentCity?.cityCode}
          />
        )
      case MOBILE_DESIGN_COMPONENT.MobileNavCard:
        return <CommonNavCard navData={details} adornId={adornId} loading={getMallConfigLoading} />
      case MOBILE_DESIGN_COMPONENT.MarketingCard:
        if (componentItem.props.type === MARKETING_COMPONENTS_TYPE.SetMeal) {
          if (componentItem.props.details) {
            return (
              <MarketingCard
                key={componentItem.props.type}
                type={MARKETING_COMPONENTS_TYPE.SetMeal}
                details={componentItem.props.details}
              />
            )
          }
          return undefined
        }
        return (
          <MarketingCard
            key={componentItem.props.type}
            type={componentItem.props.type}
            title={componentItem.props?.title}
            explain={componentItem.props?.explain}
            icon={componentItem.props?.icon}
            details={componentItem.props.list || []}
          />
        )
      case MOBILE_DESIGN_COMPONENT.SuggestProduct:
        return (
          <SuggestTabs
            refreshing={refreshing}
            scroll={false}
            activeKey={activeKey}
            shopId={shopAndSite?.id}
            details={details}
            currentCity={currentCity}
            onTabChange={handleTabChange}
            currentRef={recommendRef}
          />
        )
      default:
        return undefined
    }
  }

  // 分享给好友
  useShareAppMessage(shareAppMessage)
  // 分享到朋友圈
  useShareTimeline(shareTimeline)

  return (
    <MallTabBottom layoutType={LAYOUT_TYPE.client} visible activeUrl="extra/mall/client">
      <CommonMallHeader isShowCategory adornId={adornId} />
      <ScrollView
        scrollWithAnimation
        onRefresherRefresh={handleRefresh}
        refresherEnabled
        id="parenScrollView"
        scrollTop={scrollTop}
        refresherTriggered={refreshing}
        onScroll={handleScroll}
        refresherBackground="transparent"
        enhanced
        onScrollToLower={handleLoadMore}
        lowerThreshold={lowerThreshold}
        showScrollbar={false}
        scrollY={true}
        style={{
          flex: 1,
          height: 0,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {sortDesignComponentList && sortDesignComponentList.length > 0
          ? sortDesignComponentList.map((componentItem, componentIndex) => (
              <Fragment key={`${componentItem.componentName}-${componentIndex}`}>
                {renderDesignComponent(componentItem)}
              </Fragment>
            ))
          : undefined}
      </ScrollView>
      <CouponModal
        visible={couponModalVisible}
        onClose={_couponModalClose}
        title={designConfig?.['CouponsModal']?.props?.title}
        data={couponList || []}
      />
    </MallTabBottom>
  )
}
export default GlobalWrapper(observer(MallHome))
