import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const Commodity: ComponentSchemaType = {
  fatherNodesRule: ['SuggestProduct.Items.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.clientCommodity,
    },
  },
}

export default {
  Commodity,
}
