import { PROPS_SETTING_TYPES } from '@apps/design-core'
import { MARKETING_COMPONENTS_NAMES } from '@apps/design-ui'

export const marketingConfig1 = {
  '11-1': {
    title: '活动-特价促销',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.SpecialOffer,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-1-1', '11-1-2'],
  },
  '11-1-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 1,
    },
  },
  '11-1-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig2 = {
  '11-2': {
    title: '活动-直降促销',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Plummet,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-2-1', '11-2-2'],
  },
  '11-2-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 2,
    },
  },
  '11-2-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig3 = {
  '11-3': {
    title: '活动-满量减',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullQuantitySub,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-3-1', '11-3-2'],
  },
  '11-3-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 3,
    },
  },
  '11-3-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 4,
      exType: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig4 = {
  '11-4': {
    title: '活动-折扣促销',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Discount,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-4-1', '11-4-2'],
  },
  '11-4-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 4,
    },
  },
  '11-4-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 3,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig5 = {
  '11-5': {
    title: '活动-满量折',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullQuantityDiscount,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-5-1', '11-5-2'],
  },
  '11-5-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 5,
    },
  },
  '11-5-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 4,
      exType: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig6 = {
  '11-6': {
    title: '活动-满额减',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullMoneySub,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-6-1', '11-6-2'],
  },
  '11-6-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 6,
    },
  },
  '11-6-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 5,
      exType: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig7 = {
  '11-7': {
    title: '活动-满额折',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullMoneyDiscount,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-7-1', '11-7-2'],
  },
  '11-7-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 7,
    },
  },
  '11-7-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 5,
      exType: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig8 = {
  '11-8': {
    title: '活动-赠商品',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.GiveProduct,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-8-1', '11-8-2'],
  },
  '11-8-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 8,
    },
  },
  '11-8-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.GiveContainer',
    maxLength: 3,
    props: {
      type: 6,
      exType: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GiveContainerItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig9 = {
  '11-9': {
    title: '活动-赠优惠券',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.GiveCoupon,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-9-1', '11-9-2'],
  },
  '11-9-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 9,
    },
  },
  '11-9-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.GiveContainer',
    props: {
      type: 6,
      exType: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GiveContainerItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig10 = {
  '11-10': {
    title: '活动-多件促销',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.MorePiece,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-10-1', '11-10-2'],
  },
  '11-10-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 10,
    },
  },
  '11-10-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 7,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig11 = {
  '11-11': {
    title: '活动-组合促销',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Combination,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-11-1', '11-11-2'],
  },
  '11-11-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 11,
    },
  },
  '11-11-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 8,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig12 = {
  '11-12': {
    title: '活动-秒杀',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.SecKill,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-12-1', '11-12-2'],
  },
  '11-12-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 12,
    },
  },
  '11-12-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 12,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig13 = {
  '11-13': {
    title: '活动-拼团',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.GroupPurchase,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-13-1', '11-13-2'],
  },
  '11-13-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 13,
    },
  },
  '11-13-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CollageContainer',
    props: {
      type: 9,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.CollageContainerItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig14 = {
  '11-14': {
    title: '活动-满额换购',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullSwap,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-14-1', '11-14-2'],
  },
  '11-14-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 14,
    },
  },
  '11-14-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 13,
      exType: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig15 = {
  '11-15': {
    title: '活动-买商品换购',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.BuySwap,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-15-1', '11-15-2'],
  },
  '11-15-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 15,
    },
  },
  '11-15-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 13,
      exType: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig16 = {
  '11-16': {
    title: '活动-预售',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.PreSale,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-16-1', '11-16-2'],
  },
  '11-16-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 16,
    },
  },
  '11-16-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 14,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig17 = {
  '11-17': {
    title: '活动-试用',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Attempt,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-17-1', '11-17-2'],
  },
  '11-17-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 17,
    },
  },
  '11-17-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 16,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}

export const marketingConfig18 = {
  '11-18': {
    title: '活动-套餐',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.SetMeal,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-18-1', '11-18-2'],
  },
  '11-18-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 18,
    },
  },
  '11-18-2': {
    title: '套餐容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.PackageContainer',
    props: {
      type: 15,
    },
    childNodes: ['11-18-2-1', '11-18-2-2'],
  },
  '11-18-2-1': {
    title: '主购商品',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.DetailItem',
    props: {
      detailType: 'package',
      style: {
        margin: '12px 12px 0 12px',
      },
    },
  },
  '11-18-2-2': {
    title: '套餐子容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.PackageContainerTabs',
    props: {
      style: {
        margin: '0 12px',
      },
    },
    childComponentName: 'MarketingCard.PackageContainerTabsTabPane',
    // addBtnText: '添加子套餐',
    childNodes: [],
    childProps: {
      title: '子套餐容器',
      canEdit: false,
      canHide: false,
      canDelete: false,
      canDrag: false,
      componentName: 'MarketingCard.PackageContainerTabsTabPane',
      props: {
        title: '套餐',
        containerScorll: true,
        type: 15,
      },
      childComponentName: 'MarketingCard.GoodsItem',
      // addBtnText: '添加商品',
      childNodes: [],
    },
  },
}

export const marketingConfig19 = {
  '11-19': {
    title: '活动-砍价',
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Bargain,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['11-19-1', '11-19-2'],
  },
  '11-19-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: '标题栏',
    componentName: 'MarketingCard.Header',
    props: {
      type: 19,
    },
  },
  '11-19-2': {
    title: '活动商品容器',
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.CommonContainer',
    maxLength: 3,
    props: {
      type: 11,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: '添加商品',
  },
}
