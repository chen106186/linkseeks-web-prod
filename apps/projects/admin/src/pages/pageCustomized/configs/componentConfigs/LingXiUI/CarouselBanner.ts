import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 轮播广告图片
const CarouselBanner: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.lunbotupian'),
      type: PROPS_SETTING_TYPES.carouselBanner,
    },
  },
}

export default CarouselBanner
