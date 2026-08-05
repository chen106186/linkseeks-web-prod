import { ComponentSchemaType, PROPS_TYPES } from '@apps/design-core'

const Layout: ComponentSchemaType = {
  propsConfig: {
    className: {
      label: '类名',
      type: PROPS_TYPES.stringArray,
    },
  },
}

export default Layout
