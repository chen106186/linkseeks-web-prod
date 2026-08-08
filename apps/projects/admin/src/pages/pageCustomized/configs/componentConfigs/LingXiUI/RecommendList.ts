import { ComponentSchemaType, PROPS_TYPES } from '@apps/design-core'

const RecommendList: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

export default RecommendList
