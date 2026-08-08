export interface CheckboxProps {
  /**
   * 是否选中
   */
  checked?: boolean
  /**
   * 是否选中
   */
  value?: string | number
  /**
   * 选择触发
   */
  onChange?: (checked: boolean) => void
  /**
   * 选中颜色，默认主题色
   */
  color?: string
  /**
   * 大小，默认18
   */
  size?: number

  children?: React.ReactNode

  style?: React.CSSProperties

  stopPropagation?: boolean
}

export interface CheckboxData {
  /**
   * 选中的值
   */
  value: any[]
  /**
   * 选中改变触发事件
   */
  toggleChange: ((value: any) => void) | undefined
  /**
   * 是否禁用
   */
  disabled: boolean
  /**
   * checkbox 大小，默认 22
   */
  size: number
}
