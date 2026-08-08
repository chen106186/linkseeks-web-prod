import { getMobileIntl } from '@apps/locales'

const translate = getMobileIntl()

/** 比价状态 */
export const PARITY_STATUS = [3, 4, 5, 6, 7, 8, 9]

/** 显示授标操作状态 */
export const SHOW_AWARD_STATUS = [3, 6, 7]

/**
 * 需求单状态
 */
export const innerStatusList = {
  1: translate('mobile.resource.askPurchase.daifabu'),
  2: translate('mobile.resource.askPurchase.daibaojia'),
  3: translate('mobile.resource.askPurchase.daibijia'),
  4: translate('mobile.resource.askPurchase.daishenheshoubiaoyiji'),
  5: translate('mobile.resource.askPurchase.daishenheshoubiaoerji'),
  6: translate('mobile.resource.askPurchase.daishenheshoubiaobutongguoyiji'),
  7: translate('mobile.resource.askPurchase.daishenheshoubiaobutongguoerji'),
  8: translate('mobile.resource.askPurchase.daiquerenshoubiao'),
  9: translate('mobile.resource.askPurchase.yiwancheng'),
  10: translate('mobile.resource.askPurchase.yijieshu'),
  11: translate('mobile.resource.askPurchase.yizhongzhi'),
  12: translate('mobile.resource.askPurchase.yizuofei'),
}

/**
 * 报价单状态
 */
export const outerStatusList = {
  1: translate('mobile.resource.askPurchase.daifabu'),
  2: translate('mobile.resource.askPurchase.baojiazhong'),
  3: translate('mobile.resource.askPurchase.bijiazhong'),
  4: translate('mobile.resource.askPurchase.bijiazhong'),
  5: translate('mobile.resource.askPurchase.bijiazhong'),
  6: translate('mobile.resource.askPurchase.bijiazhong'),
  7: translate('mobile.resource.askPurchase.bijiazhong'),
  8: translate('mobile.resource.askPurchase.bijiazhong'),
  9: translate('mobile.resource.askPurchase.yiwancheng'),
  10: translate('mobile.resource.askPurchase.yijieshu'),
  11: translate('mobile.resource.askPurchase.yizhongzhi'),
  12: translate('mobile.resource.askPurchase.yizuofei'),
}

/**
 * 报价单状态
 */
export const quoteStatusList = {
  1: translate('mobile.resource.askPurchase.daitijiaoshenhe'),
  2: translate('mobile.resource.askPurchase.daishenheyiji'),
  3: translate('mobile.resource.askPurchase.daishenheerji'),
  4: translate('mobile.resource.askPurchase.daitijiao'),
  5: translate('mobile.resource.askPurchase.yitijiao'),
  6: translate('mobile.resource.askPurchase.shenhebutongguoyiji'),
  7: translate('mobile.resource.askPurchase.shenhebutongguoerji'),
  8: translate('mobile.resource.askPurchase.zhongbiao'),
  9: translate('mobile.resource.askPurchase.weizhongbiao'),
  10: translate('mobile.resource.askPurchase.yizuofei'),
}
