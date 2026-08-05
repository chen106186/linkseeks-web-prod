import type { ComponentSchemaType } from '@apps/design-core'
import { PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const Advertisement: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      type: 'Advertisement' as any,
    },
    imageUrl: {
      label: '图片链接',
      type: PROPS_TYPES.string,
    },
    style: {
      label: '样式',
      type: PROPS_TYPES.object,
    },
  },
}

const Coupon = {
  Coupon: {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
      componentType: {
        type: 'CouponMultiple',
      },
    },
  },
  'Coupon.Item': {
    propsConfig: {
      componentType: {
        type: 'CouponSetting',
      },
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
}

const MarketingCard = {
  MarketingCard: {
    propsConfig: {},
  },
  'MarketingCard.CouponsItem': {
    propsConfig: {
      componentType: {
        label: '优惠券',
        type: PROPS_SETTING_TYPES.category,
      },
    },
  },
}

const Commodity = {
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

const CommodityList = {
  CommodityList: {
    propsConfig: {
      componentType: {
        type: 'ActivityAreaSetting',
      },
    },
  },
  'CommodityList.Item': {
    propsConfig: {
      componentType: {
        type: 'ProductPanel',
      },
    },
  },
  'CommodityList.CommodityTab': {
    propsConfig: {
      componentType: {
        type: 'ProductPanel', // 这里说明打开什么样的修改panel
      },
    },
  },
  'CommodityList.WebCommodityTab': {
    propsConfig: {
      componentType: {
        type: 'ProductPanel', // 这里说明打开什么样的修改panel
      },
    },
  },
  'CommodityList.SwapCoupon': {
    propsConfig: {},
  },
  'CommodityList.SwapProduct': {
    propsConfig: {},
  },
  // "CommodityList.CombineSale": {
  //   propsConfig: {}
  // },
  'CommodityList.FlashSale': {
    propsConfig: {},
  },
}

const WrapCommodityList = {
  WrapCommodityList: {
    propsConfig: {
      componentType: {
        type: 'WrapCommodityList',
      },
    },
  },
}

/** 组合促销 */
const Combination = {
  Combination: {
    propsConfig: {},
  },
  'Combination.Item': {
    propsConfig: {},
  },
}

/** 热门推荐 */
const CommodityWithProcess = {
  CommodityWithProcess: {
    propsConfig: {},
  },
  'CommodityWithProcess.Item': {
    propsConfig: {},
  },
}
const MobileLayout = {
  propsConfig: {
    backgroundColor: PROPS_TYPES.string,
  },
}

export default {
  MobileLayout,
  Commodity,
  Advertisement,
  ...CommodityWithProcess,
  ...Coupon,
  // View,
  ...MarketingCard,
  ...CommodityList,
  ...Combination,
  ...WrapCommodityList,
}
