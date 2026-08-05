/**
 * ****商品能力 相关常量****
 */

/**
 *
 * 其中包括：品类属性管理、品牌管理，商品管理，价格管理，仓位管理和进销存
 *
 */

import { getWebIntl } from '@apps/locales'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
const translate = getWebIntl()
// 单据类型

/**
 * 采购入库单
 */
export const DOC_TYPE_PURCHASE_RECEIPT = 1
/**
 * 销售发货单
 */
export const DOC_TYPE_SALES_INVOICE = 2
/**
 * 加工入库单
 */
export const DOC_TYPE_PROCESS_RECEIPT = 3
/**
 * 加工发货单
 */
export const DOC_TYPE_PROCESS_INVOICE = 4
/**
 * 退货发货单
 */
export const DOC_TYPE_RETURN_INVOICE = 5
/**
 * 退货入库单
 */
export const DOC_TYPE_RETURN_RECEIPT = 6
/**
 * 换货退货发货单
 */
export const DOC_TYPE_EXCHANGE_RETURN_INVOICE = 11
/**
 * 换货退货入货单
 */
export const DOC_TYPE_EXCHANGE_RETURN_RECEIPT = 12
/**
 * 换货发货单
 */
export const DOC_TYPE_EXCHANGE_INVOICE = 7
/**
 * 换货入库单
 */
export const DOC_TYPE_EXCHANGE_RECEIPT = 8

// 单据状态

/**
 * 未审核
 */
export const DOC_STATUS_UNREVIEWED = 0
/**
 * 已审核
 */
export const DOC_STATUS_REVIEWED = 1
export const DOC_STATUS = {
  [DOC_STATUS_UNREVIEWED]: translate('web.common.weishenhe'),
  [DOC_STATUS_REVIEWED]: translate('web.common.yishenhe'),
}

// 对应单据

/**
 * 订单
 */
export const DEPENDENT_DOC_ORDER = 1
/**
 * 换货
 */
export const DEPENDENT_DOC_EXCHANGE = 2
/**
 * 退货
 */
export const DEPENDENT_DOC_RETURN = 3
/**
 * 生产
 */
export const DEPENDENT_DOC_PRODUCTION = 4
/**
 * 内部
 */
export const DEPENDENT_DOC_INTERNAL = 5

// 单据类型状态

/**
 * 有效的
 */
export const DOC_TYPE_STATUS_EFFECTIVE = 1
/**
 * 无效的
 */
export const DOC_TYPE_STATUS_INVALID = 0
export const DOC_TYPE_STATUS = {
  [DOC_TYPE_STATUS_EFFECTIVE]: translate('web.common.youxiao'),
  [DOC_TYPE_STATUS_INVALID]: translate('web.common.wuxiao'),
}

// 单据类型方向

/**
 * 入库
 */
export const DOC_DIRECTION_WAREHOUSING = 1
/**
 * 出库
 */
export const DOC_DIRECTION_OUTGOING = 2
export const DOC_DIRECTION = {
  [DOC_DIRECTION_WAREHOUSING]: translate('web.resource.commodity.ruku'),
  [DOC_DIRECTION_OUTGOING]: translate('web.resource.commodity.chuku'),
}

// 仓位状态

/**
 * 有效的
 */
export const POSITION_STATUS_EFFECTIVE = 1
/**
 * 无效的
 */
export const POSITION_STATUS_INVALID = 0
export const POSITION_STATUS = {
  [POSITION_STATUS_EFFECTIVE]: translate('web.common.youxiao'),
  [POSITION_STATUS_INVALID]: translate('web.common.wuxiao'),
}

/**
 * 商品定价
 */
export const GOODS_PRICE_TYPE = {
  1: intl.formatMessage({ id: 'processRuleSetting.xianhuojiage', defaultMessage: '现货价格' }),
  2: intl.formatMessage({ id: 'processRuleSetting.jiagexuyaoxun', defaultMessage: '价格需要询价' }),
  3: intl.formatMessage({ id: 'processRuleSetting.jifenduihuanshang', defaultMessage: '积分兑换商品' }),
}
