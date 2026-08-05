import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const Footer: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.mall.yangshipeizhi'),
      type: PROPS_SETTING_TYPES.mallFooter,
    },
  },
}

export default Footer
