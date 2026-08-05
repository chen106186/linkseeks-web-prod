import { DesignConfigType } from '@apps/design-core'

import RED_PACKAGE from '@/assets/activity/red_package.png'

export const rootConfig = {
  componentName: 'MallLayout',
  props: {
    style: {
      width: '100%',
      minHeight: '100%',
      background: '#F7F8FA',
      overflowX: 'hidden',
      paddingBottom: '56px',
      position: 'relative',
    },
  },
  childNodes: [],
}

export const defaultDesign: DesignConfigType = {
  HeaderNav: {
    canDelete: false,
    canDrag: false,
    canEdit: false,
    hideAction: false,
    childComponentName: 'HeaderNav.ActionItem',
    props: {
      styleTheme: 0,
      categoryList: '${categoryList}',
    },
    sort: 0,
    children: [
      {
        title: '搜索框',
        componentName: 'HeaderNav.ActionItem',
        canDrag: false,
        canDelete: false,
        props: {
          name: '搜索框',
          content: '请输入商品名称',
          type: 4,
          visible: true,
        },
      },
    ],
  },
  Banner: {
    canDelete: false,
    canDrag: true,
    hideAction: true,
    childComponentName: 'Banner.Items',
    props: {
      visible: true,
      style: {
        margin: '8px',
      },
    },
    sort: 2,
    children: [],
  },
  MobileNavCard: {
    canDelete: false,
    canDrag: true,
    hideAction: true,
    childComponentName: 'MobileNavCard.NavItem',
    props: {
      style: {
        margin: '8px',
      },
      visible: true,
    },
    sort: 3,
    children: [],
  },
  SuggestProduct: {
    childComponentName: 'SuggestProduct.Items',
    canEdit: true,
    canDrag: true,
    canHide: false,
    canDelete: false,
    maxLength: 4,
    props: {
      visible: true,
    },
    childProps: {
      title: '商品容器',
      canEdit: true,
      canHide: false,
      componentName: 'SuggestProduct.Items',
      props: {},
      childComponentName: 'SuggestProduct.Commodity',
      maxLength: 50,
      childNodes: [],
    },
    sort: 7,
    children: [],
  },
  CouponsModal: {
    canEdit: true,
    canDrag: true,
    canHide: false,
    canDelete: false,
    maxLength: 4,
    props: {
      visible: true,
      style: {
        position: 'absolute',
        display: 'none',
        backgroundImage: `url(${RED_PACKAGE})`,
        width: 312,
        height: 425,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        margin: 'auto',
        zIndex: 1,
      },
    },
    sort: 998,
    childNodes: [],
    childComponentName: 'CouponsModal.CouponsItem',
  },
  BottomNavigation: {
    canDrag: false,
    canDelete: false,
    hideAction: false,
    childComponentName: 'BottomNavigation.Items',
    maxLength: 5,
    props: {},
    sort: 999,
    children: [],
  },
}
