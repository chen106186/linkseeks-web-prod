import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const MallMainNav: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: intl.formatMessage({ id: 'editor.mainnav.title' }),
      type: PROPS_SETTING_TYPES.mallNav,
    },
  },
}

export default MallMainNav
