import { ComponentClass } from 'react'

import GodComponent from './base'

export interface IndexItem {
  /**
   * 列表项内容
   */
  name: string

  [propName: string]: any
}

export interface IndexListItem {
  /**
   * 列表标题
   */
  title: string
  /**
   * 右侧导航标题
   */
  key: string
  /**
   * 列表项
   */
  items: Array<IndexItem>
}

export interface GodIndexesListProps extends GodComponent {
  /**
   * 是否开启跳转过渡动画
   * @default false
   */
  animation?: boolean
  /**
   * 右侧导航第一个名称
   * @default Top
   */
  topKey?: string
  /**
   * 是否切换 key 的震动
   * **注意：** 只在微信小程序有效
   * @default true
   */
  isVibrate?: boolean
  /**
   * 是否用弹框显示当前 key
   */
  isShowToast?: boolean
  /**
   * 列表
   */
  list: Array<IndexListItem>
  /**
   * 自定义列表
   */
  renderItem?: (item: any, index?: number) => React.ReactNode
  /**
   * 列表容器样式
   */
  itemWrapClassName?: string
  /**
   * 点击列表项触发事件
   */
  onClick?: (item: IndexItem) => void
  /**
   * 获取跳转事件跳转到指定 key
   */
  onScrollIntoView?: (fn: (key: string) => void) => void
}

export interface GodIndexesState {
  _scrollIntoView: string
  _scrollTop: number
  _tipText: string
  isWEB: boolean
  currentIndex: number | undefined
}

declare const GodIndexes: ComponentClass<GodIndexesListProps>

export default GodIndexes
