import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/**
 * 通知单订单类型
 */
export enum ORDER_TYPE {
  B2B = 1,
  SRM = 2,
}

/**
 * WAIT_CONFIRM 待确认
 *
 * WAIT_REVISE 待修订
 *
 * HAD_CONFIRM 已确认
 *
 * HAD_GENERATE 已生产送货单
 *
 * HAD_TO_VOID 已作废
 */
export enum STATUS {
  WAIT_CONFIRM = 1,
  WAIT_REVISE = 2,
  HAD_CONFIRM = 3,
  HAD_GENERATE = 4,
  HAD_TO_VOID = 5,
}

/**
 * 状态相关颜色码
 */
export const STATUS_NAME = {
  // 待确认
  [STATUS.WAIT_CONFIRM]: '待确认',
  // 待修订
  [STATUS.WAIT_REVISE]: '待修订',
  //  已确认
  [STATUS.HAD_CONFIRM]: '已确认',
  //  已生产送货单
  [STATUS.HAD_GENERATE]: '已生成送货单',
  //  已作废
  [STATUS.HAD_TO_VOID]: '已作废',
}

/**
 * 状态相关颜色码
 */
export const TAG_STATUS_COLOR = {
  // 待确认
  [STATUS.WAIT_CONFIRM]: { color: '#ECF2FE', fontColor: '#4787F0' },
  // 待修订
  [STATUS.WAIT_REVISE]: { color: '#eae6ff', fontColor: '#9963d8' },
  //  已确认
  [STATUS.HAD_CONFIRM]: { color: '#EBF9F6', fontColor: '#00A98F' },
  //  已生产送货单
  [STATUS.HAD_GENERATE]: { color: '#ebf9f6', fontColor: '#00a98f' },
  //  已作废
  [STATUS.HAD_TO_VOID]: { color: '#fff2f0', fontColor: '#ff4d4f' },
}
