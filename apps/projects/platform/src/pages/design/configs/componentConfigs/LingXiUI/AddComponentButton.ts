import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 商城添加组件按钮
const AddComponentButton: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.tianjiazujian'),
      type: PROPS_SETTING_TYPES.addComponentsButton,
    },
  },
}

export default AddComponentButton
