import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const Banner: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const BannerItems: ComponentSchemaType = {
  fatherNodesRule: ['Banner.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.bannerItems,
    },
  },
}

export default {
  Banner,
  'Banner.Items': BannerItems,
}
