import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页行情资讯
const PlatformInformation: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '行情资讯设置',
      type: PROPS_SETTING_TYPES.platformInformation,
    },
  },
}

export default PlatformInformation
