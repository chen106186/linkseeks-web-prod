import React from 'react'
import { TagOutlined } from '@ant-design/icons'
import { PageConfigType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'

const intl = getIntl()
/**
 * 以下对应的组件全部在Layout 文件夹中
 *
 */

const mallLayoutConfig: PageConfigType = {
  '0': {
    componentName: 'LocaleProvide',
    title: `${intl.formatMessage({ id: 'activePage.compoentTree' })}`,
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
    title: `${intl.formatMessage({ id: 'activePage.AdvertisingMap' })}`,
    canEdit: true,
    canHide: true,
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
    title: `${intl.formatMessage({ id: 'activePage.couponContainer' })}`,
    canEdit: true,
    canHide: true,
    props: {},
    childNodes: ['2-1'],
    childComponentName: 'Coupon.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addCoupon' })}`,
  },
  '2-1': {
    componentName: 'Coupon.Item',
    title: `${intl.formatMessage({ id: 'activePage.coupon' })}`,
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
    title: `${intl.formatMessage({ id: 'activePage.ActivityRecommendation' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.ActivityRecommendation' })}`,
      theme: 0,
    },
    // childNodes: ['3-1'],
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    childProps: {
      title: `${intl.formatMessage({ id: 'activePage.activityRecommendGoods' })}`,
    },
    otherProps: {
      dataIndex: 'hot',
    },
  },
  '3-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activePage.activityRecommendGoods' })}`,
    props: {},
  },
  '4': {
    dataIndex: 'specialOffer',
    componentName: 'CommodityList',
    title: `${intl.formatMessage({ id: 'activePage.Onsale' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.Onsale' })}`,
      theme: 1,
    },
    otherProps: {
      dataIndex: 'specialOffer',
    },
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
  },
  '4-1': {
    componentName: 'CommodityList.Item',
    props: {},
  },
  '5': {
    dataIndex: 'plummet',
    componentName: 'CommodityList',
    title: `${intl.formatMessage({ id: 'activePage.delineOnsale' })}`,
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.delineOnsale' })}`,
      theme: 1,
    },
    otherProps: {
      dataIndex: 'plummet',
    },
    // childNodes: ['5-1'],
  },
  '5-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activePage.activityRecommendGoods' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '6': {
    dataIndex: 'discount',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.DiscountPromotion' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.DiscountPromotion' })}`,
      theme: 1,
    },
    otherProps: {
      dataIndex: 'discount',
    },
  },
  '6-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.saleGoods' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '7': {
    dataIndex: 'fullQuantitySub',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activityPage.filledToSale' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activityPage.filledToSale' })}`,
      theme: 1,
    },
    otherProps: {
      dataIndex: 'fullQuantitySub',
    },
  },
  '7-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.filledToSale' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '8': {
    dataIndex: 'fullQuantityDiscount',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activityPage.FullVolumePromotion' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activityPage.FullVolumePromotion' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'fullQuantityDiscount',
    },
    // childNodes: ["8-1"]
  },
  '8-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.FullVolumePromotion' })}`,
    props: {},
  },
  '9': {
    dataIndex: 'fullMoneySub',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activityPage.fullReduction' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activityPage.fullReduction' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'fullMoneySub',
    },
    // childNodes: ["9-1"]
  },
  '9-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.FullVolumePromotion' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '10': {
    dataIndex: 'fullMoneyDiscount',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activityPage.fullDiscount' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activityPage.fullDiscount' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'fullMoneyDiscount',
    },
    // childNodes: ["10-1"]
  },
  '10-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.CommodityListItem' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '11': {
    dataIndex: 'giveProduct',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activityPage.giveProductCommodityList' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activityPage.giveProductCommodityList' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'giveProduct',
    },
    // childNodes: ["11-1"]
  },
  '11-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.CommodityList' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '12': {
    dataIndex: 'giveCoupon',
    componentName: 'CommodityList',
    title: `${intl.formatMessage({ id: 'activityPage.giveProductCommodityList' })}`,
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activityPage.giveProductCommodityList' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'giveCoupon',
    },
    // childNodes: ["12-1"]
  },
  '12-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.CommodityList' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '13': {
    dataIndex: 'morePiece',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.MultiPiecePromotion' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.MultiPiecePromotion' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'morePiece',
    },
    // childNodes: ["13-1"]
  },
  '13-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.muchOnSale' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '14': {
    dataIndex: 'combination',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.CombinedPromotion' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.CombinedPromotion' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'combination',
    },
    // childNodes: ["14-1"]
  },
  '14-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.combinedPromotionProduct' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '15': {
    dataIndex: 'groupPurchase',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.Collage' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.Collage' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'groupPurchase',
    },
    // childNodes: ["15-1"]
  },
  '15-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.PuzzleItem' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '16': {
    dataIndex: 'bargain',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.Bargain' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.Bargain' })}`,
      theme: 1,
    },
    otherProps: {
      dataIndex: 'bargain',
    },
    // childNodes: ["16-1"]
  },
  '16-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.combinedPromotionProduct' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '17': {
    dataIndex: 'secKill',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.CombinedPromotion' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.CombinedPromotion' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'secKill',
    },
    // childNodes: ["17-1"]
  },
  '17-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.combinedPromotionProduct' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '18': {
    dataIndex: 'fullSwap',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activityPage.fullSwap' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activityPage.fullSwap' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'fullSwap',
    },
    // childNodes: ["18-1"]
  },
  '18-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.fullSwapGoods' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '19': {
    dataIndex: 'buySwap',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.CombinedPromotion' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.CombinedPromotion' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'buySwap',
    },
    // childNodes: ["19-1"]
  },
  '19-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.combinedPromotionProduct' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '20': {
    dataIndex: 'preSale',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.PreSale' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.PreSale' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'preSale',
    },
    // childNodes: ["20-1"]
  },
  '20-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.previewSaleProduct' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '21': {
    dataIndex: 'setMeal',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.Package' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.Package' })}`,
      theme: 2,
    },
    otherProps: {
      dataIndex: 'setMeal',
    },
    // childNodes: ["21-1"]
  },
  '21-1': {
    componentName: 'CommodityList.CommodityTab',
    title: `${intl.formatMessage({ id: 'activityPage.aSuitProduct' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
  '22': {
    dataIndex: 'attempt',
    componentName: 'CommodityList',
    childComponentName: 'CommodityList.Item',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
    title: `${intl.formatMessage({ id: 'activePage.onTrial' })}`,
    props: {
      title: `${intl.formatMessage({ id: 'activePage.onTrial' })}`,
      theme: 0,
    },
    otherProps: {
      dataIndex: 'attempt',
    },
    // childNodes: ["22-1"]
  },
  '22-1': {
    componentName: 'CommodityList.Item',
    title: `${intl.formatMessage({ id: 'activityPage.trialProduct' })}`,
    props: {},
    addBtnText: `${intl.formatMessage({ id: 'activePage.add' })}`,
  },
}

const customizeActiveProducts: PageConfigType = {
  '23': {
    componentName: 'WrapCommodityList',
    title: `${intl.formatMessage({ id: 'activePage.CustomArea' })}`,
    dataIndex: 'suggestProduct',
    childComponentName: 'CommodityList',
    addBtnText: `${intl.formatMessage({ id: 'activePage.AddActivity' })}`,
    childProps: {
      title: `${intl.formatMessage({ id: 'activePage.ActivityAreaName' })}`,
      childComponentName: 'CommodityList.Item',
      addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
      childNodes: [],
    },
  },
  '23-1': {
    componentName: 'CommodityList',
    addBtnText: `${intl.formatMessage({ id: 'activePage.addGoods' })}`,
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
    title: `${intl.formatMessage({ id: 'activityPage.trialProduct' })}`,
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
