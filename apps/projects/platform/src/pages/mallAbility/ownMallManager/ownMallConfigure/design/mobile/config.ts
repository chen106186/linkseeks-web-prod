/*
 * @Author: ghua
 * @Date: 2021-02-22 17:02:20
 * @LastEditTime: 2022-02-17 14:13:58
 * @LastEditors: GHua
 * @Description: In User Settings Edit
 * @FilePath: /lingxi-business-paltform/src/pages/mobileTemplate/channelTemplateEdit/config.ts
 */
import { PageConfigType, DesignConfigType } from '@apps/design-core'
import { getIntl } from '@linkseeks/i18n'
import categoryNavTemplateDefault from './imgs/category_template_default.png'
import RED_PACKAGE from './imgs/red_package.png'

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

export const channelLayoutConfig: PageConfigType = {
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
    childNodes: ['1', '3', '5', '7'],
  },
  '1': {
    title: intl.formatMessage({ id: 'editor.template.channel.header.title' }),
    canDelete: false,
    componentName: 'ChannelHeaderNav',
    canEdit: false,
    props: {
      styleTheme: '${topStyle}',
      title: '${channelName}',
      categoryList: '${categoryList}',
    },
    childComponentName: 'ChannelHeaderNav.ActionItem',
  },
  '3': {
    title: intl.formatMessage({ id: 'editor.template.channel.banner.title' }),
    canDelete: false,
    componentName: 'Banner',
    props: {
      style: {
        margin: '8px',
      },
    },
    childNodes: ['4'],
    childComponentName: 'Banner.Items',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.advert' }),
  },
  '4': {
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
  '5': {
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
    childNodes: ['6'],
    childComponentName: 'MobileNavCard.NavItem',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.nav' }),
  },
  '6': {
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
  '7': {
    title: intl.formatMessage({ id: 'editor.template.channel.information.title' }),
    canDelete: false,
    componentName: 'InformationCard',
    props: {
      title: '${informationTitle}',
    },
    childNodes: [],
    canEdit: false,
    addBtnText: intl.formatMessage({ id: 'editor.template.add.information' }),
  },
}

export const defaultConfig: PageConfigType = {
  '14': {
    title: intl.formatMessage({ id: 'editor.template.channel.bottom.title' }),
    canDelete: false,
    componentName: 'BottomNavigation',
    props: {},
    childNodes: ['15'],
    childComponentName: 'BottomNavigation.Items',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.label' }),
    maxLength: 5,
  },
  '15': {
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

export const brandListConfig = {
  '16': {
    title: intl.formatMessage({ id: 'editor.template.own.brand.title' }),
    componentName: 'MobileBrand',
    hideAction: true,
    props: {
      status: true,
      style: {
        margin: '0 8px 8px 8px',
      },
    },
    childNodes: ['17', '18'],
  },
  '17': {
    title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
    componentName: 'MobileBrand.Header',
    props: {
      title: intl.formatMessage({ id: 'editor.template.own.brand.header.title' }),
      explain: intl.formatMessage({ id: 'editor.template.own.brand.header.explain' }),
    },
    childNodes: [],
  },
  '18': {
    title: intl.formatMessage({ id: 'editor.template.own.brand.list' }),
    componentName: 'MobileBrand.List',
    props: {
      brandIds: [],
      brandList: [],
      style: {
        paddingBottom: 12,
      },
    },
    childNodes: [],
  },
}

export const suggestProductConfig = {
  '12': {
    title: intl.formatMessage({ id: 'editor.template.channel.product.title' }),
    canDelete: false,
    componentName: 'SuggestProduct',
    props: {},
    childNodes: [],
    childComponentName: 'SuggestProduct.Items',
    addBtnText: intl.formatMessage({ id: 'editor.template.add.category' }),
    canEdit: true,
    canHide: false,
    maxLength: 4,
    childProps: {
      title: intl.formatMessage({ id: 'editor.template.goods.container' }),
      canEdit: true,
      canHide: false,
      componentName: 'SuggestProduct.Items',
      props: {},
      childComponentName: 'SuggestProduct.Commodity',
      maxLength: 50,
      // addBtnText: '添加商品',
      childNodes: [],
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
// https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/home_default_icon@2x53811228510b478b982e930f3abd311c.png
// https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/home_select_icon61bb51708e454013bf26126b8ccca779.png

export const defaultDesign: DesignConfigType = {
  ChannelHeaderNav: {
    canDelete: false,
    canDrag: false,
    canEdit: false,
    hideAction: false,
    firstLevel: true,
    props: {
      styleTheme: 0,
      title: '${mallName}',
      categoryList: '${categoryList}',
    },
    sort: 0,
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
      stylesthemelist: [
        {
          key: 0,
          width: 320,
          height: 148,
          img: categoryNavTemplateDefault,
        },
      ],
    },
    sort: 3,
    children: [],
  },
  InformationCard: {
    firstLevel: true,
    hideAction: true,
    canEdit: false,
    canDelete: false,
    canDrag: true,
    props: {
      title: '${informationTitle}',
      visible: true,
    },
    sort: 5,
    children: [],
  },
  MobileBrand: {
    hideAction: true,
    canDelete: false,
    canDrag: true,
    props: {
      visible: true,
    },
    sort: 6,
    children: [
      {
        title: intl.formatMessage({ id: 'editor.marketing.activity_title' }),
        componentName: 'MobileBrand.Header',
        canDelete: false,
        props: {
          title: intl.formatMessage({ id: 'editor.template.own.brand.header.title' }),
          explain: intl.formatMessage({ id: 'editor.template.own.brand.header.explain' }),
        },
      },
      {
        title: intl.formatMessage({ id: 'editor.template.own.brand.list' }),
        componentName: 'MobileBrand.List',
        canDelete: false,
        props: {
          brandIds: [],
          brandList: [],
          style: {
            paddingBottom: 12,
          },
        },
      },
    ],
  },
  SuggestProduct: {
    childComponentName: 'SuggestProduct.Items',
    canEdit: true,
    canDrag: false,
    canHide: false,
    canDelete: false,
    maxLength: 4,
    props: {
      visible: true,
    },
    childProps: {
      title: intl.formatMessage({ id: 'editor.template.goods.container' }),
      canEdit: true,
      canHide: false,
      componentName: 'SuggestProduct.Items',
      props: {},
      childComponentName: 'SuggestProduct.Commodity',
      maxLength: 50,
      childNodes: [],
    },
    sort: 997,
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
