import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页推荐商品
const PlatformGoods: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '商品推荐设置',
      type: PROPS_SETTING_TYPES.platformGoods,
    },
  },
}

export default PlatformGoods
