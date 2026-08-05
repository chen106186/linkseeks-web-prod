import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 图片热区
const HotspotImage: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.tupianrequ'),
      type: PROPS_SETTING_TYPES.hotspotImage,
    },
  },
}

export default HotspotImage
