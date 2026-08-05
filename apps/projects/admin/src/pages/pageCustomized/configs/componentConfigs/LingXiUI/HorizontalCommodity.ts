import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 商品推荐（横向）
const HorizontalCommodity: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.shangpintuijianhengxiang'),
      type: PROPS_SETTING_TYPES.horizontalCommodity,
    },
  },
}

export default HorizontalCommodity
