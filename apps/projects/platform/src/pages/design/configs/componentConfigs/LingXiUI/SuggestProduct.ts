import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const SuggestProduct: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const SuggestProductItems: ComponentSchemaType = {
  fatherNodesRule: ['SuggestProduct.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.suggestProductItems,
    },
  },
}

const SuggestProductCommodity: ComponentSchemaType = {
  fatherNodesRule: ['SuggestProduct.Items.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.suggestProductCommodity,
    },
  },
}

export default {
  SuggestProduct,
  'SuggestProduct.Items': SuggestProductItems,
  'SuggestProduct.Commodity': SuggestProductCommodity,
}
