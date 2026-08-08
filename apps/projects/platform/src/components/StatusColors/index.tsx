import React, { CSSProperties } from 'react'
import { Badge, Tag } from 'antd'
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
  mode?: string
  type:
    | 'out'
    | 'inside'
    | 'saleInside'
    | 'payOut'
    | 'deliveInside'
    | 'inquiry'
    | 'transformOut'
    | 'transformInside'
    | 'transformSaleInside'
}
const intl = getIntl()
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
  intl.formatMessage({ id: 'transaction_components.xinzengdingdan' }),
  intl.formatMessage({ id: 'transaction_components.yijishenhezhong' }),
  intl.formatMessage({ id: 'transaction_components.erjishenhezhong' }),
  intl.formatMessage({ id: 'transaction_components.tijiaodingdan' }),
  intl.formatMessage({ id: 'transaction_components.tijiaochenggong' }),
  intl.formatMessage({ id: 'transaction_components.yijishenhebutongguo' }),
  intl.formatMessage({ id: 'transaction_components.erjishenhebutongguo' }),
]

// 状态颜色映射
export const StatusColorsMaps = {
  ready: '#C0C4CC', // 灰
  process: '#FFC400', // 黄
  submit: '#6C9CEB', // 蓝
  success: '#41CC9E', // 绿
  suspend: '#87d068', // 淡黄绿
  cancel: '#f50', // 橘
  already: '#41CC9E', // 绿
  error: '#EF6260', // 淡红
}

const matchStatusColor = (status: number): string => {
  const maps = {
    [ORDER_EXAMINE_ENUM.ADD_ORDER]: StatusColorsMaps.ready,
    [ORDER_EXAMINE_ENUM.ONE_LEVEL_VALIDATE]: StatusColorsMaps.process,
    [ORDER_EXAMINE_ENUM.TWO_LEVEL_VALIDATE]: StatusColorsMaps.process,
    [ORDER_EXAMINE_ENUM.SUBMIT_ORDER_PROCESS]: StatusColorsMaps.submit,
    [ORDER_EXAMINE_ENUM.SUBMIT_ORDER_SUCCESS]: StatusColorsMaps.success,
    [ORDER_EXAMINE_ENUM.ONE_LEVEL_VALIDATE_ERROR]: StatusColorsMaps.suspend,
    [ORDER_EXAMINE_ENUM.TWO_LEVEL_VALIDATE_ERROR]: StatusColorsMaps.already,
  }
  // 默认返回错误的状态颜色
  return maps[status] || StatusColorsMaps.error
}

// 订单内部状态显示
const StatusColors: React.FC<StatusColorsProps> = (props) => {
  const { status, type, text = null, mode = null } = props
  const statusShowColor = matchStatusColor(status)

  // 计算中韩字符长度
  let chart = getIntl().i18n.language,
    _text
  if (chart === 'ko-KR' || chart === 'zh-CN') {
    _text = text.replace(/[\uac00-\ud7ff]|[\u4e00-\u9fa5]/g, 'OO')
  } else {
    _text = text
  }

  const css: CSSProperties =
    _text.length >= 16
      ? {
          width: 100,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          backgroundColor: statusShowColor,
          padding: '0 7px',
          borderRadius: '2px',
          color: 'white',
        }
      : {
          width: 'fit-content',
          backgroundColor: statusShowColor,
          padding: '0 7px',
          borderRadius: '2px',
          color: 'white',
        }

  return mode === 'Badge' ? (
    <p style={{ margin: 0 }}>
      <Badge color={statusShowColor} text={text} />
    </p>
  ) : (
    <p style={css} title={text}>
      {text}
    </p>
  )
}

StatusColors.defaultProps = {}

export default StatusColors
