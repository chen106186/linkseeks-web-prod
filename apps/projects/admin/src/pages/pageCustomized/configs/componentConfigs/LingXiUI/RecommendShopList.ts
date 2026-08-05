import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

const RecommendShopList: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

const ShopItem: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '内容',
      type: PROPS_SETTING_TYPES.mobileQualityShopList,
    },
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

export default {
  RecommendShopList,
  'RecommendShopList.Item': ShopItem,
}
