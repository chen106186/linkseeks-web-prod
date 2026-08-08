import React, { CSSProperties } from 'react'
import { getIntl } from '@linkseeks/i18n'

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
  type: 'out' | 'inside' | 'saleInside'
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

  // 默认返回错误的状态颜色
  return maps[status] || StatusColorsMaps.error
}

// 订单内部状态显示
const StatusColors: React.FC<StatusColorsProps> = (props) => {
  const { status, type, text = null } = props
  const statusShowColor = matchStatusColor(status)
  // 优先显示 后端返回的状态文本
  // return (<Tag color={statusShowColor}>{text}</Tag>)

  // 计算中韩字符长度
  let chart = getIntl().i18n.language,
    _text
  if (chart === 'ko-KR' || chart === 'zh-CN') {
    _text = text.replace(/[\uac00-\ud7ff]|[\u4e00-\u9fa5]/g, 'OO')
  } else {
    _text = text
  }

  const css: CSSProperties =
    _text.length > 16
      ? {
          width: 100,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          backgroundColor: statusShowColor,
          padding: '0 7px',
          borderRadius: '2px',
          color: 'white',
          marginBottom: 0,
        }
      : {
          width: 'fit-content',
          backgroundColor: statusShowColor,
          padding: '0 7px',
          borderRadius: '2px',
          color: 'white',
          marginBottom: 0,
        }

  return (
    <p style={css} title={text}>
      {text}
    </p>
  )
}

StatusColors.defaultProps = {}

export default StatusColors
