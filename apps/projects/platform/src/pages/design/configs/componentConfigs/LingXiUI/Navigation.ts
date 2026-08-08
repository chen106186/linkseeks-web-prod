import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

const Navigation: ComponentSchemaType = {
  propsConfig: {
    navList: {
      label: '导航栏编辑',
      type: PROPS_SETTING_TYPES.navigation,
    },
  },
}

export default Navigation
