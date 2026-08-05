import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const MobileNavCard: ComponentSchemaType = {
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

const MobileNavCardNavItem: ComponentSchemaType = {
  fatherNodesRule: ['MobileNavCard.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      label: '内容',
      type: PROPS_SETTING_TYPES.mobileNavCardNavItem,
    },
  },
}

export default {
  MobileNavCard,
  'MobileNavCard.NavItem': MobileNavCardNavItem,
}
