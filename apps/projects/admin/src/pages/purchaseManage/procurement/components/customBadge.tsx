import React from 'react'
import { BidInStateTexts, BidOutStateTexts, TenderInStateTexts, TenderOutStateTexts } from '@/constants'

// 用于标签状态控制
export interface StatusColorsProps {
  // status: number,
  // /** 招标外部状态 招标内部状态 外部流转状态 内部流转状态 投标内部 投标外部 */
  // type: 'out' | 'inside' | 'transformInside' | 'transformOut' | 'tenderInside' | 'tenderOut'
  text: string
  color: string
}

// className映射
const classNameMap = [
  'commonStatusStop', // 灰色
  'commonStatusInvalid', // 黄色
  'commonStatusModify', // 蓝色
  'commonStatusValid', // 绿色

  'commonStatusStop', // 灰色
  'commonStatusInvalid', // 黄色
  'commonStatusModify', // 蓝色
  'commonStatusValid', // 绿色

  'commonStatusStop', // 灰色
  'commonStatusInvalid', // 黄色
  'commonStatusModify', // 蓝色
  'commonStatusValid', // 绿色

  'commonStatusStop', // 灰色
  'commonStatusInvalid', // 黄色
  'commonStatusModify', // 蓝色
  'commonStatusValid', // 绿色

  'commonStatusStop', // 灰色
  'commonStatusInvalid', // 黄色
  'commonStatusModify', // 蓝色
  'commonStatusValid', // 绿色
]

// 订单内部状态显示
const CustomBadge: React.FC<StatusColorsProps> = (props) => {
  // const { status, type } = props
  const { text, color = '#2f54eb' } = props

  const typeMaps = {
    /** 招标外部状态 */
    out: BidOutStateTexts,
    /** 招标内部状态 */
    inside: BidInStateTexts,
    /** 投标内部状态 */
    tenderInside: TenderInStateTexts,
    /** 投标外部状态 */
    tenderOut: TenderOutStateTexts,
  }

  // const statusText = typeMaps[type]

  return text ? (
    <>
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          marginRight: '6px',
          borderRadius: '50%',
          verticalAlign: 'middle',
          backgroundColor: color,
        }}
      ></span>
      <span style={{ wordBreak: 'keep-all' }}>{text}</span>
    </>
  ) : null
}

CustomBadge.defaultProps = {}

export default CustomBadge
