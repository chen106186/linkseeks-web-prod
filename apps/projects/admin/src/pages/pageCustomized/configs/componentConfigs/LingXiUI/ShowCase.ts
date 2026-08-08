import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

const ShowCase: ComponentSchemaType = {
  // nodePropsConfig: {
  //   overflowedIndicator: {
  //     type: NODE_PROPS_TYPES.reactNode,
  //     isOnlyNode: true,
  //   },
  //   children: {
  //     type: NODE_PROPS_TYPES.reactNode,
  //     childNodesRule: ['ShowCase.Brand', 'ShowCase.Shop', 'ShowCase.Goods'],
  //   },
  // },
  propsConfig: {},
}

const Brand: ComponentSchemaType = {
  propsConfig: {
    dataList: {
      label: '品牌展示编辑',
      type: PROPS_SETTING_TYPES.brand,
    },
  },
}

const Shop: ComponentSchemaType = {
  propsConfig: {
    dataList: {
      label: '店铺展示编辑',
      type: PROPS_SETTING_TYPES.shop,
    },
  },
}

const Goods: ComponentSchemaType = {
  propsConfig: {
    dataList: {
      label: '商品展示编辑',
      type: PROPS_SETTING_TYPES.goods,
    },
  },
}

export default {
  ShowCase,
  'ShowCase.Brand': Brand,
  'ShowCase.Shop': Shop,
  'ShowCase.Goods': Goods,
}
