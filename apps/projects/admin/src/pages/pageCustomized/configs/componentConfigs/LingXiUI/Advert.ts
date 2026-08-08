import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

const Advert: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '广告编辑',
      type: PROPS_SETTING_TYPES.advert,
    },
    sliderList: {
      label: '广告编辑',
      type: PROPS_SETTING_TYPES.carousel,
    },
  },
}

export default Advert
