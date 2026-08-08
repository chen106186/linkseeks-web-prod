import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 商品楼层
const CarouselBanner: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.shangpinlouceng'),
      type: PROPS_SETTING_TYPES.commodityFloor,
    },
  },
}

export default CarouselBanner
