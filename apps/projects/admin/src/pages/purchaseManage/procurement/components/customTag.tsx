import React from 'react'
import { Tag } from 'antd'
import { BidInStateTexts, BidOutStateTexts, TenderInStateTexts, TenderOutStateTexts } from '@/constants'

// 用于标签状态控制
export interface StatusColorsProps {
  // status: number,
  // /** 招标外部状态 招标内部状态 外部流转状态 内部流转状态 投标内部 投标外部 */
  // type: 'out' | 'inside' | 'transformInside' | 'transformOut' | 'tenderInside' | 'tenderOut'
  text: string
  color: string
}

// 颜色映射
const mapColor = [
  'rgb(96, 98, 102)', // 灰
  'rgb(255, 153, 31)', // 黄
  'rgb(63, 126, 210)', // 蓝
  'rgb(101, 84, 192)', // 紫
  'rgb(230, 63, 59)', // 红
  'rgb(0, 179, 122)', // 绿

  'rgb(96, 98, 102)', // 灰
  'rgb(255, 153, 31)', // 黄
  'rgb(63, 126, 210)', // 蓝
  'rgb(101, 84, 192)', // 紫
  'rgb(230, 63, 59)', // 红
  'rgb(0, 179, 122)', // 绿

  'rgb(96, 98, 102)', // 灰
  'rgb(255, 153, 31)', // 黄
  'rgb(63, 126, 210)', // 蓝
  'rgb(101, 84, 192)', // 紫
  'rgb(230, 63, 59)', // 红
  'rgb(0, 179, 122)', // 绿

  'rgb(96, 98, 102)', // 灰
  'rgb(255, 153, 31)', // 黄
  'rgb(63, 126, 210)', // 蓝
  'rgb(101, 84, 192)', // 紫
  'rgb(230, 63, 59)', // 红
  'rgb(0, 179, 122)', // 绿
]

// 订单内部状态显示
const CustomTag: React.FC<StatusColorsProps> = (props) => {
  // const { status, type } = props
  const { text, color = 'rgb(47, 84, 235)' } = props

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
  // const color = mapColor[status]
  // const statusShowColor = matchStatusColor(status)

  return text ? (
    <span
      style={{
        color: color,
        padding: '2px 4px',
        backgroundColor: `rgba(${color.slice(4, color.length - 1)}, 0.1)`,
        borderRadius: '4px',
        wordBreak: 'keep-all',
      }}
    >
      {text}
    </span>
  ) : null
}

CustomTag.defaultProps = {}

export default CustomTag
