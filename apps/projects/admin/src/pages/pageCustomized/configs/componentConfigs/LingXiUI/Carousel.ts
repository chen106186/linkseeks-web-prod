import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

const Carousel: ComponentSchemaType = {
  propsConfig: {
    sliderList: {
      label: '轮播广告编辑',
      type: PROPS_SETTING_TYPES.carousel,
    },
  },
}

export default Carousel
