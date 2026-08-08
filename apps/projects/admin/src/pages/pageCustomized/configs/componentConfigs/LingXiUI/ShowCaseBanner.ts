import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

const ShowCaseBanner: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    styleType: {
      label: '样式',
      type: PROPS_TYPES.number,
    },
  },
}

const Item: ComponentSchemaType = {
  fatherNodesRule: ['ShowCaseBanner.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      label: '内容',
      type: PROPS_SETTING_TYPES.mobileShowCase,
    },
  },
}

export default {
  ShowCaseBanner,
  'ShowCaseBanner.Item': Item,
}
