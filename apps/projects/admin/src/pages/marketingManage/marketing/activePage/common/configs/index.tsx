import { getOssUrlPath } from '@apps/constants'
import type { PageConfigType } from '@apps/design-core'

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
        background: '#DD3041',
        overflowX: 'hidden',
        paddingBottom: '50px',
      },
    },
    childNodes: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
    ],
  },
}

const divWrap: PageConfigType = {
  '1': {
    componentName: 'Advertisement',
    dataIndex: 'top',
    title: '广告图',
    canEdit: true,
    canDelete: false,
    props: {
      style: {
        height: '176px',
        width: '100%',
      },
      // imageUrl: getOssUrlPath("/irregular/4f0f6362b2a348b993cc3139030356021611023985966.png")
    },
  },
}

const couponContainer: PageConfigType = {
  '2': {
    dataIndex: 'coupon',
    componentName: 'Coupon',
    title: '优惠券容器',
    canEdit: true,
    canDelete: false,
    props: {},
    childNodes: ['2-1'],
    childComponentName: 'Coupon.Item',
    addBtnText: '添加优惠券',
  },
  '2-1': {
    componentName: 'Coupon.Item',
    title: '优惠券',
    canEdit: true,
    canHide: false,
    props: {},
  },
}

/** 活动推荐 */
const activityContainer: PageConfigType = {
  '3': {
    dataIndex: 'hot',
    componentName: 'CommodityList',
    title: '活动推荐',
    canDelete: false,
    props: {
      title: '活动推荐',
      theme: 0,
    },
    // childNodes: ['3-1'],
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    childProps: {
      title: '活动推荐商品',
    },
    otherProps: {
      dataIndex: 'hot',
    },
  },
  '3-1': {
    componentName: 'CommodityList.Item',
    title: '活动推荐商品',
    props: {},
  },
  '4': {
    canDelete: false,
    dataIndex: 'specialOffer',
    componentName: 'CommodityList',
    title: '特价促销',
    props: {
      title: '特价促销',
      theme: 1,
    },
    otherProps: {
      dataIndex: 'specialOffer',
    },
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
  },
  '4-1': {
    componentName: 'CommodityList.Item',
    props: {},
  },
  '5': {
    canDelete: false,
    dataIndex: 'plummet',
    componentName: 'CommodityList',
    title: '直降促销',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    props: {
      title: '直降促销',
      theme: 1,
    },
    otherProps: {
      dataIndex: 'plummet',
    },
    // childNodes: ['5-1'],
  },
  '5-1': {
    componentName: 'CommodityList.Item',
    title: '活动推荐商品',
    props: {},
    addBtnText: '添加',
  },
  '6': {
    canDelete: false,
    dataIndex: 'discount',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '折扣促销',
    props: {
      title: '折扣促销',
      theme: 1,
    },
    otherProps: {
      dataIndex: 'discount',
    },
  },
  '6-1': {
    componentName: 'CommodityList.Item',
    title: '折扣促销-商品',
    props: {},
    addBtnText: '添加',
  },
  '7': {
    canDelete: false,
    dataIndex: 'fullQuantitySub',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '满量促销--满量减',
    props: {
      title: '满量促销--满量减',
      theme: 1,
    },
    otherProps: {
      dataIndex: 'fullQuantitySub',
    },
  },
  '7-1': {
    componentName: 'CommodityList.Item',
    title: '满量促销--满量减',
    props: {},
    addBtnText: '添加',
  },
  '8': {
    canDelete: false,
    dataIndex: 'fullQuantityDiscount',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '满量促销--满量折',
    props: {
      title: '满量促销--满量折',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'fullQuantityDiscount',
    },
    // childNodes: ["8-1"]
  },
  '8-1': {
    componentName: 'CommodityList.Item',
    title: '满量促销--满量折',
    props: {},
  },
  '9': {
    canDelete: false,
    dataIndex: 'fullMoneySub',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '满额促销--满额减',
    props: {
      title: '满额促销--满额减',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'fullMoneySub',
    },
    // childNodes: ["9-1"]
  },
  '9-1': {
    componentName: 'CommodityList.Item',
    title: '满量促销--满量折',
    props: {},
    addBtnText: '添加',
  },
  '10': {
    canDelete: false,
    dataIndex: 'fullMoneyDiscount',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '满额促销--满额折',
    props: {
      title: '满额促销--满额折',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'fullMoneyDiscount',
    },
    // childNodes: ["10-1"]
  },
  '10-1': {
    componentName: 'CommodityList.Item',
    title: '满量促销--满量折-商品',
    props: {},
    addBtnText: '添加',
  },
  '11': {
    canDelete: false,
    dataIndex: 'giveProduct',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '赠送促销--赠送商品(满额赠+买商品赠)',
    props: {
      title: '赠送促销--赠送商品(满额赠+买商品赠)',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'giveProduct',
    },
    // childNodes: ["11-1"]
  },
  '11-1': {
    componentName: 'CommodityList.Item',
    title: '赠送促销--赠送商品-商品',
    props: {},
    addBtnText: '添加',
  },
  '12': {
    canDelete: false,
    dataIndex: 'giveCoupon',
    componentName: 'CommodityList',
    title: '赠送促销--赠送优惠券(满额赠+买商品赠)',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    props: {
      title: '赠送促销--赠送优惠券(满额赠+买商品赠)',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'giveCoupon',
    },
    // childNodes: ["12-1"]
  },
  '12-1': {
    componentName: 'CommodityList.Item',
    title: '赠送促销--赠送商品-商品',
    props: {},
    addBtnText: '添加',
  },
  '13': {
    canDelete: false,
    dataIndex: 'morePiece',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '多件促销',
    props: {
      title: '多件促销',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'morePiece',
    },
    // childNodes: ["13-1"]
  },
  '13-1': {
    componentName: 'CommodityList.Item',
    title: '多件促销-商品',
    props: {},
    addBtnText: '添加',
  },
  '14': {
    canDelete: false,
    dataIndex: 'combination',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '组合促销',
    props: {
      title: '组合促销',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'combination',
    },
    // childNodes: ["14-1"]
  },
  '14-1': {
    componentName: 'CommodityList.Item',
    title: '组合促销-商品',
    props: {},
    addBtnText: '添加',
  },
  '15': {
    canDelete: false,
    dataIndex: 'groupPurchase',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '拼团',
    props: {
      title: '拼团',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'groupPurchase',
    },
    // childNodes: ["15-1"]
  },
  '15-1': {
    componentName: 'CommodityList.Item',
    title: '拼团-商品',
    props: {},
    addBtnText: '添加',
  },
  '16': {
    canDelete: false,
    dataIndex: 'bargain',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '砍价',
    props: {
      title: '砍价',
      theme: 1,
    },
    otherProps: {
      dataIndex: 'bargain',
    },
    // childNodes: ["16-1"]
  },
  '16-1': {
    componentName: 'CommodityList.Item',
    title: '砍价-商品',
    props: {},
    addBtnText: '添加',
  },
  '17': {
    canDelete: false,
    dataIndex: 'secKill',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '秒杀',
    props: {
      title: '秒杀',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'secKill',
    },
    // childNodes: ["17-1"]
  },
  '17-1': {
    componentName: 'CommodityList.Item',
    title: '秒杀-商品',
    props: {},
    addBtnText: '添加',
  },
  '18': {
    canDelete: false,
    dataIndex: 'fullSwap',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '换购-满额换购',
    props: {
      title: '换购-满额换购',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'fullSwap',
    },
    // childNodes: ["18-1"]
  },
  '18-1': {
    componentName: 'CommodityList.Item',
    title: '换购-满额换购-商品',
    props: {},
    addBtnText: '添加',
  },
  '19': {
    canDelete: false,
    dataIndex: 'buySwap',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '换购-买商品换购',
    props: {
      title: '换购-买商品换购',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'buySwap',
    },
    // childNodes: ["19-1"]
  },
  '19-1': {
    componentName: 'CommodityList.Item',
    title: '换购-商品',
    props: {},
    addBtnText: '添加',
  },
  '20': {
    canDelete: false,
    dataIndex: 'preSale',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '预售',
    props: {
      title: '预售',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'preSale',
    },
    // childNodes: ["20-1"]
  },
  '20-1': {
    componentName: 'CommodityList.Item',
    title: '预售-商品',
    props: {},
    addBtnText: '添加',
  },
  '21': {
    canDelete: false,
    dataIndex: 'setMeal',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '套餐',
    props: {
      title: '套餐',
      theme: 2,
    },
    otherProps: {
      dataIndex: 'setMeal',
    },
    // childNodes: ["21-1"]
  },
  '21-1': {
    componentName: 'CommodityList.CommodityTab',
    title: '套餐-商品',
    props: {},
    addBtnText: '添加',
  },
  '22': {
    canDelete: false,
    dataIndex: 'attempt',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: '添加商品',
    title: '试用',
    props: {
      title: '试用',
      theme: 0,
    },
    otherProps: {
      dataIndex: 'attempt',
    },
    // childNodes: ["22-1"]
  },
  '22-1': {
    componentName: 'CommodityList.Item',
    title: '试用-商品',
    props: {},
    addBtnText: '添加',
  },
}

const customizeActiveProducts: PageConfigType = {
  '23': {
    canDelete: false,
    componentName: 'WrapCommodityList',
    title: '自定义区域',
    dataIndex: 'suggestProduct',
    childComponentName: 'CommodityList',
    addBtnText: '添加活动',
    childProps: {
      title: '活动区域名称',
      childComponentName: 'CommodityList.Item',
      addBtnText: '添加商品',
      childNodes: [],
    },
  },
  '23-1': {
    componentName: 'CommodityList',
    addBtnText: '添加商品',
    childComponentName: 'CommodityList.Item',
    title: '',
    props: {
      title: 'test',
      theme: 0,
    },
    otherProps: {
      isWithLabels: true,
    },
    // childNodes: ["23-1-1"]
  },
  '23-1-1': {
    componentName: 'CommodityList.Item',
    title: '试用-商品',
    props: {},
    otherProps: {
      isWithLabels: true,
    },
  },
}

const configs = {
  ...mallLayoutConfig,
  ...divWrap,
  ...couponContainer,
  ...activityContainer,
  ...customizeActiveProducts,
}

export default configs
