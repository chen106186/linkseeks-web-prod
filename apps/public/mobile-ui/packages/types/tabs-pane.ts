import { ComponentClass } from 'react'

import GodComponent from './base'

export interface GodTabsPaneProps extends GodComponent {
  /**
   * Tab 方向，请跟 GodTabs 保持一致
   * @default 'horizontal'
   */
  tabDirection?: 'horizontal' | 'vertical'
  /**
   * 当前选中的标签索引值，从 0 计数，请跟 GodTabs 保持一致
   * @default 0
   */
  current: number
  /**
   * tabPane 排序，从 0 计数
   * @default 0
   */
  index: number,
  /**
   * 切换模式
   * TabsPane 显示模式，请跟 GodTabs 保持一致
   * @default false
   * 为 ture 的话会去掉transform, 改为display 显示tabsPane
   */
   display?: boolean,
}

declare const GodTabsPane: ComponentClass<GodTabsPaneProps>

export default GodTabsPane
