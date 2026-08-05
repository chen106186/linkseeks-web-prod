import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const BottomNavigation: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const BottomNavigationItems: ComponentSchemaType = {
  fatherNodesRule: ['BottomNavigation.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.bottomNavigationItems,
    },
  },
}

export default {
  BottomNavigation,
  'BottomNavigation.Items': BottomNavigationItems,
}
