import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const MobileShopCommodity: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const CommodityItem: ComponentSchemaType = {
  fatherNodesRule: ['MobileShopCommodity.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      label: '内容',
      type: PROPS_SETTING_TYPES.mobileShopCommodity,
    },
  },
}

export default {
  MobileShopCommodity,
  'MobileShopCommodity.Item': CommodityItem,
}
