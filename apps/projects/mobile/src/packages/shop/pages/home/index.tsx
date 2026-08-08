import GlobalWrapper from '@/components/GlobalWrapper'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { ScrollView } from '@tarojs/components'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import ShopTabBottom from '@/components/MallTabBottom'
import MarketingCard from '@/components/MarketingCard'
import CouponModal from '@/components/CouponModal'
import Header from './components/Header'
import NavCard from './components/NavCard'
import Banner from './components/Banner'
import { getRemainingDays } from '@/utils/date'
import { getMarketingMobileActivityStoreActivityCardAdorn, postMarketingMobileCouponAutoReceive } from '@apps/apis'
import useStores from '@/store/useStores'
import CommodityList from './components/CommodityList'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { usePageInit } from '@/hooks/usePageInit'
import {
  MARKETING_COMPONENTS_NAMES,
  MARKETING_COMPONENTS_TYPE,
  MOBILE_DESIGN_COMPONENT,
} from '@apps/design-ui/src/constants'
import { priceFormat } from '@apps/utils/src/format'
const ShopHome = () => {
  const { id } = getCurrentInstance().router?.params || {}
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [couponModalVisible, setCouponModalVisible] = useState<boolean>(false)
  const [couponList, setCouponList] = useState<any[]>()
  const {
    userStore: { shopAndSite, userInfo },
    templateStore: { getShopDesignConfig, shopDesignConfig, getShopConfigLoading, resetShopDesignConfig, shopInfo },
    locationStore: { currentCity },
  } = useStores()
  const [designConfig, setDesignConfig] = useState<Record<string, any>>()
  usePageInit()
  useEffect(() => {
    if (shopAndSite?.id && id) {
      getShopDesignConfig(shopAndSite.id, Number(id))
    }
  }, [id])
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
            const res = await getMarketingMobileActivityStoreActivityCardAdorn({
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
  useEffect(() => {
    if (shopDesignConfig) {
      getDesignConfig({
        ...shopDesignConfig,
      })
    }
  }, [shopDesignConfig])
  useEffect(() => {
    return () => {
      resetShopDesignConfig()
    }
  }, [])
  useEffect(() => {
    if (designConfig) {
      if (userInfo) {
        const details = designConfig?.['CouponsModal']?.children?.map((item) => item.props) || []
        getCouponConfig(details)
      }
    }
  }, [designConfig, shopInfo])
  const handleRefresh = async () => {
    setRefreshing(true)
    if (shopAndSite?.id && id) {
      await getShopDesignConfig(shopAndSite.id, Number(id))
    }
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  /** 跳转类型：  1: 商品详情 2: 活动主页 3:积分详情 4: 不跳转  */
  const bannerLinkType: any = {
    1: 'commodityMerge/stocksSourcing/detail',
    2: 'activity/index',
    3: 'commodityMerge/pointsSourcing/detail',
    4: '',
  }

  /** 跳转类型：1-品类导航 2.活动导航 3.频道导航(频道 1: 积分兑换; 2:公司介绍; 3:成为会员; ) 4.外部链接 */
  const navLinkType: any = {
    1: 'commodityMerge/stocksSourcing/index',
    2: 'activity/index',
    3: {
      1: 'shop/pointExchange',
      2: 'shop/shopAbout',
      3: 'members/shop',
    },
    4: 'extra/webview',
  }
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
          <Banner
            loading={getShopConfigLoading}
            linkType={bannerLinkType}
            bannerList={details}
            shopId={shopAndSite?.id}
            provinceCode={currentCity?.provinceCode}
            cityCode={currentCity?.cityCode}
          />
        )
      case MOBILE_DESIGN_COMPONENT.MobileNavCard:
        return (
          <NavCard
            adornId={shopInfo?.adornId}
            linkType={navLinkType}
            navData={details}
            loading={getShopConfigLoading}
          />
        )
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
      case MOBILE_DESIGN_COMPONENT.MobileShopCommodity:
        return (
          <CommodityList currentCity={currentCity} details={details} shopId={shopAndSite?.id} shopInfo={shopInfo} />
        )
      default:
        return undefined
    }
  }
  return (
    <ShopTabBottom layoutType={LAYOUT_TYPE.shop} visible activeUrl="shop/home">
      <Header backgroundImg={designConfig?.['MobileShopHeader']?.props?.backdrop} shopInfo={shopInfo} />
      <ScrollView
        refresherEnabled
        refresherTriggered={refreshing}
        scrollY
        style={{
          flex: 1,
          height: 0,
          backgroundColor: '#F5F6F7',
        }}
        onRefresherRefresh={handleRefresh}
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
        storeId={shopInfo?.id}
        data={couponList || []}
      />
    </ShopTabBottom>
  )
}
export default GlobalWrapper(observer(ShopHome))
