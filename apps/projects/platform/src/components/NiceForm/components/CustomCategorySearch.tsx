import React, { useState, useEffect } from 'react'
import { Space, Cascader } from 'antd'
import { FormEffectHooks, useFormEffects } from '@apps/formily'

/**
 * 筛选项 搜索和远程数据结合的 Cascader
 * 属性Data数据暂存至schema的props下的dataOption
 */

const CustomCategorySearch = (props) => {
  const justifyAlign = props.props['x-component-props'].align || 'flex-end'
  const option = props.props['x-component-props'].dataoption

  const [dataOption, setDataOption] = useState<any>([])
  const [value, setValue] = useState<any>([])

  useEffect(() => {
    setDataOption(option)
  }, [option])

  useFormEffects(() => {
    FormEffectHooks.onFormReset$().subscribe(() => {
      setValue([])
    })
  })

  const onChange = (value, selectedOptions) => {
    if (value && value.length > 0) {
      props.mutators.change(value[value.length - 1])
    } else {
      props.mutators.change(undefined)
    }
    setValue(value)
  }

  const displayRender = (label) => {
    return label[label.length - 1]
  }

  return (
    <Space size={20} style={{ justifyContent: justifyAlign, width: '100%' }}>
      <Cascader
        options={dataOption}
        onChange={onChange}
        value={value}
        getPopupContainer={() => document.querySelector('main')}
        displayRender={displayRender}
        {...props.props['x-component-props']}
      />
    </Space>
  )
}

CustomCategorySearch.defaultProps = {}

CustomCategorySearch.isFieldComponent = true

export default CustomCategorySearch
