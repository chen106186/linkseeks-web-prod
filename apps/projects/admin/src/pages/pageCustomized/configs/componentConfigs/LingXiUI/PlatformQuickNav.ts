import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页快捷导航
const PlatformQuickNav: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '快捷访问',
      type: PROPS_SETTING_TYPES.platformQuickNav,
    },
  },
}

export default PlatformQuickNav
