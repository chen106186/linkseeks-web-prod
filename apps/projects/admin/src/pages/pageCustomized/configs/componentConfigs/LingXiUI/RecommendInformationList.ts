import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

const RecommendInformationList: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '内容',
      type: PROPS_SETTING_TYPES.mobileQualityInformationList,
    },
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

export default RecommendInformationList
