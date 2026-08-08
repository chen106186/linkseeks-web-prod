import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const MarketingCard: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const Header: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.marketingCardHeader,
    },
  },
}

const CommonContainer: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const CollageContainer: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const PackageContainer: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const PackageContainerTabs: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.PackageContainer.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const PackageContainerTabsTabPane: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.PackageContainerTabs.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const GiveContainer: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const GiveContainerItem: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.GiveContainer.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.marketingCardGiveContainerItem,
    },
  },
}

const DetailItem: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.PackageContainer.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.marketingCardDetailItem,
    },
  },
}

const CollageContainerItem: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.CollageContainer.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.marketingCardGood,
    },
  },
}

const GoodsItem: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.CommonContainer.children', 'MarketingCard.PackageContainerTabsTabPane.children'],
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
    componentType: {
      type: PROPS_SETTING_TYPES.marketingCardGood,
    },
  },
}

const CouponsItem: ComponentSchemaType = {
  fatherNodesRule: ['MarketingCard.CommonContainer.children'],
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
  MarketingCard,
  'MarketingCard.Header': Header,
  'MarketingCard.CommonContainer': CommonContainer,
  'MarketingCard.CollageContainer': CollageContainer,
  'MarketingCard.PackageContainer': PackageContainer,
  'MarketingCard.GiveContainer': GiveContainer,
  'MarketingCard.PackageContainerTabs': PackageContainerTabs,
  'MarketingCard.PackageContainerTabsTabPane': PackageContainerTabsTabPane,
  'MarketingCard.DetailItem': DetailItem,
  'MarketingCard.CollageContainerItem': CollageContainerItem,
  'MarketingCard.GoodsItem': GoodsItem,
  'MarketingCard.CouponsItem': CouponsItem,
  'MarketingCard.GiveContainerItem': GiveContainerItem,
}
