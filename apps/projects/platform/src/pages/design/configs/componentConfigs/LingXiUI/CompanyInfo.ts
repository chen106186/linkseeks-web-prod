import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const CompanyInfo: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.mall.gongsixinxi'),
      type: PROPS_SETTING_TYPES.information,
    },
  },
}

export default CompanyInfo
