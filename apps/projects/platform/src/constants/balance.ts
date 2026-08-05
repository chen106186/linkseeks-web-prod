/**
 * 结算单状态
 */


/**
 * 结算状态 待对账、待付款、待收款、已完成
 */

/**
 * 待对账
 */
const PENDING_RECONCILED = 1

/**
 * 待付款
 */
const PENDING_PAY = 2;

/**
 * 待收款
 */
const PENDING_RECEIVED = 3;

/**
 * 已完成
 */
const COMPLETED = 4;


export const STATUS_TEXT = {
  [PENDING_RECONCILED]: '待对账',
  [PENDING_PAY]: '待付款',
  [PENDING_RECEIVED]: '待收款',
  [COMPLETED]: '已完成'
}
