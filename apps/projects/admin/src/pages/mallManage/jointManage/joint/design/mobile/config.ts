import { PROPS_SETTING_TYPES, DesignConfigType, PageConfigType } from '@apps/design-core'
import { resolveMappingPageConfig } from '@apps/design-react'
import styleThemeImgDefault from './imgs/style_theme_default.png'
import styleThemeImgScience from './imgs/style_theme_science.png'
import categoryNavTemplateDefault from './imgs/category_template_default.png'
import showCaseTemplateDefault from './imgs/showcase_template_default.jpg'
import recommendShopTemplateDefault from './imgs/recommend_shop_template_default.jpg'
import RED_PACKAGE from '@/assets/activity/red_package.png'

export const defaultHeaderNavData = [
  {
    name: '我的',
    content: '',
    visible: true,
    type: 1,
  },
  {
    name: '购物车',
    content: '',
    visible: true,
    type: 2,
  },
  {
    name: '客服',
    content: '',
    visible: true,
    type: 3,
  },
  {
    name: '搜索框',
    content: '灯具',
    visible: true,
    type: 4,
  },
]

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

export const defaultConfig: PageConfigType = {
  '0': {
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
    childNodes: ['1', '3', '5', '7', '9', '10', '12', '22'],
  },
  '1': {
    title: '头部导航栏',
    componentName: 'HeaderNav',
    canDelete: false,
    canDrag: false,
    hideAction: false,
    props: {
      styleTheme: '${topStyle}',
      categoryList: '${categoryList}',
      stylesthemelist: [
        {
          key: 0,
          img: styleThemeImgDefault,
        },
        {
          key: 1,
          img: styleThemeImgScience,
        },
      ],
    },
    childNodes: ['2'],
    childComponentName: 'HeaderNav.ActionItem',
  },
  '2': {
    loop: '${top}',
    title: '${item.name}',
    hideActions: true,
    componentName: 'HeaderNav.ActionItem',
    props: {
      name: '${item.name}',
      content: '${item.content}',
      visible: '${item.visible}',
      type: '${item.type}',
    },
  },
  '3': {
    title: '广告图',
    componentName: 'Banner',
    canDelete: false,
    canDrag: true,
    hideAction: true,
    props: {
      visible: true,
      style: {
        margin: '8px',
      },
    },
    childNodes: ['4'],
    childComponentName: 'Banner.Items',
    addBtnText: '添加广告',
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
    title: '分类导航',
    componentName: 'MobileNavCard',
    canDelete: false,
    canDrag: true,
    hideAction: true,
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
    childNodes: ['6'],
    childComponentName: 'MobileNavCard.NavItem',
    addBtnText: '添加导航',
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
    title: '橱窗广告',
    componentName: 'ShowCaseBanner',
    canDelete: false,
    hideAction: true,
    canDrag: true,
    childComponentName: 'ShowCaseBanner.Item',
    props: {
      visible: true,
      stylesthemelist: [
        {
          key: 0,
          width: 152,
          height: 105,
          img: showCaseTemplateDefault,
        },
      ],
    },
    addBtnText: '添加橱窗',
    maxLength: 4,
    childNodes: ['8'],
  },
  '8': {
    loop: '${showCase}',
    title: '${item.name}',
    componentName: 'ShowCaseBanner.Item',
    // childComponentName: 'RecommendShop.Item',
    // addBtnText: '添加店铺',
    props: {
      name: '${item.name}',
      banner: '${item.banner}',
      inner: '${item.inner}',
      type: '${item.type}',
      id: '${item.id}',
      dataList: '${item.dataList}',
    },
  },
  '9': {
    title: '资讯',
    componentName: 'InformationCard',
    props: {
      title: '${informationTitle}',
      visible: true,
    },
    firstLevel: true,
    hideAction: true,
    canEdit: false,
    canDelete: false,
    addBtnText: '添加资讯',
  },
  '10': {
    title: '店铺推荐',
    componentName: 'RecommendShop',
    props: {
      stylesthemelist: [
        {
          key: 0,
          width: 320,
          height: 204,
          img: recommendShopTemplateDefault,
        },
      ],
    },
    childNodes: ['11'],
    canDrag: true,
    canDelete: false,
    childComponentName: 'RecommendShop.Item',
    addBtnText: '添加店铺',
    maxLength: 3,
  },
  '11': {
    loop: '${recommendShops}',
    title: '${item.name}',
    componentName: 'RecommendShop.Item',
    props: {
      id: '${item.id}',
      registerYears: '${item.registerYears}',
      creditPoint: '${item.creditPoint}',
      memberName: '${item.name}',
      logo: '${item.logo}',
      productList: '${item.productList}',
      productIds: '${item.productIds}',
      memberId: '${item.memberId}',
      roleId: '${item.roleId}',
    },
  },
  '12': {
    title: '优质推荐',
    componentName: 'SuggestProduct',
    props: {
      visible: true,
    },
    childNodes: [],
    childComponentName: 'SuggestProduct.Items',
    addBtnText: '添加分类',
    canEdit: true,
    canDrag: true,
    canHide: false,
    canDelete: false,
    maxLength: 4,
    childProps: {
      title: '',
      canEdit: true,
      canHide: false,
      componentName: 'SuggestProduct.Items',
      props: {},
      childComponentName: 'SuggestProduct.Commodity',
      maxLength: 50,
      childNodes: [],
    },
  },
  '22': {
    title: '底部标签栏',
    componentName: 'BottomNavigation',
    props: {},
    canDrag: false,
    canDelete: false,
    hideAction: false,
    childNodes: ['23'],
    childComponentName: 'BottomNavigation.Items',
    addBtnText: '添加标签',
    maxLength: 5,
  },
  '23': {
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

export const defaultDesign: DesignConfigType = {
  HeaderNav: {
    canDelete: false,
    canDrag: false,
    hideAction: false,
    childComponentName: 'HeaderNav.ActionItem',
    props: {
      styleTheme: 0,
      categoryList: '${categoryList}',
      stylesthemelist: [
        {
          key: 0,
          img: styleThemeImgDefault,
        },
        {
          key: 1,
          img: styleThemeImgScience,
        },
      ],
    },
    sort: 0,
    children: [
      {
        title: '我的',
        hideAction: true,
        componentName: 'HeaderNav.ActionItem',
        props: {
          name: '我的',
          content: '',
          type: 1,
          visible: false,
        },
      },
      {
        title: '购物车',
        hideAction: true,
        componentName: 'HeaderNav.ActionItem',
        props: {
          name: '购物车',
          content: '',
          type: 2,
          visible: false,
        },
      },
      {
        title: '客服',
        hideAction: true,
        componentName: 'HeaderNav.ActionItem',
        props: {
          name: '客服',
          content: '',
          type: 3,
          visible: false,
        },
      },
      {
        title: '搜索框',
        hideAction: true,
        canDrag: false,
        canDelete: false,
        componentName: 'HeaderNav.ActionItem',
        props: {
          name: '搜索框',
          content: '请输入商品名称或者店铺关键词',
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
  ShowCaseBanner: {
    canDelete: false,
    hideAction: true,
    canDrag: true,
    childComponentName: 'ShowCaseBanner.Item',
    maxLength: 4,
    props: {
      visible: true,
      stylesthemelist: [
        {
          key: 0,
          width: 152,
          height: 105,
          img: showCaseTemplateDefault,
        },
      ],
    },
    sort: 4,
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
  RecommendShop: {
    canDrag: true,
    canDelete: false,
    hideAction: true,
    childComponentName: 'RecommendShop.Item',
    maxLength: 3,
    props: {
      visible: true,
      stylesthemelist: [
        {
          key: 0,
          width: 320,
          height: 204,
          img: recommendShopTemplateDefault,
        },
      ],
    },
    sort: 6,
    children: [],
  },
  SuggestProduct: {
    childComponentName: 'SuggestProduct.Items',
    canEdit: true,
    canDrag: false,
    canHide: false,
    canDelete: false,
    hideAction: true,
    maxLength: 4,
    props: {
      visible: true,
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
