/**
 * 结算单据装填
 */

/**
 * 待对账
 */
export const TO_BE_RECONCILED = 1;
/**
 * 待付款
 */
export const TO_BE_PAY = 2
/**
 * 待收款
 */
export const TO_BE_COLLECTED = 3;
/**
 * 已完成
 */
export const COMPLETED = 4



/**
 * 应付账款 - 付款方查看凭证,  能力中心
 */
export const PAYABLE_PAYER = 1;
/**
 * 应收账款管理-收款方查看凭证， 能力中心
 */
export const RECEIABLE_BENEFICIARY = 2;
/**
 * 平台代收账款结算 - 收款方查看凭证 能力中心
 */
export const PLATFORM_BENEFICIARY = 3;
/**
 * 平台代收账款结算 - 付款方查看凭证  这是平台后台
 */
export const PLATFORM_PAYER = 4;
/**
 * 平台积分结算-收款方查看凭证， 能力中心
 */
export const SCORE_BENEFINCIARY = 5;
/**
 * 平台积分结算-付款方查看凭证 ，这是平台后台
 */
export const SCORE_PAYER = 6;


/**
 * 结算单据类型-结算生产通知单
 */

export const PRODUCT_NOTICE_SETTLEMENT_DETAIL = 1;

/**
 * 结算单据类型-物流单 logisticsDetail
 */
export const LOGISTICS_DETAIL = 2;

/**
 * 结算单据类型-订单详情
 */
export const ORDER_DETAIL = 3

/**
 * 结算单据类型-合同请款单
 */
export const CONTRACT_FUND_BILL = 6


/**
 * 应付账款管理， 应收账款管理， 平台代收账款管理列表 支付方式
 * 1. 线下支付， 2通联支付
 */
export const IS_UNIVERSAL_PAY = 2
