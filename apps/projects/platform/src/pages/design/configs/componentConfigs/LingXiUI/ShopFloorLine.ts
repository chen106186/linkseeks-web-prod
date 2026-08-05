import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const ShopFloorLine: ComponentSchemaType = {
  // nodePropsConfig: {
  //   overflowedIndicator: {
  //     type: NODE_PROPS_TYPES.reactNode,
  //     isOnlyNode: true,
  //   },
  //   children: {
  //     type: NODE_PROPS_TYPES.reactNode,
  //     childNodesRule: [
  //       'ShopFloorLine.Category',
  //       'ShopFloorLine.Goods',
  //     ]
  //   },
  // },
  propsConfig: {},
}

const Goods: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: intl.formatMessage({ id: 'editor.shopfloorline.goods', defaultMessage: '商品推荐设置' }),
      type: PROPS_SETTING_TYPES.goods,
    },
    dataList: {
      label: '商品展示编辑',
      type: PROPS_SETTING_TYPES.goods,
    },
  },
}

const Category: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: intl.formatMessage({ id: 'editor.shopfloorline.category', defaultMessage: '分类推荐设置' }),
      type: PROPS_SETTING_TYPES.category,
    },
    dataList: {
      label: '分类推荐设置',
      type: PROPS_SETTING_TYPES.category,
    },
  },
}

export default {
  ShopFloorLine,
  'ShopFloorLine.Category': Category,
  'ShopFloorLine.Goods': Goods,
}
