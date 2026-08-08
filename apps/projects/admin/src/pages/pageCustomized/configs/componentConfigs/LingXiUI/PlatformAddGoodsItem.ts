import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页添加推荐商品
const PlatformAddGoodsItem: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '添加商品',
      type: PROPS_SETTING_TYPES.platformAddGoodsItem,
    },
  },
}

export default PlatformAddGoodsItem
