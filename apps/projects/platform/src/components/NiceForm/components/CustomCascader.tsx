import React, { useState, useEffect } from 'react'
import { Input, Space, Select, Button, Cascader } from 'antd'
import { useFieldState, FormPath, FormEffectHooks, useFormEffects } from '@apps/formily'

/**
 * 自定义 Cascader
 */

const CustomCascader = (props) => {
  const justifyAlign = props.props['x-component-props'].align || 'flex-end'
  const [value, setValue] = useState<any>([])

  useFormEffects(() => {
    FormEffectHooks.onFormReset$().subscribe(() => {
      setValue([])
    })
  })

  const onChange = (value, selectedOptions) => {
    // props.mutators.change(value[value.length - 1])
    props.mutators.change(value)
    setValue(value)
  }

  const displayRender = (label) => {
    return label[label.length - 1]
  }

  return (
    <Space size={20} style={{ justifyContent: justifyAlign, width: '100%' }}>
      <Cascader onChange={onChange} value={value} displayRender={displayRender} {...props.props['x-component-props']} />
    </Space>
  )
}

CustomCascader.defaultProps = {}

CustomCascader.isFieldComponent = true

export default CustomCascader
