export const mallLayoutConfig = {
  key: '0',
  '0': {
    componentName: 'MallLayout',
    props: {
      style: {
        width: '100%',
        minHeight: '100%',
      },
    },
    childNodes: ['1'],
  },
}

export const platformIndexConfig = {
  key: '1',
  '1': {
    componentName: 'PlatformIndex',
    props: {},
    childNodes: [],
  },
}

export const headerConfig = {
  key: '3',
  '3': {
    componentName: 'Header',
    props: {
      type: 'platform',
    },
  },
}

export const mainNavConfig = {
  key: '4',
  '4': {
    componentName: 'MallMainNav',
    props: {},
  },
}

export const bannerContainer = {
  key: '5',
  '5': {
    componentName: 'View',
    props: {
      style: {
        position: 'relative',
        display: 'flex',
        paddingTop: '16px',
        width: '1200px',
        margin: '0 auto',
      },
    },
    childNodes: ['6', '7', '12'],
  },
}

export const categoryConfig = {
  key: '6',
  '6': {
    componentName: 'Category',
    props: {
      categoryList: [],
      canHide: false,
    },
  },
}

export const bannerWrap = {
  key: '7',
  '7': {
    componentName: 'View',
    props: {
      style: {
        flex: 1,
        padding: '0 16px',
      },
    },
    childNodes: ['8', '11'],
  },
}

export const bannerHorizontal = {
  key: '8',
  '8': {
    componentName: 'View',
    props: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
    childNodes: ['9', '10'],
  },
}

export const bannerAdvertConfig = {
  key: '9',
  '9': {
    componentName: 'PlatformAdvert',
    props: {
      type: 'banner',
      linkdisable: true,
      advertList: [],
    },
  },
}

export const bannerRightAdvertConfig = {
  key: '10',
  '10': {
    componentName: 'PlatformAdvert',
    props: {
      type: 'bannerRight',
      linkdisable: true,
      advertList: [],
    },
  },
}

export const bannerBottomAdvertConfig = {
  key: '11',
  '11': {
    componentName: 'PlatformAdvert',
    props: {
      type: 'bannerBottom',
      linkdisable: true,
      advertList: [],
    },
  },
}

export const quickNavConfigWrap = {
  key: '12',
  '12': {
    componentName: 'PlatformQuickNav',
    props: {},
  },
}

export const PlatformGoodsConfig = {
  key: '13',
  '13': {
    componentName: 'PlatformGoods',
    props: {
      dataInfo: {},
    },
  },
}

export const PlatformBrandConfig = {
  key: '14',
  '14': {
    componentName: 'PlatformBrand',
    props: {},
  },
}

export const PlatformMerchantConfig = {
  key: '15',
  '15': {
    componentName: 'PlatformMerchant',
    props: {},
  },
}

export const PlatformInformationConfig = {
  key: '16',
  '16': {
    componentName: 'PlatformInformation',
    props: {},
  },
}

export const PlatformPurchaseConfig = {
  key: '17',
  '17': {
    componentName: 'PlatformPurchase',
    props: {},
    childNodes: ['21'],
  },
}

export const PlatformLogisticsConfig = {
  key: '18',
  '18': {
    componentName: 'PlatformLogistics',
    props: {},
  },
}

export const PlatformProcessConfig = {
  key: '19',
  '19': {
    componentName: 'PlatformProcess',
    props: {},
  },
}

export const PlatformServiceConfig = {
  key: '20',
  '20': {
    componentName: 'PlatformService',
    props: {},
  },
}

export const PurchaseAdvertConfig = {
  key: '21',
  '21': {
    componentName: 'PlatformPurchase.Banner',
    props: {
      advertList: [],
    },
  },
}

export const FooterConfig = {
  key: '40',
  '40': {
    componentName: 'Footer',
    props: {
      linkdisable: true,
    },
  },
}

export const PlatformAddGoodsItemConfig = {
  key: '99',
  '99': {
    componentName: 'PlatformAddGoodsItem',
    props: {},
  },
}
