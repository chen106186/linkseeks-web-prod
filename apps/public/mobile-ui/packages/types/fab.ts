import { ComponentClass } from 'react'
import { CommonEventFunction } from '@tarojs/components/types/common'


import GodComponent from './base'

export interface GodFabProps extends GodComponent {
  /**
   * 大小尺寸
   * @default 'normal'
   */
  size?: 'normal' | 'small'
  /**
   * 点击标签时触发
   */
  onClick?: CommonEventFunction
}

declare const GodFab: ComponentClass<GodFabProps>

export default GodFab
