export const mallLayoutConfig = {
  key: '0',
  '0': {
    componentName: 'LocaleProvide',
    props: {
      style: {
        width: '100%',
        minHeight: '100%',
        background: '#FFF',
      },
    },
    childNodes: ['1', '2', '3'],
  },
}

export const topBarConfig = {
  key: '1',
  '1': {
    componentName: 'TopBar',
    canHide: true,
    props: {
      linkdisable: true,
    },
  },
}

export const headerConfig = {
  key: '2',
  '2': {
    componentName: 'ShopHeader',
    canHide: true,
    props: {
      shopInfo: {},
      logoUrl: '',
    },
  },
}

export const mainNavConfig = {
  key: '3',
  '3': {
    componentName: 'MainNav',
    canHide: true,
    props: {},
  },
}

export const bannerAdvertConfig = {
  key: '4',
  '4': {
    componentName: 'CarouselBanner',
    props: {
      linkdisable: true,
      canDelete: true,
      showType: 'fullscreen',
      componentHeight: 460,
    },
  },
}

export const CompanyInfoConfig = {
  key: '95',
  '95': {
    componentName: 'CompanyInfo',
    props: {
      visible: true,
    },
  },
}

export const AlbumConfig = {
  key: '96',
  '96': {
    componentName: 'Album',
    props: {
      visible: true,
    },
  },
}

export const HonroPicConfig = {
  key: '97',
  '97': {
    componentName: 'HonroPic',
    props: {
      visible: true,
    },
  },
}

export const FooterConfig = {
  key: '98',
  '98': {
    componentName: 'Footer',
    canHide: true,
    canEdit: false,
    props: {
      linkdisable: true,
    },
  },
}

export const AddComponentButton = {
  key: '99',
  '99': {
    componentName: 'AddComponentButton',
    canHide: true,
    props: {},
  },
}
