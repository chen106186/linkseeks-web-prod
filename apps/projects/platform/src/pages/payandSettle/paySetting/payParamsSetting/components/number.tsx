import React, { useState, ReactNode, useEffect } from 'react'
import { Input } from 'antd'

interface NumberInputProps {
  /** 带标签的 input，设置后置标签 */
  addonAfter?: ReactNode
  /** 带标签的 input，设置前置标签 */
  addonBefore?: ReactNode
  /** 回显数据 */
  fieldValue?: string
  /** 输入框内容变化时的回调 */
  onChange?: Function
  /** 正则表达式 */
  pattern?: RegExp
}

const NumericInput = (props) => {
  const { value, onChange, addonAfter, addonBefore, pattern } = props

  const handleChange = (e) => {
    const { value } = e.target
    // const reg = /^(\-)?\d+(\.(\d){0,2})?$/;
    const reg = pattern
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onChange(value)
    }
  }

  const handleBulur = () => {
    let valueTemp = value
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1)
    }
    onChange(valueTemp.replace(/0*(\d+)/, '$1'))
  }

  return (
    <Input
      value={value}
      onChange={handleChange}
      onBlur={handleBulur}
      addonAfter={addonAfter}
      addonBefore={addonBefore}
    />
  )
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const { fieldValue, onChange, addonAfter, addonBefore, pattern } = props
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setValue(e)
    onChange(e)
  }

  useEffect(() => {
    if (fieldValue) {
      setValue(fieldValue)
    }
  }, [fieldValue])

  return (
    <NumericInput
      value={value}
      onChange={handleChange}
      addonAfter={addonAfter}
      addonBefore={addonBefore}
      pattern={pattern}
    />
  )
}

export default NumberInput
