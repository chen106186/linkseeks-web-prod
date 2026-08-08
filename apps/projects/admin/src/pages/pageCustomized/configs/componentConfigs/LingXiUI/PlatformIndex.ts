import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页
const PlatformIndex: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '自定义显示版块',
      type: PROPS_SETTING_TYPES.platformCustom,
    },
  },
}

export default {
  PlatformIndex,
}
