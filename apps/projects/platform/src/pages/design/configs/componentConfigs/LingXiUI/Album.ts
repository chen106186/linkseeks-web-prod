import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const Album: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.mall.gongsixiangce'),
      type: PROPS_SETTING_TYPES.information,
    },
  },
}

export default Album
