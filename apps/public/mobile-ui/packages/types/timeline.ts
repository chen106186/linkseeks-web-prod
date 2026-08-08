import { ComponentClass, ReactNode } from 'react'

import GodComponent from './base'

export interface Item {
  /**
   * 标题
   */
  title: ReactNode
  /**
   * 子项内容
   */
  content?: ReactNode[]
  /**
   * 自定义 icon
   */
  icon?: string
  /**
   * icon 颜色
   * @default 'blue'
   */
  color?: 'blue' | 'green' | 'red' | 'yellow'
}

export interface GodTimelineProps extends GodComponent {
  /**
   * 最后一项是否为未完成态
   * @default false
   */
  pending?: boolean
  /**
   * 需展示的内容
   */
  items: Array<Item>
}

declare const GodTimeline: ComponentClass<GodTimelineProps>

export default GodTimeline
