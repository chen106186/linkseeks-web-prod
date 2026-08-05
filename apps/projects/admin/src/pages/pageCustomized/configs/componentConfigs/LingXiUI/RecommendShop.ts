import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

const RecommendShop: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    styleType: {
      label: '样式',
      type: PROPS_TYPES.objectArray,
    },
  },
}

const ShopItem: ComponentSchemaType = {
  fatherNodesRule: ['RecommendShop.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      label: '内容',
      type: PROPS_SETTING_TYPES.mobileRecommentShops,
    },
  },
}

export default {
  RecommendShop,
  'RecommendShop.Item': ShopItem,
}
