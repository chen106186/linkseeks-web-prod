import { PROPS_SETTING_TYPES } from '@apps/design-core'
import { MARKETING_COMPONENTS_NAMES } from '@apps/design-ui'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const marketingConfig = {
  '11': {
    title: intl.formatMessage({ id: 'editor.marketing.activity' }),
    componentName: 'View',
    props: {
      style: {
        width: '100%',
      },
    },
    childNodes: ['11-1'],
  },
}

export const marketingConfig_1 = {
  '11-1': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_1',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.SpecialOffer,
      style: {
        margin: '8px',
      },
      shopColorType: 1,
    },
    childNodes: ['11-1-1', '11-1-2'],
  },
  '11-1-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 1,
    },
  },
  '11-1-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_2 = {
  '11-2': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_2',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Plummet,
      style: {
        margin: '8px',
      },
      shopColorType: 2,
    },
    childNodes: ['11-2-1', '11-2-2'],
  },
  '11-2-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 2,
    },
  },
  '11-2-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_3 = {
  '11-3': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_3',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullQuantitySub,
      style: {
        margin: '8px',
      },
      shopColorType: 4,
    },
    childNodes: ['11-3-1', '11-3-2'],
  },
  '11-3-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 3,
    },
  },
  '11-3-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 4,
      exType: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_4 = {
  '11-4': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_4',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Discount,
      style: {
        margin: '8px',
      },
      shopColorType: 3,
    },
    childNodes: ['11-4-1', '11-4-2'],
  },
  '11-4-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 4,
    },
  },
  '11-4-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 3,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_5 = {
  '11-5': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_5',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullQuantityDiscount,
      style: {
        margin: '8px',
      },
      shopColorType: 5,
    },
    childNodes: ['11-5-1', '11-5-2'],
  },
  '11-5-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 5,
    },
  },
  '11-5-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 4,
      exType: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_6 = {
  '11-6': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_6',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullMoneySub,
      style: {
        margin: '8px',
      },
      shopColorType: 6,
    },
    childNodes: ['11-6-1', '11-6-2'],
  },
  '11-6-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 6,
    },
  },
  '11-6-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 5,
      exType: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_7 = {
  '11-7': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_7',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullMoneyDiscount,
      style: {
        margin: '8px',
      },
      shopColorType: 7,
    },
    childNodes: ['11-7-1', '11-7-2'],
  },
  '11-7-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 7,
    },
  },
  '11-7-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 5,
      exType: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_8 = {
  '11-8': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_8',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.GiveProduct,
      style: {
        margin: '8px',
      },
      shopColorType: 8,
    },
    childNodes: ['11-8-1', '11-8-2'],
  },
  '11-8-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 8,
    },
  },
  '11-8-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.GiveContainer',
    maxLength: 3,
    props: {
      type: 6,
      exType: 1,
      style: {
        backgroundColor: '#FFF',
      },
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GiveContainerItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_9 = {
  '11-9': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_9',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.GiveCoupon,
      style: {
        margin: '8px',
      },
      shopColorType: 6,
    },
    childNodes: ['11-9-1', '11-9-2'],
  },
  '11-9-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 9,
    },
  },
  '11-9-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.GiveContainer',
    props: {
      type: 6,
      exType: 2,
      style: {
        backgroundColor: '#FFF',
      },
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GiveContainerItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_10 = {
  '11-10': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_10',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.MorePiece,
      style: {
        margin: '8px',
      },
      shopColorType: 7,
    },
    childNodes: ['11-10-1', '11-10-2'],
  },
  '11-10-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    componentType: PROPS_SETTING_TYPES.marketingCardHeader,
    props: {
      type: 10,
    },
  },
  '11-10-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 7,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_11 = {
  '11-11': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_11',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Combination,
      style: {
        margin: '8px',
      },
      shopColorType: 8,
    },
    childNodes: ['11-11-1', '11-11-2'],
  },
  '11-11-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 11,
    },
  },
  '11-11-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    props: {
      type: 8,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_12 = {
  '11-12': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_12',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.SecKill,
      style: {
        margin: '8px',
      },
      shopColorType: 12,
    },
    childNodes: ['11-12-1', '11-12-2'],
  },
  '11-12-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 12,
      countDown: ['10', '08', '07'],
    },
  },
  '11-12-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 12,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

