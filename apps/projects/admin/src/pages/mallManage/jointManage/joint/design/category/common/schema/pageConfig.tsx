import React from 'react'
import { PageConfigType, PROPS_SETTING_TYPES } from '@apps/design-core'

const template = {
  '6-1': {
    componentName: 'SecondaryNavigation',
    title: '二级导航',
    addBtnText: '添加导航',
    childComponentName: 'SecondaryNavigation.Item',
    childProps: {
      otherProps: {
        type: 'secondaryItem',
      },
    },
    childNodes: [],
    otherProps: {
      type: 'secondary',
    },
  },
  '6-2': {
    componentName: 'SimpleCommodityList',
    title: '秒杀',
    addBtnText: '添加秒杀商品',
    childProps: {
      otherProps: {
        type: 'flashSaleItem',
      },
    },
    childComponentName: 'SimpleCommodityList.Item',
    props: {},
    childNodes: [],
    otherProps: {
      type: 'flashSale',
    },
  },
  '6-3': {
    componentName: 'SimpleCommodityList',
    title: '品类销量排行',
    addBtnText: '添加销量排行商品',
    childComponentName: 'SimpleCommodityList.Item',
    childProps: {
      otherProps: {
        type: 'saleRankingItem',
      },
    },
    props: {},
    childNodes: [],
    otherProps: {
      type: 'saleRanking',
    },
  },
  '6-4': {
    componentName: 'CategoryList',
    title: '品牌',
    addBtnText: '添加品牌',
    childComponentName: 'CategoryList.Item',
    childProps: {
      otherProps: { type: 'brandItem' },
    },
    props: {},
    childNodes: [],
    otherProps: {
      type: 'brand',
    },
  },
  '6-5': {
    componentName: 'ProductContainer',
    title: '商品',
    addBtnText: '添加商品',
    childComponentName: 'Product',
    props: {},
    childNodes: [],
    otherProps: { type: 'suggestProduct' },
    childProps: {
      otherProps: { type: 'suggestProductItem' },
    },
  },
}

/**
 * 以下对应的组件全部在Layout 文件夹中
 *
 */
const mallLayoutConfig: PageConfigType = {
  '0': {
    componentName: 'MallLayout',
    title: '组件树',
    props: {
      style: {
        width: '100%',
        minHeight: '100%',
        // "background": "#DD3041",
        overflowX: 'hidden',
        paddingBottom: '50px',
      },
    },
    childNodes: ['1', '4'],
  },
}

const header: PageConfigType = {
  '1': {
    componentName: 'HeaderNav',
    title: '头部',
    props: {},
    childNodes: ['2', '3'],
    canEdit: false,
    canDelete: false,
  },
  '2': {
    componentName: 'HeaderNav.ActionItem',
    title: '我的',
    canDelete: false,
    props: {
      data: {
        name: '我的',
        content: '',
        status: true,
        type: 1,
      },
    },
  },
  '3': {
    componentName: 'HeaderNav.ActionItem',
    title: '搜索框',
    canDelete: false,
    props: {
      data: {
        name: '搜索框',
        content: '灯具',
        status: true,
        type: 4,
      },
    },
  },
}

const tab: PageConfigType = {
  '4': {
    componentName: 'CustomizeTabs',
    title: 'tab',
    props: {},
    childComponentName: 'CustomizeTabs.TabItem',
    addBtnText: '添加Tab',
    childNodes: ['5'],
    childProps: {
      title: 'tab',
      props: {
        name: 'tab',
      },
      template: template,
      otherProps: {
        type: 'tabItem',
      },
    },
  },
  '5': {
    componentName: 'div',
    title: '首页',
    props: {
      name: '首页',
      disabled: true,
      // children: 123123
    },
  },
}

const tabContent: PageConfigType = {
  '6': {
    componentName: 'CustomizeTabs.TabItem',
    title: '数码',
    props: {
      tab: '数码',
      id: 1,
    },
    childNodes: ['6-1', '6-2', '6-3', '6-4', '6-5'],
  },
  '6-1': {
    componentName: 'SecondaryNavigation',
    title: '二级导航',
    addBtnText: '添加导航',
    childComponentName: 'SecondaryNavigation.Item',
    childNodes: ['6-1-1'],
  },
  '6-1-1': {
    componentName: 'SecondaryNavigation.Item',
    title: '二级导航-标签',
  },
  '6-2': {
    componentName: 'SimpleCommodityList',
    title: '秒杀',
    addBtnText: '添加秒杀商品',
    childComponentName: 'SimpleCommodityList.Item',
    props: {},
    childNodes: ['6-2-1'],
  },
  '6-2-1': {
    componentName: 'SimpleCommodityList.Item',
    title: '123',
    props: {
      // image: "https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg",
      // originalPrice: 266,
      // discount: 255
    },
  },
  '6-3': {
    componentName: 'SimpleCommodityList',
    title: '品类销量排行',
    addBtnText: '添加销量排行商品',
    childComponentName: 'SimpleCommodityList.Item',
    props: {},
    childNodes: ['6-3-1'],
  },
  '6-3-1': {
    componentName: 'SimpleCommodityList.Item',
    title: '123',
    props: {
      // image: "https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg",
      // originalPrice: 266,
      // footer: '<div>123</div>'
    },
  },
  '6-4': {
    componentName: 'CategoryList',
    title: '品牌',
    addBtnText: '添加品牌',
    childComponentName: 'CategoryList.Item',
    props: {},
    childNodes: ['6-4-1'],
  },
  '6-4-1': {
    componentName: 'CategoryList.Item',
    title: '123',
    props: {},
  },
  /** 商品 */
  '6-5': {
    componentName: 'Container',
    title: '商品',
    addBtnText: '添加商品',
    childComponentName: 'Product',
    props: {
      card: false,
      listStyle: {
        marginRight: '-8px',
        flexWrap: 'wrap',
      },
      itemStyle: {
        paddingRight: '8px',
        width: '50%',
      },
    },
    childNodes: ['6-5-1'],
  },
  '6-5-1': {
    componentName: 'Product',
    title: '商品',
    props: {},
  },
}

const configs = {
  ...mallLayoutConfig,
  ...header,
  ...tab,
  // ...tabContent,
  // ...spike,
  // ...rank,
  // ...category,
  // ...commodity,
}

export default configs
