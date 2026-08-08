import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

const RecommendBrandList: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

const BrandItem: ComponentSchemaType = {
  fatherNodesRule: ['RecommendBrandList.children'],
  propsConfig: {
    componentType: {
      label: '内容',
      type: PROPS_SETTING_TYPES.mobileQualityBrandList,
    },
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

export default {
  RecommendBrandList,
  'RecommendBrandList.Item': BrandItem,
}
