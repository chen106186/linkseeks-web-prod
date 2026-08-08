import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'

export const mallLayoutConfig = {
  key: '0',
  '0': {
    componentName: 'LocaleProvide',
    props: {
      backgroundColor: '#F5F6F7',
      style: {
        width: '100%',
        minHeight: '100%',
      },
    },
    childNodes: ['1', '2', '3', '5'],
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
    componentName: 'Header',
    canHide: true,
    props: {
      logoUrl: '',
      type: 'own',
    },
  },
}

export const mainNavConfig = {
  key: '3',
  '3': {
    componentName: 'OwnMainNav',
    canHide: true,
    canEdit: false,
    props: {
      type: LAYOUT_TYPE.cpecialPage,
    },
  },
}

export const FooterConfig = {
  key: '21',
  '21': {
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
