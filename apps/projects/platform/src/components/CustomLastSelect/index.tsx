import React, { useRef } from 'react'
import { Select } from 'antd'

const CustomSelect = (props: any) => {
  const { onChange, value, onLastValueChange, ...rest } = props
  // 存储选择的值，在下一次 onChange 之前通过 onLastValueChange 将值传出去，即可达到拿到‘上一次选择的值’的效果
  const valueRef = useRef<any>()

  const _onChange = (val: any) => {
    onLastValueChange?.(valueRef.current || value, val)
    onChange?.(val)
    valueRef.current = val
  }

  return (
    <Select
      onChange={_onChange}
      value={value}
      fieldNames={{ label: 'name', value: 'code' }}
      {...rest}
    />
  )
}

export default CustomSelect
