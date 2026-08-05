import React from 'react'
import { Tag } from 'antd'
import {
  PurchaseOrderInsideWorkStateTexts,
  PurchaseOrderOutWorkStateTexts,
  PurchaseOrderInsideWorkState,
  PurchaseOrderOutWorkState,
  SaleOrderInsideWorkState,
  SaleOrderInsideWorkStateTexts,
  PayOutWorkStateTexts,
  DeliverySideState,
  DeliverySideStateTexts,
  InquiryStateTexts,
  OrderTransformOutWorkStateTexts,
  PurchaseOrderTransformInsideWorkStateTexts,
  SaleOrderTransformInsideWorkStateTexts,
} from '@/constants'

export interface IStatusColor {
  [key: string]: {
    value: string | number
    color: string
  }
}

// 用于标签状态控制
export interface StatusColorsProps {
  status: number
  text?: string
  type: 'out' | 'inside' | 'saleInside' | 'payOut' | 'deliveInside' | 'inquiry' | 'transformInside' | 'transformOut'
}

export enum ORDER_EXAMINE_ENUM {
  /**
   * 新增订单
   */
  ADD_ORDER = 1,

  /**
   * 一级审核
   */
  ONE_LEVEL_VALIDATE,

  /**
   * 二级审核
   */
  TWO_LEVEL_VALIDATE,

  /**
   * 提交订单中
   */
  SUBMIT_ORDER_PROCESS,

  /**
   *  提交订单成功
   */
  SUBMIT_ORDER_SUCCESS,

  /**
   * 一级审核失败
   */
  ONE_LEVEL_VALIDATE_ERROR,

  /**
   * 二级审核失败
   */
  TWO_LEVEL_VALIDATE_ERROR,
}

export const ORDER_EXAMINE_LIST = [
  '',
  '新增订单',
  '一级审核中',
  '二级审核中',
  '提交订单',
  '提交成功',
  '一级审核不通过',
  '二级审核不通过',
]

// 状态颜色映射
export const StatusColorsMaps = {
  ready: '#C0C4CC',
  process: '#FFC400',
  submit: '#6C9CEB',
  success: '#41CC9E',
  error: '#EF6260',
}

const matchStatusColor = (status: number): string => {
  const maps = {
    [ORDER_EXAMINE_ENUM.ADD_ORDER]: StatusColorsMaps.ready,
    [ORDER_EXAMINE_ENUM.ONE_LEVEL_VALIDATE]: StatusColorsMaps.process,
    [ORDER_EXAMINE_ENUM.TWO_LEVEL_VALIDATE]: StatusColorsMaps.process,
    [ORDER_EXAMINE_ENUM.SUBMIT_ORDER_PROCESS]: StatusColorsMaps.submit,
    [ORDER_EXAMINE_ENUM.SUBMIT_ORDER_SUCCESS]: StatusColorsMaps.success,
  }
  const READY_LISTS = [PurchaseOrderInsideWorkState.CANCEL_ORDER, PurchaseOrderOutWorkState.CANCEL_ORDER]
  // 默认返回错误的状态颜色
  return maps[status] || StatusColorsMaps.error
}
const typeMaps = {
  out: PurchaseOrderOutWorkStateTexts,
  inside: PurchaseOrderInsideWorkStateTexts,
  saleInside: SaleOrderInsideWorkStateTexts,
  payOut: PayOutWorkStateTexts,
  deliveInside: DeliverySideStateTexts,
  inquiry: InquiryStateTexts,
  transformOut: OrderTransformOutWorkStateTexts,
  transformInside: PurchaseOrderTransformInsideWorkStateTexts,
  transformSaleInside: SaleOrderTransformInsideWorkStateTexts,
}

// 订单内部状态显示
const StatusColors: React.FC<StatusColorsProps> = (props) => {
  const { status, type, text = null } = props
  const statusText = typeMaps[type]
  const statusShowColor = matchStatusColor(status)
  // // 单独处理支付比例 确认到账的状态颜色
  // if(type === 'payOut' && status === 3) {
  //   return (<Tag color="#41CC9E">{statusText[status]}</Tag>)
  // }
  return <Tag color={statusShowColor}>{statusText[status] || text}</Tag>
}

StatusColors.defaultProps = {}

export default StatusColors
