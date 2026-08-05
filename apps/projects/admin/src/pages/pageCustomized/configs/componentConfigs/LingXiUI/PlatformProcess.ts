import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页加工服务
const PlatformProcess: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '加工服务设置',
      type: PROPS_SETTING_TYPES.platformProcess,
    },
  },
}

export default PlatformProcess
