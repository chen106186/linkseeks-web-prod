import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'

const FloorLine: ComponentSchemaType = {
  // nodePropsConfig: {
  //   overflowedIndicator: {
  //     type: NODE_PROPS_TYPES.reactNode,
  //     // isOnlyNode: true,
  //   },
  //   children: {
  //     type: NODE_PROPS_TYPES.reactNode,
  //     childNodesRule: [
  //       'FloorLine.Brand',
  //       'FloorLine.Shops',
  //       'FloorLine.Goods',
  //       'FloorLine.Category',
  //       'FloorLine.FloorHeader',
  //       'FloorLine.Banner',
  //       'FloorLine.Vertical',
  //       'FloorLine.Horizontal'],
  //   },
  // },
  propsConfig: {},
}

const Brand: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '品牌推荐设置',
      type: PROPS_SETTING_TYPES.brand,
    },
    dataList: {
      label: '品牌展示编辑',
      type: PROPS_SETTING_TYPES.brand,
    },
  },
}

const Shops: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '店铺推荐设置',
      type: PROPS_SETTING_TYPES.shop,
    },
    dataList: {
      label: '店铺展示编辑',
      type: PROPS_SETTING_TYPES.shop,
    },
  },
}

const Goods: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '商品推荐设置',
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
      label: '分类推荐设置',
      type: PROPS_SETTING_TYPES.category,
    },
    dataList: {
      label: '分类推荐设置',
      type: PROPS_SETTING_TYPES.category,
    },
  },
}
const FloorHeader: ComponentSchemaType = {
  propsConfig: {
    dataList: {
      label: '商品展示编辑',
      type: PROPS_SETTING_TYPES.goods,
    },
  },
}
const Banner: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '分类广告推荐设置',
      type: PROPS_SETTING_TYPES.categoryBanner,
    },
    dataList: {
      label: '分类广告推荐设置',
      type: PROPS_SETTING_TYPES.categoryBanner,
    },
  },
}
const Vertical: ComponentSchemaType = {
  propsConfig: {
    dataList: {
      label: '商品展示编辑',
      type: PROPS_SETTING_TYPES.goods,
    },
  },
}
const Horizontal: ComponentSchemaType = {
  propsConfig: {
    dataList: {
      label: '商品展示编辑',
      type: PROPS_SETTING_TYPES.goods,
    },
  },
}

export default {
  FloorLine,
  'FloorLine.Brand': Brand,
  'FloorLine.Shops': Shops,
  'FloorLine.Goods': Goods,
  'FloorLine.Category': Category,
  'FloorLine.FloorHeader': FloorHeader,
  'FloorLine.Banner': Banner,
  'FloorLine.Vertical': Vertical,
  'FloorLine.Horizontal': Horizontal,
}
