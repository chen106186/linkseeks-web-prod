import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页广告编辑
const PlatformAdvert: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '广告编辑',
      type: PROPS_SETTING_TYPES.platformAdvert,
    },
    sliderList: {
      label: '广告编辑',
      type: PROPS_SETTING_TYPES.carousel,
    },
  },
}

export default PlatformAdvert
