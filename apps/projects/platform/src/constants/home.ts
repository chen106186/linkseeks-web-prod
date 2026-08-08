import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
/**
 * 首页待办项-相关路由
 */
export const HOME_TODO = {
  '/orderAbility': translate('web.resource.home.orderCenter'),
  '/shopAbility': translate('web.resource.home.mallCenter'),
  // '/dealAbility/productInquiry': '交易中心',
  // '/dealAbility/inquiryOffer': '交易中心',
  // '/dealAbility/confirmOffer': '交易中心',
  '/procurementAbility': translate('web.resource.home.procureCenter'),
  '/contract': translate('web.resource.home.contractCenter'),
  '/commodityAbility': translate('web.resource.home.productCenter'),
  '/payandSettle': translate('web.resource.home.zijinzhanghuguanlizhongxin'),
  '/balance': translate('web.resource.home.settleCenter'),
  '/afterAbility': translate('web.resource.home.afterCenter'),
  '/logisticsAbility': translate('web.resource.home.logisticsCenter'),
  // '/handling': '加工中心',
  // '/customerAbility': '客户中心',
  '/supplierAbility': translate('web.resource.home.memberCenter'),
  // '/qualityAbility': '质量中心',
  // '/marketingAbility': '营销中心',
}

/**
 * srm采购商首页待办项-相关路由
 */
export const SRM_HOME_TODO = {
  '/supplierAbility': translate('web.resource.home.gysgl'),
  '/orderAbility': translate('web.resource.home.orderCenter'),
  '/procurementAbility': translate('web.resource.home.procureCenter'),
  '/contract': translate('web.resource.home.contractCenter'),
  '/commodityAbility': translate('web.resource.home.productCenter'),
  '/balance': translate('web.resource.home.settleCenter'),
  '/afterAbility': translate('web.resource.home.afterCenter'),
  '/logisticsAbility': translate('web.resource.home.logisticsCenter'),
  // '/qualityAbility': '质量中心',
  '/payandSettle': translate('web.resource.home.payCenter'),
}

/**
 * src采购商首页路径
 */
export const SRM_PURCHASER_HOME_PATH = '/srmPurchaserHome'

/**
 * 首页路径
 */
export const HOME_PATH = '/home'
