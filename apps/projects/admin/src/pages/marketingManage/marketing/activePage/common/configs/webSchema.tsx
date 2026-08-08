import { PROPS_TYPES } from '@apps/design-core'

/**
 * * web 装修页布局
 */
const WebLayout = {
  propsConfig: {
    children: {
      type: PROPS_TYPES.string,
    },
  },
}

/**
 * web 装修页广告图
 */
const WebAdvertise = {
  propsConfig: {
    imageUrl: PROPS_TYPES.string,
  },
}

/** web 装修页 每日推荐 */
const WebHotCommoditySwiper = {
  propsConfig: {},
}

const WebHotCommodityItem = {
  propsConfig: {},
}

/** web 装修页 优惠券容器 */
const WebCouponContainer = {
  propsConfig: {
    title: PROPS_TYPES.string,
    /** 该容器下的children 只能是 WebCoupon 组件*/
    children: PROPS_TYPES.objectArray,
  },
}

/** web 装修页 优惠券 */
const WebCoupon = {
  propsConfig: {},
}

/** web 装修页 活动商品容器，包含 */
const WebCommodityContainer = {
  propsConfig: {
    title: PROPS_TYPES.string,
    /** 该容器下的children 只能是 WebCommodity 组件*/
    children: PROPS_TYPES.objectArray,
  },
}

/** web 装修页 套餐活动商品容器，包含 */
const WebMealCommodityContainer = {
  propsConfig: {
    title: PROPS_TYPES.string,
    /** 该容器下的children 只能是 WebCommodity 组件*/
    children: PROPS_TYPES.objectArray,
  },
}

const WebCommodity = {
  propsConfig: {
    title: PROPS_TYPES.string,
    children: PROPS_TYPES.objectArray,
  },
}

const WebCustomCommodity = {
  propsConfig: {
    title: PROPS_TYPES.string,
    children: PROPS_TYPES.objectArray,
  },
}

export default {
  WebLayout,
  WebAdvertise,
  WebHotCommoditySwiper,
  WebHotCommodityItem,
  WebCouponContainer,
  WebCoupon,
  WebCommodityContainer,
  WebMealCommodityContainer,
  WebCommodity,
  WebCustomCommodity,
}
