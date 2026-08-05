import { DesignConfigType, PageConfigType } from '@apps/design-core'
import { getIntl } from '@linkseeks/i18n'
import categoryNavTemplateDefault from './img/category_template_default.png'
import RED_PACKAGE from './img/red_package.png'

const intl = getIntl()

export const rootConfig = {
  componentName: 'LocaleProvide',
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

export const shopLayoutConfig: PageConfigType = {
  '0': {
    componentName: 'LocaleProvide',
    props: {
      style: {
        width: '100%',
        minHeight: '100%',
        background: '#F7F8FA',
        overflowX: 'hidden',
        paddingBottom: '50px',
      },
    },
    childNodes: ['1', '2', '4'],
  },
  '1': {
    componentName: 'MobileShopHeader',
    canDelete: false,
    props: {
      shopInfo: '${shopInfo}',
      backdrop: '${backdrop}',
    },
    title: intl.formatMessage({ id: 'editor.template.shop.backdrop' }),
  },
  '2': {
    title: intl.formatMessage({ id: 'editor.template.channel.nav.title' }),
    canDelete: false,
    hideAction: true,
    componentName: 'MobileNavCard',
    props: {
      style: {
        margin: '8px',
      },
      status: true,
      stylesthemelist: [
        {
          key: 0,
          width: 320,
          height: 148,
          img: categoryNavTemplateDefault,
        },
      ],
    },
    childNodes: ['3'],
    childComponentName: 'MobileNavCard.NavItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.nav' }),
  },
  '3': {
    loop: '${navList}',
    title: '${item.name}',
    componentName: 'MobileNavCard.NavItem',
    props: {
      id: '${item.id}',
      name: '${item.name}',
      type: '${item.type}',
      url: '${item.url}',
      icon: '${item.icon}',
      empty: false,
    },
  },
  '4': {
    title: intl.formatMessage({ id: 'editor.template.channel.banner.title' }),
    canDelete: false,
    componentName: 'Banner',
    props: {
      style: {
        margin: '8px',
      },
    },
    childNodes: ['5'],
    childComponentName: 'Banner.Items',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.advert' }),
  },
  '5': {
    loop: '${advert}',
    title: '${item.name}',
    componentName: 'Banner.Items',
    props: {
      id: '${item.id}',
      type: '${item.type}',
      img: '${item.img}',
      name: '${item.name}',
      isnull: false,
    },
  },
}

export const defaultConfig: PageConfigType = {
  '6': {
    componentName: 'MobileShopCommodity',
    title: intl.formatMessage({ id: 'editor.template.channel.product.title' }),
    canDelete: false,
    props: {},
    childNodes: ['7'],
    childComponentName: 'MobileShopCommodity.Item',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.product' }),
  },
  '7': {
    loop: '${commodityList}',
    componentName: 'MobileShopCommodity.Item',
    title: '${item.title}',
    props: {
      title: '${item.title}',
      categoryId: '${item.categoryId}',
      idList: '${item.idList}',
      manageWay: '${item.manageWay}',
      dataList: '${item.dataList}',
      num: '${item.num}',
    },
  },
  '9': {
    title: intl.formatMessage({ id: 'editor.template.channel.bottom.title' }),
    canDelete: false,
    componentName: 'BottomNavigation',
    props: {},
    childNodes: ['10'],
    childComponentName: 'BottomNavigation.Items',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.label' }),
    maxLength: 5,
  },
  '10': {
    loop: '${bottom}',
    title: '${item.name}',
    componentName: 'BottomNavigation.Items',
    props: {
      defaultIcon: '${item.defaultIcon}',
      selectIcon: '${item.selectIcon}',
      name: '${item.name}',
      type: '${item.type}',
      isnull: false,
    },
  },
}

export const couponsModalConfig = {
  '13': {
    title: intl.formatMessage({ id: 'editor.template.channel.coupons.title' }),
    componentName: 'CouponsModal',
    props: {
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
    childNodes: [],
    childComponentName: 'CouponsModal.CouponsItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.coupons' }),
    canEdit: true,
    canHide: false,
    canDelete: false,
    canDrag: false,
  },
}

export const defaultDesign: DesignConfigType = {
  MobileShopHeader: {
    canDelete: false,
    canDrag: false,
    hideAction: false,
    firstLevel: true,
    props: {
      shopInfo: '${shopInfo}',
      backdrop: '${backdrop}',
    },
    sort: 0,
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
      stylesthemelist: [
        {
          key: 0,
          width: 320,
          height: 148,
          img: categoryNavTemplateDefault,
        },
      ],
    },
    sort: 2,
    children: [],
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
    sort: 3,
    children: [],
  },
  MobileShopCommodity: {
    childComponentName: 'MobileShopCommodity.Item',
    canEdit: true,
    canDrag: true,
    canHide: false,
    canDelete: false,
    props: {
      visible: true,
    },
    sort: 6,
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
