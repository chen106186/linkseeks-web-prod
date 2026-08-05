import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const Empty: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.fuzhukongbai'),
      type: PROPS_SETTING_TYPES.empty,
    },
  },
}

export default Empty
