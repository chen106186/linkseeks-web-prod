import React from 'react'
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd'
import mixins from 'classnames'
export interface ButtonProps extends Omit<AntdButtonProps, 'type'> {
  type?: 'default' | 'primary' | 'secondary' | 'ghost' | 'dashed' | 'link' | 'text' | 'normal' | 'link-compact'
}

const excludeTypes = ['normal', 'link-compact']
const Button = (props: ButtonProps) => {
  const { type = 'default', className, ...resetButtonProps } = props

  const isExcludeType = excludeTypes.includes(type as any)
  const mixinsType = isExcludeType ? 'text' : type

  const mixinsClassName = mixins('ui-button', isExcludeType ? `ui-button-${type}` : '', className)

  return <AntdButton type={mixinsType as any} className={mixinsClassName} {...resetButtonProps} />
}

export default Button
