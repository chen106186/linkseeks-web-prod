import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const HonroPic: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.mall.rongyuzizhi'),
      type: PROPS_SETTING_TYPES.information,
    },
  },
}

export default HonroPic
