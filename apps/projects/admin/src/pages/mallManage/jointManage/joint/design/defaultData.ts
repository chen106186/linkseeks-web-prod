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
    childNodes: ['1', '3', '4', '21'],
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
  key: '3',
  '3': {
    componentName: 'Header',
    canHide: true,
    props: {
      logoUrl: '',
    },
  },
}

export const mainNavConfig = {
  key: '4',
  '4': {
    componentName: 'MallMainNav',
    canHide: true,
    props: {},
  },
}

export const bannerContainer = {
  key: '21',
  '21': {
    componentName: 'View',
    canHide: true,
    props: {
      style: {
        position: 'relative',
        display: 'flex',
        paddingTop: '16px',
        width: '1200px',
        margin: '0 auto',
      },
    },
    childNodes: ['22', '23', '24'],
  },
}

export const categoryConfig = {
  key: '22',
  '22': {
    componentName: 'Category',
    props: {
      categoryList: [],
      canHide: false,
    },
  },
}

export const bannerWrap = {
  key: '23',
  '23': {
    componentName: 'View',
    props: {
      style: {
        margin: '0 16px',
        flex: 1,
        width: 0,
      },
    },
    childNodes: ['5', '6'],
  },
}

export const quickNavConfigWrap = {
  key: '24',
  '24': {
    componentName: 'View',
    props: {},
    childNodes: ['25', '26'],
  },
}

export const quickNavConfig = {
  key: '25',
  '25': {
    componentName: 'QuickNav',
    props: {},
  },
}

export const navAdvertConfig = {
  key: '26',
  '26': {
    componentName: 'Advert',
    props: {
      type: 'nav',
      linkdisable: true,
      advertList: [],
    },
  },
}

export const bannerAdvertConfig = {
  key: '5',
  '5': {
    componentName: 'Advert',
    props: {
      type: 'banner',
      hasQuickNav: false,
      linkdisable: true,
      advertList: [],
    },
  },
}

export const interactAdvertConfig = {
  key: '6',
  '6': {
    componentName: 'Advert',
    props: {
      type: 'interact',
      linkdisable: true,
      advertList: [],
    },
  },
}

export const FindMoreConfig = {
  key: '18',
  '18': {
    componentName: 'FindMore',
    canHide: true,
    props: {
      visible: true,
    },
  },
}

export const InformationConfig = {
  key: '19',
  '19': {
    componentName: 'Information',
    canHide: true,
    props: {
      visible: true,
    },
  },
}

export const FooterConfig = {
  key: '20',
  '20': {
    componentName: 'Footer',
    canHide: true,
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
