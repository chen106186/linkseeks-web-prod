/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-03 14:43:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-03 15:02:18
 * @Description: 级联选择器
 */
import React from 'react'
import { Cascader } from 'antd'

const CascaderFormItem = (props) => {
  const { value, mutators, editable } = props

  const handleChange = (next: React.Key[]) => {
    mutators.change(next)
  }

  return (
    <Cascader
      disabled={!editable}
      {...(props.props['x-component-props'] || {})}
      value={value}
      onChange={handleChange}
    />
  )
}

CascaderFormItem.isFieldComponent = true

export default CascaderFormItem
