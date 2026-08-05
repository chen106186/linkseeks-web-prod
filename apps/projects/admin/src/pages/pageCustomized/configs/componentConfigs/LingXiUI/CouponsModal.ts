import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const CouponsModal: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.couponsModal,
    },
  },
}

const CouponsItem: ComponentSchemaType = {
  fatherNodesRule: ['CouponsModal.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.marketingCardCoupon,
    },
  },
}

export default {
  CouponsModal,
  'CouponsModal.CouponsItem': CouponsItem,
}
