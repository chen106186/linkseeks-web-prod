import { ComponentClass } from 'react'
import { CommonEventFunction } from '@tarojs/components/types/common'

import GodComponent from './base'

export interface GodRateProps extends GodComponent {
  /**
   * 评分星星大小
   * @default 20
   */
  size?: number
  /**
   * 显示的评分icon是否是实心，默认为实心
   */
  isFill?: boolean
  /**
   * 当前评分,开发者需要通过 onChange 事件来更新 value 值，必填
   */
  value?: number
  /**
   * 最大评分
   * @default 5
   */
  max?: number
  /**
   * 星星间隔,单位根据环境自动转为 rpx 或 rem
   * @default 5
   */
  margin?: number
  /**
   * 输入框值改变时触发的事件，开发者需要通过 onChange 事件来更新 value 值变化，但不填写 onChange 函数时，该组件只读
   */
  onChange?: CommonEventFunction
}

declare const GodRate: ComponentClass<GodRateProps>

export default GodRate
