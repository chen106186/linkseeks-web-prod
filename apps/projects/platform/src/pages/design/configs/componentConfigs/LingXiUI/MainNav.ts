import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const MainNav: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.daohanglanbianji'),
      type: PROPS_SETTING_TYPES.mallNav,
    },
  },
}

export default MainNav
