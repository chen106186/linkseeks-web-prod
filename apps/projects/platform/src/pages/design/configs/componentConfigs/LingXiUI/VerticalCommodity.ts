import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 商品推荐（纵向）
const VerticalCommodity: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.shangpintuijianzongxiang'),
      type: PROPS_SETTING_TYPES.verticalCommodity,
    },
  },
}

export default VerticalCommodity
