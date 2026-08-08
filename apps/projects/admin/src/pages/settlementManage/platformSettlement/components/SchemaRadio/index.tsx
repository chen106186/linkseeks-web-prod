/*
 * @Author: your name
 * @Date: 2020-10-20 16:25:45
 * @Description: switch 组件
 */

import React, { useEffect } from 'react'
import { Radio } from 'antd'

const SchemaRadio = (props) => {
  const editable = props.editable
  const componentProps = props.props['x-component-props']
  const options = componentProps.enum
  const handleChange = (checked) => {
    props.mutators.change(checked)
  }

  useEffect(() => {
    const componentProps = props.props['x-component-props'] || {}
    const defaultValue = componentProps.default || {}
    if (typeof props.initialValue == 'undefined') {
      props.mutators.change(defaultValue)
    } else {
      props.mutators.change(props.initialValue)
    }
  }, [props.initialValue])

  return (
    <Radio.Group onChange={handleChange} value={props.value || componentProps.default}>
      {options.map((item) => {
        return (
          <Radio value={item.value} key={item.value}>
            {item.label}
          </Radio>
        )
      })}
    </Radio.Group>
  )
}

SchemaRadio.isFieldComponent = true

export default SchemaRadio
