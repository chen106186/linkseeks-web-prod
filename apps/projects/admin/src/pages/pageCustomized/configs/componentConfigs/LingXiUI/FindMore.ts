import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const FindMore: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.mall.findmore'),
      type: PROPS_SETTING_TYPES.findMore,
    },
  },
}

export default FindMore
