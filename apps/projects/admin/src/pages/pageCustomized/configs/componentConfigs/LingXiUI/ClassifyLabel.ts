import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

const ClassifyLabel: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

const LabelItem: ComponentSchemaType = {
  fatherNodesRule: ['ClassifyLabel.children'],
  propsConfig: {
    componentType: {
      type: PROPS_SETTING_TYPES.suggestProductItems,
    },
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

export default {
  ClassifyLabel,
  'ClassifyLabel.LabelItem': LabelItem,
}
