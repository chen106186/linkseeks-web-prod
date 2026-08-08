import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页平台服务
const PlatformService: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '平台服务设置',
      type: PROPS_SETTING_TYPES.platformService,
    },
  },
}

export default PlatformService
