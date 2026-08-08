import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const RichText: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.fuwenben'),
      type: PROPS_SETTING_TYPES.richText,
    },
  },
}

export default RichText
