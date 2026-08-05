/**
 * 根据类型获取路由链接
 * 类型：1-首页 2-分类 3-积分 4-资讯 5-消息 6-购物车 7-我的
 * @param type
 */
export const getSelfRouteByType = (type: number): string => {
  switch (type) {
    case 1:
      return 'extra/mall/own'
    case 2:
      return 'extra/commonClassify'
    case 3:
      return `shop/pointExchange`
    case 4:
      return 'companyNews/newsHome'
    case 5:
      return 'basicSetting/message'
    case 6:
      return 'order/Purchase'
    case 7:
      return 'extra/mine'
    case 8:
      return 'commodityMerge/stocksSourcing/index'
    case 9:
      return 'commodityMerge/soleSourcing/index'
    default:
      return ''
  }
}

/**
 * 根据类型获取路由链接
 * 类型：1-首页 2-分类 3-积分 4-资讯 5-消息 6-购物车 7-我的
 * @param type
 */
export const getStoreRouteByType = (type: number): string => {
  switch (type) {
    case 1:
      return 'shop/home'
    case 2:
      return 'commodityMerge/stocksSourcing/index'
    case 3:
      return 'extra/commonClassify'
    case 4:
      return `shop/pointExchange`
    case 5:
      return 'members/shop'
    case 6:
      return 'shop/shopAbout'
    default:
      return ''
  }
}

/**
 * 根据类型获取路由链接
 * 类型：1-首页 2-分类 3-购物车 4-消息 5-我的 6-找现货 7-找供应 8-换积分 9-找店铺
 * @param type
 */
export const getEnterpriseRouteByType = (type: number): string => {
  switch (type) {
    case 1:
      return 'extra/mall/b2b'
    case 2:
      return 'extra/classify'
    case 3:
      return `order/Purchase`
    case 4:
      // return 'basicSetting/message'
      return 'im/chatList'
    case 5:
      return 'extra/mine'
    case 6:
      return 'commodityMerge/stocksSourcing/index'
    case 7:
      return 'commodityMerge/soleSourcing/index'
    case 8:
      return 'extra/integralMall'
    case 9:
      return 'shop/findShop'
    case 10:
      return 'extra/webview'
    default:
      return ''
  }
}

/**
 * 根据类型获取路由链接
 * 类型：1-首页 2-分类 3-购物车 4-我的 5-消息 6-积分商城 7-外部链接
 * @param type
 */
export const getClientRouteByType = (type: number): string => {
  switch (type) {
    case 1:
      return 'extra/mall/client'
    case 2:
      return 'extra/classify'
    case 3:
      return `order/Purchase`
    case 4:
      return 'extra/mine'
    case 5:
      return 'basicSetting/message'
    case 6:
      return 'extra/integralMall'
    case 7:
      return 'extra/webview'
    default:
      return ''
  }
}
