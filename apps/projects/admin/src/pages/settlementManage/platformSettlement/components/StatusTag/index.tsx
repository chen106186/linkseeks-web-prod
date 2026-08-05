import React from 'react'
import { Tag } from 'antd'
import styles from './index.less'

export const TO_BE_RECONCILED = 1 // 待对账
export const TO_BE_PAY = 2 // 待付款
export const TO_BE_COLLECTED = 3 // 待收款
export const COMPLETED = 4 // 以完成

export enum StatusEnum {
  TO_BE_RECONCILED,
  TO_BE_PAY,
  TO_BE_COLLECTED,
  COMPLETED,
}

const COLOR = [
  '', // 随意给一个
  'gold', // 待对账
  'red', // 待付款
  'blue', // 代收款,
  'green', // 以完成
]

/**
 * 以下用于 应收账款管理， 应付账款管理 列表页， 以及应收，应付款详情页状态
 */
const STATUS_TEXT = ['无', '待对账', '待付款', '待收款', '已完成']

const STATUS_TEXT_MAP = {
  待对账: 1,
  待付款: 2,
  待收款: 3,
  已完成: 4,
}

/**
 * 开票管理， 开票类型, 其中 value 的值对应上面 COLOR 的值
 */
const INVOICE_TYPE = {
  生产通知单: 0,
  积分订单: 1,
  退货申请单: 2,
  订单: 3,
  物流单: 4,
}

/**
 * 开票管理， 开票状态
 */

const INVOICE_STATUS = {
  未开票: 3,
  已开票: 4,
}

/**
 * 将开票类型跟 应收应付账款管理合并
 */
const ALL_COLOR_MAP = {
  ...INVOICE_TYPE,
  ...STATUS_TEXT_MAP,
  ...INVOICE_STATUS,
}

interface Iprops {
  status?: StatusEnum
  text?: string
}

const StatusTag: React.FC<Iprops> = (props: Iprops) => {
  const { status, text } = props

  return (
    <Tag className={styles['tag-out-border']} color={text ? COLOR[ALL_COLOR_MAP[text]] : COLOR[status]}>
      {text || STATUS_TEXT[status]}
    </Tag>
  )
}

// StatusTag.defaultProps = {
//   status: 1
// }

export default StatusTag
