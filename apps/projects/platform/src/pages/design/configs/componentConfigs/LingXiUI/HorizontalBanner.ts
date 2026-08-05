import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 横向广告图组件按钮
const HorizontalBanner: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.hengxiangtupianguanggaowei'),
      type: PROPS_SETTING_TYPES.horizontalBanner,
    },
  },
}

export default HorizontalBanner
