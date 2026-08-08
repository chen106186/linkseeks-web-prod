import type { ComponentSchemaType } from '@apps/design-core'
import { PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const View: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: `${intl.formatMessage({ id: 'marketingAbility.neirong' })}`,
      type: PROPS_TYPES.string,
    },
  },
}

const Advertisement: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      type: 'Advertisement' as any,
    },
    imageUrl: {
      label: `${intl.formatMessage({ id: 'marketingAbility.tupianlianjie' })}`,
      type: PROPS_TYPES.string,
    },
    style: {
      label: `${intl.formatMessage({ id: 'marketingAbility.yangshi' })}`,
      type: PROPS_TYPES.object,
    },
  },
}

const Coupon = {
  Coupon: {
    propsConfig: {
      children: {
        label: `${intl.formatMessage({ id: 'marketingAbility.neirong' })}`,
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
        label: `${intl.formatMessage({ id: 'marketingAbility.neirong' })}`,
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
        label: `${intl.formatMessage({ id: 'marketingAbility.youhuiquan' })}`,
        type: PROPS_SETTING_TYPES.category,
      },
    },
  },
}

const Commodity = {
  propsConfig: {
    children: {
      label: `${intl.formatMessage({ id: 'marketingAbility.wenbenneirong' })}`,
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
  View,
  ...CommodityWithProcess,
  ...Coupon,
  ...MarketingCard,
  ...CommodityList,
  ...WrapCommodityList,
  ...Combination,
}
