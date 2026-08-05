import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

/** 报价外部状态颜色 */
export const OFFTER_EXTERNALSTATE_COLOR = {
  '-1': 'error',
  99: 'success',
  1: 'default',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'error',
  6: 'warning',
}
/** 报价内部状态 */
export const OFFTER_INTERNALSTATE = {
  '-1': translate('web.common.zuofei'),
  99: translate('web.resource.deal.yitijiaoshenhecaigouxuqiudan'),
  1: translate('web.resource.order.addOfferTasksStep1'),
  2: translate('web.resource.deal.daishenheyiji'),
  3: translate('web.resource.deal.daishenheerji'),
  4: translate('web.resource.deal.daitijiaobaojiadan'),
  5: translate('web.resource.deal.daibijia'),
  6: translate('web.resource.deal.shenhetonguoyiji'),
  7: translate('web.resource.deal.shenhetongguoerji'),
  8: translate('web.resource.deal.shenhebutonguoyiji'),
  9: translate('web.resource.deal.shenhebutonguoerji'),
}
/** 报价内部状态颜色 */
export const OFFTER_INTERNALSTATE_COLOR = {
  '-1': 'error',
  99: 'success',
  1: 'default',
  2: 'warning',
  3: 'warning',
  4: 'warning',
  5: 'default',
  6: 'success',
  7: 'success',
  8: 'error',
  9: 'error',
  10: 'error',
  11: 'default',
  12: 'default',
  13: 'default',
  14: 'default',
  15: 'error',
}
// export const statusList = ['', '待发布', '待报价', '已结束', '已终止', '已作废']
// 国际化多语言,中文参考如上
export const statusList = [
  '',
  'transaction_components.daifabu',
  'transaction_components.daibaojia',
  'transaction_components.yijieshu',
  'transaction_components.yizhongzhi',
  'transaction_components.yizuofei',
]
// export const innerStatusList = [
//   '',
//   '待提交审核',
//   '待审核(一级)',
//   '待审核(二级)',
//   '待提交报价单',
//   '已提交',
//   '审核不通过(一级)',
//   '审核不通过(二级',
// ]
// 国际化多语言,中文参考如上
export const innerStatusList = {
  1: translate('web.resource.mall.daifabu'),
  2: translate('web.resource.mall.daibaojia'),
  3: translate('web.resource.deal.daibijia'),
  4: translate('web.resource.deal.daishenheshoubiaoyiji'),
  5: translate('web.resource.deal.daishenheshoubiaoerji'),
  6: translate('web.resource.deal.daishenheshoubiaobutonguoyiji'),
  7: translate('web.resource.deal.daishenheshoubiaobutongguoerji'),
  8: translate('web.resource.deal.daiquerenshoubiao'),
  9: translate('web.resource.mall.finshed'),
  10: translate('web.resource.mall.yijieshu'),
  11: translate('web.resource.mall.yizhongzhi'),
  12: translate('web.common.yizuofei'),
}

/**
 * 寻源需求单状态
 */
export const sourcingStatusList = {
  1: translate('web.resource.mall.baojiazhong'),
  2: translate('web.resource.mall.baojiazhong'),
  3: translate('web.resource.deal.bijiazhong'),
  4: translate('web.resource.deal.bijiazhong'),
  5: translate('web.resource.deal.bijiazhong'),
  6: translate('web.resource.deal.bijiazhong'),
  7: translate('web.resource.deal.bijiazhong'),
  8: translate('web.resource.deal.bijiazhong'),
  9: translate('web.resource.mall.finshed'),
  10: translate('web.resource.mall.yijieshu'),
  11: translate('web.resource.mall.yizhongzhi'),
  12: translate('web.common.yizuofei'),
}

/**
 * 报价单状态
 */
export const outerStatusList = {
  1: translate('web.resource.mall.daifabu'),
  2: translate('web.resource.mall.daibaojia'),
  3: translate('web.resource.deal.daishenhebaojia'),
  4: translate('web.resource.deal.daishenhebaojia'),
  5: translate('web.resource.deal.daishenhebaojia'),
  6: translate('web.resource.deal.daishenhebaojia'),
  7: translate('web.resource.deal.daishenhebaojia'),
  8: translate('web.resource.deal.daishenhebaojia'),
  9: translate('web.resource.mall.finshed'),
  10: translate('web.resource.mall.yijieshu'),
  11: translate('web.resource.mall.yizhongzhi'),
  12: translate('web.common.yizuofei'),
}

/**
 * 报价单状态
 */
export const quoteStatusList = {
  1: translate('web.resource.order.addOfferTasksStep1'),
  2: translate('web.resource.deal.daishenheyiji'),
  3: translate('web.resource.deal.daishenheerji'),
  4: translate('web.resource.order.daitijiao'),
  5: translate('web.common.yitijiao'),
  6: translate('web.resource.deal.shenhebutonguoyiji'),
  7: translate('web.resource.deal.shenhebutonguoerji'),
  8: translate('web.resource.deal.zhongbiao'),
  9: translate('web.resource.deal.weizhongbiao'),
  10: translate('web.common.yizuofei'),
}

/** * 外部状态枚举值 */
export enum STATUS {
  /** 所有状态 */
  allStatus = '',
  /** 待发布 */
  toBeReleased = 1,
  /** 待报价 */
  waitQuote,
  /** 待比价 */
  toBeParity,
  /** 待审核授标（一级） */
  waitAuditBidOne,
  /** 待审核授标（二级） */
  waitAuditBidTwo,
  /** 待审核授标不通过（一级） */
  waitUnPassAuditBidOne,
  /** 待审核授标不通过（二级） */
  waitUnPassAuditBidTwo,
  /** 待确认 */
  waitConfirm,
  /** 已完成 */
  finished,
  /** 已结束 */
  toBeEnd,
  /** 已终止 */
  toBeStop,
  /** 已作废 */
  toBeInvalid,
}

/** * 内部状态枚举值 */
export enum INNER_STATUS {
  /** 所有状态 */
  allStatus = '',
  /** 待提交审核 */
  waitAduit = 1,
  /** 待审核(一级) */
  waitAduitFirst = 2,
  /** 待审核(二级) */
  waitAduitSecond = 3,
  /** 待提交报价单 */
  waitSubmit = 4,
  /** 已提交 */
  submited = 5,
  /** 审核不通过(一级) */
  unPassFirst = 6,
  /** 审核不通过(二级)*/
  unPassSecond = 7,
  /** 中标 */
  winningBid = 8,
  /** 未中标 */
  noSuccessBid = 9,
}