// 拼团
export const marketingConfig_13 = {
  '11-13': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_13',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.GroupPurchase,
      style: {
        margin: '8px',
      },
      shopColorType: 9,
    },
    childNodes: ['11-13-1', '11-13-2'],
  },
  '11-13-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 13,
    },
  },
  '11-13-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    props: {
      type: 9,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.DetailItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_14 = {
  '11-14': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_14',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.FullSwap,
      style: {
        margin: '8px',
      },
      shopColorType: 13,
    },
    childNodes: ['11-14-1', '11-14-2'],
  },
  '11-14-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 14,
    },
  },
  '11-14-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 13,
      exType: 1,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_15 = {
  '11-15': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_15',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.BuySwap,
      style: {
        margin: '8px',
      },
      shopColorType: 13,
    },
    childNodes: ['11-15-1', '11-15-2'],
  },
  '11-15-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 15,
    },
  },
  '11-15-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 13,
      exType: 2,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_16 = {
  '11-16': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_16',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.PreSale,
      style: {
        margin: '8px',
      },
      shopColorType: 14,
    },
    childNodes: ['11-16-1', '11-16-2'],
  },
  '11-16-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 16,
    },
  },
  '11-16-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 14,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_17 = {
  '11-17': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_17',
    })}`,
    componentName: 'MarketingCard',
    props: {
      type: MARKETING_COMPONENTS_NAMES.Attempt,
      style: {
        margin: '8px',
      },
      shopColorType: 16,
    },
    childNodes: ['11-17-1', '11-17-2'],
  },
  '11-17-1': {
    canEdit: true,
    canDelete: false,
    canDrag: false,
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 17,
    },
  },
  '11-17-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 16,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}

export const marketingConfig_18 = {
  '11-18': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_18',
    })}`,
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
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 18,
    },
  },
  '11-18-2': {
    title: intl.formatMessage({ id: 'editor.template.meal.container' }),
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
    title: intl.formatMessage({ id: 'editor.template.goods.main' }),
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
    title: intl.formatMessage({ id: 'editor.template.meal.subcontainer' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.PackageContainerTabs',
    props: {
      style: {
        margin: '0 12px',
      },
      shopColorType: 15,
    },
    childComponentName: 'MarketingCard.PackageContainerTabsTabPane',
    // addBtnText: '添加子套餐',
    childNodes: [],
    childProps: {
      title: intl.formatMessage({ id: 'editor.template.meal.subcontainer' }),
      canEdit: false,
      canHide: false,
      componentName: 'MarketingCard.PackageContainerTabsTabPane',
      props: {
        title: intl.formatMessage({ id: 'editor.marketing.meal' }),
        containerScorll: true,
        type: 15,
      },
      childComponentName: 'MarketingCard.GoodsItem',
      // addBtnText: '添加商品',
      childNodes: [],
    },
  },
}

export const marketingConfig_19 = {
  '11-19': {
    title: `${intl.formatMessage({ id: 'editor.marketing.activity' })}-${intl.formatMessage({
      id: 'editor.marketing.type_title_19',
    })}`,
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
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MarketingCard.ShopHeader',
    props: {
      type: 19,
    },
  },
  '11-19-2': {
    title: intl.formatMessage({ id: 'editor.template.activity.goods.container' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
    componentName: 'MarketingCard.VerticalContainer',
    maxLength: 3,
    props: {
      type: 11,
    },
    childNodes: [],
    childComponentName: 'MarketingCard.GoodsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
}
