import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const MobileHeaderNav: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '编辑',
      type: PROPS_SETTING_TYPES.mobileHeaderNav,
    },
    styleType: {
      label: '样式',
      type: PROPS_TYPES.objectArray,
    },
  },
}

export default MobileHeaderNav
