import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'
import {
  WEB_DESIGN_COMPONENT,
  CarouselBanner,
  HorizontalBanner,
  Empty,
  RichText,
  HotspotImage,
  CommodityFloor,
  Coupon,
  HorizontalCommodity,
  VerticalCommodity,
} from '@apps/design-ui'
import { Fragment, useMemo } from 'react'
import useShopHome from './hooks'
import useCoupon from '../ownHome/hooks/useCoupon'
import useLink from '@/hooks/useLink'

const StoreHome = () => {
  const { shopInfo, designConfig, mallInfo } = useGlobalConext()
  const { seoTitle, seoDescription, seoKeyword } = useShopHome()
  const { couponList, onReceiveCoupon } = useCoupon()
  const { linkPrefix } = useLink()

  /** 排序装修组件 */
  const sortDesignComponentList = useMemo(() => {
    if (designConfig && Object.keys(designConfig).length > 0) {
      if (designConfig && Object.keys(designConfig).length > 0) {
        const designComponentList: {
          componentName: string
          [key: string]: any
        }[] = []
        Object.keys(designConfig).forEach((key) => {
          const componentName = key.split('-')[0] as WEB_DESIGN_COMPONENT
          if (![WEB_DESIGN_COMPONENT.MainNav, WEB_DESIGN_COMPONENT.Information].includes(componentName)) {
            designComponentList.push({
              componentName,
              sort: designConfig[key].sort,
              props: designConfig[key],
            })
          }
        })
        const sortDesignComponentList = designComponentList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        return sortDesignComponentList
      }
    }
    return []
  }, [designConfig])

  const getReloadParam = (componentItem) => {
    const ids = (componentItem?.props?.commodityList || []).map((item) =>
      componentItem?.props?.showType === 'marketing' ? item.skuId : item.commodityId,
    )
    return {
      shopId: mallInfo?.id,
      idInList: ids,
      current: '1',
      pageSize: '100',
    }
  }

  /** 渲染自定义装修组件 */
  const renderDesignComponent = (componentItem: { [key: string]: any; componentName: string }) => {
    switch (componentItem.componentName) {
      case WEB_DESIGN_COMPONENT.CarouselBanner:
        return <CarouselBanner timeLimit {...componentItem.props} linkdisable={false} />
      case WEB_DESIGN_COMPONENT.HorizontalBanner:
        return <HorizontalBanner timeLimit {...componentItem.props} linkdisable={false} />
      case WEB_DESIGN_COMPONENT.Empty:
        return <Empty {...componentItem.props} />
      case WEB_DESIGN_COMPONENT.RichText:
        return <RichText {...componentItem.props} />
      case WEB_DESIGN_COMPONENT.HotspotImage:
        return <HotspotImage {...componentItem.props} linkdisable={false} />
      case WEB_DESIGN_COMPONENT.CommodityFloor:
        return (
          <CommodityFloor
            {...componentItem.props}
            linkdisable={false}
            isStore
            linkUrl={linkPrefix(`/shop/${shopInfo?.id}/commodity/detail`)}
            reloadDataSource
            reloadParam={getReloadParam(componentItem)}
          />
        )
      case WEB_DESIGN_COMPONENT.Coupon:
        return (
          <Coupon {...componentItem.props} couponList={couponList} linkdisable={false} onItemClick={onReceiveCoupon} />
        )
      case WEB_DESIGN_COMPONENT.HorizontalCommodity:
        return (
          <HorizontalCommodity
            {...componentItem.props}
            isStore
            linkdisable={false}
            reloadDataSource
            reloadParam={getReloadParam(componentItem)}
          />
        )
      case WEB_DESIGN_COMPONENT.VerticalCommodity:
        return (
          <VerticalCommodity
            {...componentItem.props}
            isStore
            linkdisable={false}
            reloadDataSource
            reloadParam={getReloadParam(componentItem)}
          />
        )
      default:
        return undefined
    }
  }

  return (
    <HelmetProvider title={seoTitle} description={seoDescription} keyword={seoKeyword}>
      {sortDesignComponentList.map((componentItem, componentIndex) => (
        <Fragment key={`${componentItem.componentName}-${componentIndex}`}>
          {renderDesignComponent(componentItem)}
        </Fragment>
      ))}
    </HelmetProvider>
  )
}

export default StoreHome
