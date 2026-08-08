import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页实力商家
const PlatformMerchant: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '实力商家设置',
      type: PROPS_SETTING_TYPES.platformMechant,
    },
  },
}

export default PlatformMerchant
