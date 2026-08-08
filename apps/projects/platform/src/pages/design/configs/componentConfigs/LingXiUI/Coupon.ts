import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 优惠券推荐
const Coupon: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.youhuiquantuijian'),
      type: PROPS_SETTING_TYPES.coupon,
    },
  },
}

export default Coupon
