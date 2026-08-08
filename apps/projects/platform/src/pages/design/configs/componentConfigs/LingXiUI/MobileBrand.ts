import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

const MobileBrand: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const Header: ComponentSchemaType = {
  fatherNodesRule: ['MobileBrand.children'],
  propsConfig: {
    componentType: {
      label: '编辑',
      type: PROPS_SETTING_TYPES.marketingCardHeader,
    },
  },
}

const List: ComponentSchemaType = {
  fatherNodesRule: ['MobileBrand.children'],
  propsConfig: {
    componentType: {
      label: '编辑',
      type: PROPS_SETTING_TYPES.mobileQualityBrandList,
    },
  },
}

export default {
  MobileBrand,
  'MobileBrand.Header': Header,
  'MobileBrand.List': List,
}
