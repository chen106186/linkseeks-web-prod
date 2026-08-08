import { ComponentClass } from 'react'
import { CommonEvent } from '@tarojs/components/types/common'
import GodComponent, { GodIconBaseProps } from './base'

export interface GodGridItem {
  /**
   * 宫格图片
   */
  image?: string
  /**
   * 宫格文字
   */
  value?: string
  /**
   * 宫格图标
   */
  iconInfo?: GodIconBaseProps
  /**
   * 允许用户扩充 Item 字段
   */
  [key: string]: any
}

export interface GodGridProps extends GodComponent {
  /**
   * 宫格布局数据源
   */
  data: Array<GodGridItem>
  /**
   * 每一列有多少个
   */
  columnNum?: number
  /**
   * 是否有边框
   * @default true
   */
  hasBorder?: boolean
  /**
   * 布局模式
   * @default square
   */
  mode?: 'square' | 'rect'
  /**
   * 点击宫格触发的事件
   */
  onClick?: (item: GodGridItem, index: number, event: CommonEvent) => void
}

declare const GodGrid: ComponentClass<GodGridProps>

export default GodGrid
