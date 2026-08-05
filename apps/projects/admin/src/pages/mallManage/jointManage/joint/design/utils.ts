import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const getCustomComponentTitle = (componentName: WEB_DESIGN_COMPONENT) => {
  switch (componentName) {
    case WEB_DESIGN_COMPONENT.CarouselBanner:
      return translate('web.resource.shop.lunbotu')
    case WEB_DESIGN_COMPONENT.HorizontalBanner:
      return translate('web.resource.shop.hengxiangtupianguanggaowei')
    case WEB_DESIGN_COMPONENT.RichText:
      return translate('web.resource.shop.fuwenben')
    case WEB_DESIGN_COMPONENT.HotspotImage:
      return translate('web.resource.shop.tupianrequ')
    case WEB_DESIGN_COMPONENT.CommodityFloor:
      return translate('web.resource.shop.shangpinlouceng')
    case WEB_DESIGN_COMPONENT.CommodityStoreFloor:
      return translate('web.resource.shop.shangpinloucengdaidianputuijian')
    case WEB_DESIGN_COMPONENT.Empty:
      return translate('web.resource.shop.fuzhukongbai')
    case WEB_DESIGN_COMPONENT.Coupon:
      return translate('web.resource.shop.youhuiquantuijian')
    case WEB_DESIGN_COMPONENT.HorizontalCommodity:
      return translate('web.resource.shop.shangpintuijianhengxiang')
    case WEB_DESIGN_COMPONENT.VerticalCommodity:
      return translate('web.resource.shop.shangpintuijianzongxiang')
  }
}
