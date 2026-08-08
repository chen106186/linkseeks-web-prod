import React, { memo, useState, useEffect } from 'react'
import { Radio, RadioGroupProps } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import styles from './index.less'

export interface PropsType {
  value?: any
  onChange?: (value: any) => void
  onValueChange?: (value: any, item?: any) => void
  children?: React.ReactNode
}

const CommonFormValueChange = (props: PropsType) => {
  const { value, onValueChange, onChange, children } = props

  useEffect(() => {
    onValueChange?.(value)
  }, [value])

  return (
    <>
      {children &&
        React.Children.map(children, (child: any, index: number) => {
          if (child) {
            return React.cloneElement(child, { value, onChange })
          }
          return false
        })}
    </>
  )
}
export default memo(CommonFormValueChange)
