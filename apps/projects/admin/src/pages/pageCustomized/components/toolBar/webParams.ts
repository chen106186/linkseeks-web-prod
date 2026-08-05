import { ROOT } from '@apps/design-core'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import { PageConfigType, VirtualDOMType } from '@apps/design-utils'

export const normalizeSortConfig = (currentComponent: VirtualDOMType, pageConfig: PageConfigType) => {
  if (currentComponent && Array.isArray(currentComponent.childNodes) && currentComponent.childNodes.length > 0) {
    const list: VirtualDOMType[] = []
    for (const childItem of currentComponent.childNodes) {
      const item = normalizeSortConfig(pageConfig[childItem], pageConfig)
      if (item) {
        list.push(...item)
      }
    }
    return list
  } else {
    return currentComponent ? [currentComponent] : []
  }
}

/**
 * 拼装装修数据
 * @param pageConfig
 * @param adornId
 * @param shopId
 * @param storeId
 * @returns
 */
export const getDesignParam = (pageConfig: PageConfigType, adornId: number, shopId: number) => {
  const _root: any = pageConfig[ROOT].childNodes || []

  const sortConfig: any = []
  _root.forEach((key) => {
    sortConfig.push(...normalizeSortConfig(pageConfig[key], pageConfig))
  })

  const adornContent: Record<string, any> = {}
  sortConfig.forEach((ele, childKey) => {
    const item = ele
    const sort = childKey + 1
    const { props } = item
    // 根据组件名称格式化装修数据
    switch (item.componentName) {
      // 导航
      case WEB_DESIGN_COMPONENT.MallMainNav:
        adornContent[WEB_DESIGN_COMPONENT.MallMainNav] = {
          ...props,
          sort,
        }
        break
      // 导航
      case WEB_DESIGN_COMPONENT.MainNav:
        adornContent[WEB_DESIGN_COMPONENT.MainNav] = {
          ...props,
          sort,
        }
        break
      // 内置广告
      case WEB_DESIGN_COMPONENT.Advert:
        adornContent[`${WEB_DESIGN_COMPONENT.Advert}-${props.type}`] = {
          ...props,
          sort,
        }
        break
      // 轮播广告
      case WEB_DESIGN_COMPONENT.CarouselBanner:
        adornContent[`${WEB_DESIGN_COMPONENT.CarouselBanner}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 横向广告
      case WEB_DESIGN_COMPONENT.HorizontalBanner:
        adornContent[`${WEB_DESIGN_COMPONENT.HorizontalBanner}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 空白辅助
      case WEB_DESIGN_COMPONENT.Empty:
        adornContent[`${WEB_DESIGN_COMPONENT.Empty}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 富文本
      case WEB_DESIGN_COMPONENT.RichText:
        adornContent[`${WEB_DESIGN_COMPONENT.RichText}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 商品楼层
      case WEB_DESIGN_COMPONENT.CommodityFloor:
        adornContent[`${WEB_DESIGN_COMPONENT.CommodityFloor}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 商品楼层
      case WEB_DESIGN_COMPONENT.CommodityStoreFloor:
        adornContent[`${WEB_DESIGN_COMPONENT.CommodityStoreFloor}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 图片热区
      case WEB_DESIGN_COMPONENT.HotspotImage:
        adornContent[`${WEB_DESIGN_COMPONENT.HotspotImage}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 行情资讯
      case WEB_DESIGN_COMPONENT.Information:
        adornContent[WEB_DESIGN_COMPONENT.Information] = {
          visible: props.visible,
          sort,
        }
        break
      case WEB_DESIGN_COMPONENT.FindMore:
        adornContent[WEB_DESIGN_COMPONENT.FindMore] = {
          visible: props.visible,
          sort,
        }
        break
      // 公司信息
      case WEB_DESIGN_COMPONENT.CompanyInfo:
        adornContent[WEB_DESIGN_COMPONENT.CompanyInfo] = {
          visible: props.visible,
          sort,
        }
        break
      // 公司相册
      case WEB_DESIGN_COMPONENT.Album:
        adornContent[WEB_DESIGN_COMPONENT.Album] = {
          visible: props.visible,
          sort,
        }
        break
      // 荣誉资质
      case WEB_DESIGN_COMPONENT.HonroPic:
        adornContent[WEB_DESIGN_COMPONENT.HonroPic] = {
          visible: props.visible,
          sort,
        }
        break
      case WEB_DESIGN_COMPONENT.Coupon:
        adornContent[`${WEB_DESIGN_COMPONENT.Coupon}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      case WEB_DESIGN_COMPONENT.HorizontalCommodity:
        adornContent[`${WEB_DESIGN_COMPONENT.HorizontalCommodity}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      case WEB_DESIGN_COMPONENT.VerticalCommodity:
        adornContent[`${WEB_DESIGN_COMPONENT.VerticalCommodity}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      case WEB_DESIGN_COMPONENT.Footer:
        adornContent[WEB_DESIGN_COMPONENT.Footer] = {
          ...props,
          sort,
        }
        break
      default:
        break
    }
  })

  return {
    adornId,
    shopId,
    adornContent,
  }
}

/**
 * 拼装装修数据
 * @param pageConfig
 * @param adornId
 * @param shopId
 * @param storeId
 * @returns
 */
export const getCpecialPageParam = (pageConfig: PageConfigType, adornId: number, shopId: number) => {
  const _root: any = pageConfig[ROOT].childNodes || []

  const sortConfig: any = []
  _root.forEach((key) => {
    sortConfig.push(...normalizeSortConfig(pageConfig[key], pageConfig))
  })

  const adornContent: Record<string, any> = {
    [WEB_DESIGN_COMPONENT.WrapLayout]: {
      sort: 0,
      backgroundColor: pageConfig[ROOT].props?.backgroundColor || '#F5F6F7',
    },
  }

  sortConfig.forEach((ele, childKey) => {
    const item = ele
    const { props } = item
    const sort = childKey + 1
    // 根据组件名称格式化装修数据
    switch (item.componentName) {
      // 内置广告
      case WEB_DESIGN_COMPONENT.OwnBanner:
        adornContent[`${WEB_DESIGN_COMPONENT.OwnBanner}-${props.type}`] = {
          ...props,
          sort,
        }
        break
      // 轮播广告
      case WEB_DESIGN_COMPONENT.CarouselBanner:
        adornContent[`${WEB_DESIGN_COMPONENT.CarouselBanner}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 横向广告
      case WEB_DESIGN_COMPONENT.HorizontalBanner:
        adornContent[`${WEB_DESIGN_COMPONENT.HorizontalBanner}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 空白辅助
      case WEB_DESIGN_COMPONENT.Empty:
        adornContent[`${WEB_DESIGN_COMPONENT.Empty}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 富文本
      case WEB_DESIGN_COMPONENT.RichText:
        adornContent[`${WEB_DESIGN_COMPONENT.RichText}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 商品楼层
      case WEB_DESIGN_COMPONENT.CommodityFloor:
        adornContent[`${WEB_DESIGN_COMPONENT.CommodityFloor}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      // 图片热区
      case WEB_DESIGN_COMPONENT.HotspotImage:
        adornContent[`${WEB_DESIGN_COMPONENT.HotspotImage}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      case WEB_DESIGN_COMPONENT.Coupon:
        adornContent[`${WEB_DESIGN_COMPONENT.Coupon}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      case WEB_DESIGN_COMPONENT.HorizontalCommodity:
        adornContent[`${WEB_DESIGN_COMPONENT.HorizontalCommodity}-${childKey}`] = {
          ...props,
          sort,
        }
        break
      case WEB_DESIGN_COMPONENT.VerticalCommodity:
        adornContent[`${WEB_DESIGN_COMPONENT.VerticalCommodity}-${childKey}`] = {
          ...props,
          sort,
        }
        break
    }
  })

  return {
    id: adornId,
    shopId,
    adornContent,
  }
}
