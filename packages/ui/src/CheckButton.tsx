import React, { CSSProperties, ReactNode, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import mx from 'classnames'
import { Space, message } from 'antd'

export interface CheckButtonProps {
  value?: any
  onChange?(value: any): void
  disabled?: boolean
  className?: string
  style?: StyleSheet
  children?: ReactNode
  checked?: boolean
}

export interface CheckButtonGroupProps {
  value?: any
  onChange?(value: any): void
  size?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
  after?: ReactNode
  onlyRequired?: string

  /**
   * 是否单选
   */
  only?: boolean
}

export const CheckButton = forwardRef((props: CheckButtonProps, ref) => {
  const { className, value, onChange, children, checked, style } = props

  const handleClick = () => {
    onChange && onChange(value)
  }
  return (
    <div className={mx('ui-checkbutton', checked && 'active', className)} onClick={handleClick}>
      {children}
    </div>
  )
})

export const CheckButtonGroup = (props: CheckButtonGroupProps) => {
  const { value = [], onChange, size, after, onlyRequired, only, children } = props
  return (
    <Space size={size} wrap>
      {React.Children.map(children, (child: any, index) => {
        const ref = useRef<any>({})

        const handleChange = (v: any) => {
          if (only) {
            onChange && onChange([v])
            return
          }
          const targetIndex = value.indexOf(v)
          if (targetIndex === -1) {
            onChange && onChange([...value, v])
          } else {
            if (value.length === 1 && onlyRequired) {
              message.error(onlyRequired)
              return
            }
            value.splice(targetIndex, 1)
            onChange && onChange([...value])
          }
        }
        return React.cloneElement(child, {
          onChange: handleChange,
          checked: value.includes(child.props.value),
          ref,
          style: { display: 'block' },
        })
      })}
      {after}
    </Space>
  )
}
export default CheckButton
