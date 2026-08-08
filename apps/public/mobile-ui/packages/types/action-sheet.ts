import { ComponentClass, CSSProperties } from 'react'
import { CommonEvent } from '@tarojs/components/types/common'

import GodComponent from './base'

export interface ActionsItem {
  name: string
  value: any
}

export interface GodActionSheetProps extends GodComponent {
  /**
   * 是否展示元素
   * @default false
   */
  isOpened: boolean
  /**
   * 元素的标题
   */
  title?: string
  /**
   * 取消按钮的内容
   */
  cancelText?: string
  /**
   * 元素被关闭触发的事件
   */
  onClose?: (event?: CommonEvent) => void
  /**
   * 点击了底部取消按钮触发的事件
   */
  onCancel?: (event?: CommonEvent) => void
  /**
   * 传入一个数组用于控制actionItem的显示， 也可不传入， 直接通过this.props.children
   */
  actions?: ActionsItem[]
  /**
   * 选择actionsItem时触发的点击事件， 只有当actions属性被设置时生效
   */
  onSelect?(event?: CommonEvent, item?: ActionsItem): void
  /**
   * 外层container额外注入className
   */
  customContainerStyle?: CSSProperties | string

  bodyStyle?: CSSProperties | string
}

export interface GodActionSheetState {
  _isOpened: boolean
}

export interface GodActionSheetHeaderProps extends GodComponent {}

export interface GodActionSheetFooterProps extends GodComponent {
  onClick?: Function
}

export interface GodActionSheetBodyProps extends GodComponent {
  bodyStyle?: CSSProperties | string
}

export interface GodActionSheetItemProps extends GodComponent {
  /**
   * 点击 Item 触发的事件
   */
  onClick?: (event?: CommonEvent) => void
}

type GodActionSheetItem = ComponentClass<GodActionSheetItemProps>

type GodActionSheet = ComponentClass<GodActionSheetProps>

export default GodActionSheet

export { GodActionSheetItem }
