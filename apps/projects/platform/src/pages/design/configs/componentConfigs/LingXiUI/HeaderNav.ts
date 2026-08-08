import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const HeaderNav: ComponentSchemaType = {
  propsConfig: {
    styleType: {
      label: '样式',
      type: PROPS_TYPES.objectArray,
    },
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const ActionItem: ComponentSchemaType = {
  fatherNodesRule: ['HeaderNav.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      label: '内容',
      type: PROPS_SETTING_TYPES.mobileHeaderNavAction,
    },
  },
}

export default {
  HeaderNav,
  'HeaderNav.ActionItem': ActionItem,
}
