import { MOBILE_DESIGN_COMPONENT, MARKETING_COMPONENTS_NAMES } from '@apps/design-ui'

export const getMarketingCardTitle = (type: MARKETING_COMPONENTS_NAMES) => {
  let title = ''
  switch (type) {
    case MARKETING_COMPONENTS_NAMES.SpecialOffer:
      title = '特价促销'
      break
    case MARKETING_COMPONENTS_NAMES.Plummet:
      title = '直降促销'
      break
    case MARKETING_COMPONENTS_NAMES.FullQuantitySub:
      title = '满量减'
      break
    case MARKETING_COMPONENTS_NAMES.Discount:
      title = '折扣促销'
      break
    case MARKETING_COMPONENTS_NAMES.FullQuantityDiscount:
      title = '满量折'
      break
    case MARKETING_COMPONENTS_NAMES.FullMoneySub:
      title = '满额减'
      break
    case MARKETING_COMPONENTS_NAMES.FullMoneyDiscount:
      title = '满额折'
      break
    case MARKETING_COMPONENTS_NAMES.GiveProduct:
      title = '赠商品'
      break
    case MARKETING_COMPONENTS_NAMES.GiveCoupon:
      title = '赠优惠券'
      break
    case MARKETING_COMPONENTS_NAMES.MorePiece:
      title = '多件促销'
      break
    case MARKETING_COMPONENTS_NAMES.Combination:
      title = '组合促销'
      break
    case MARKETING_COMPONENTS_NAMES.SecKill:
      title = '秒杀'
      break
    case MARKETING_COMPONENTS_NAMES.GroupPurchase:
      title = '拼团'
      break
    case MARKETING_COMPONENTS_NAMES.FullSwap:
      title = '满额换购'
      break
    case MARKETING_COMPONENTS_NAMES.BuySwap:
      title = '买商品换购'
      break
    case MARKETING_COMPONENTS_NAMES.PreSale:
      title = '预售'
      break
    case MARKETING_COMPONENTS_NAMES.Attempt:
      title = '试用'
      break
    case MARKETING_COMPONENTS_NAMES.SetMeal:
      title = '套餐'
      break
    case MARKETING_COMPONENTS_NAMES.Bargain:
      title = '砍价'
      break
    default:
      title = '活动标题'
  }

  return `活动-${title}`
}

export const getComponentTitle = (componentName: MOBILE_DESIGN_COMPONENT) => {
  let title = '标题'
  switch (componentName as MOBILE_DESIGN_COMPONENT) {
    case MOBILE_DESIGN_COMPONENT.HeaderNav:
    case MOBILE_DESIGN_COMPONENT.ChannelHeaderNav:
      title = '头部导航栏'
      break
    case MOBILE_DESIGN_COMPONENT.MobileShopHeader:
      title = '背景图'
      break
    case MOBILE_DESIGN_COMPONENT.Banner:
      title = '广告图'
      break
    case MOBILE_DESIGN_COMPONENT.InformationCard:
      title = '资讯'
      break
    case MOBILE_DESIGN_COMPONENT.MobileNavCard:
      title = '分类导航'
      break
    case MOBILE_DESIGN_COMPONENT.RecommendShop:
      title = '店铺推荐'
      break
    case MOBILE_DESIGN_COMPONENT.ShowCaseBanner:
      title = '橱窗广告'
      break
    case MOBILE_DESIGN_COMPONENT.SuggestProduct:
    case MOBILE_DESIGN_COMPONENT.MobileShopCommodity:
      title = '推荐商品'
      break
    case MOBILE_DESIGN_COMPONENT.MobileBrand:
      title = '推荐品牌'
      break
    case MOBILE_DESIGN_COMPONENT.CouponsModal:
      title = '优惠券弹窗'
      break
    case MOBILE_DESIGN_COMPONENT.BottomNavigation:
      title = '底部标签栏'
      break
    default:
      break
  }
  return title
}

export const getComponentAddBtnText = (componentName: MOBILE_DESIGN_COMPONENT) => {
  let title = '添加'
  switch (componentName as MOBILE_DESIGN_COMPONENT) {
    case MOBILE_DESIGN_COMPONENT.HeaderNav:
      title = ''
      break
    case MOBILE_DESIGN_COMPONENT.Banner:
      title = '添加广告'
      break
      break
    case MOBILE_DESIGN_COMPONENT.MobileNavCard:
      title = '添加导航'
      break
    case MOBILE_DESIGN_COMPONENT.RecommendShop:
      title = '添加店铺'
      break
    case MOBILE_DESIGN_COMPONENT.ShowCaseBanner:
      title = '添加橱窗'
      break
    case MOBILE_DESIGN_COMPONENT.SuggestProduct:
      title = '添加分类'
      break
    case MOBILE_DESIGN_COMPONENT.BottomNavigation:
      title = '添加标签'
      break
    default:
      break
  }
  return title
}
