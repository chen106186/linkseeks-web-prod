import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页品牌馆
const PlatformBrand: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '品牌推荐设置',
      type: PROPS_SETTING_TYPES.platformBrand,
    },
  },
}

export default PlatformBrand
