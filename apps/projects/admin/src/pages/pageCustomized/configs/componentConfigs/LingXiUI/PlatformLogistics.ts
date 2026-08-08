import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页物流服务
const PlatformLogistics: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '物流服务设置',
      type: PROPS_SETTING_TYPES.platformLogistics,
    },
  },
}

export default PlatformLogistics
