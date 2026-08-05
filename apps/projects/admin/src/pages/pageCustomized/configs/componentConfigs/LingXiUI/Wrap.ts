import { ComponentSchemaType, PROPS_TYPES } from '@apps/design-react'

const View: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

export default View
