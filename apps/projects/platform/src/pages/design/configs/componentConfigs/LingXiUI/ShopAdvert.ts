import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const ShopAdvert: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: intl.formatMessage({ id: 'editor.advert.title' }),
      type: PROPS_SETTING_TYPES.advert,
    },
    sliderList: {
      label: intl.formatMessage({ id: 'editor.advert.title' }),
      type: PROPS_SETTING_TYPES.carousel,
    },
  },
}

export default ShopAdvert
