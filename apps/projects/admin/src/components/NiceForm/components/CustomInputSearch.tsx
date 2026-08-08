import React, { useState, useEffect } from 'react'
import { Input, Space, Select, Button } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import { useFieldState, FormPath, FormEffectHooks, useFormEffects } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

/**
 * 筛选项 搜索和远程数据结合的select
 * search的值暂存至schema的props下的searchValue
 * option数据暂存至schema的props下的dataOption
 */

const { Option } = Select

const CustomInputSearch = (props) => {
  const { form } = props
  const justifyAlign = props.props['x-component-props'].align || 'flex-end'
  const option = props.props['x-component-props'].dataoption

  const [dataOption, setDataOption] = useState<any>([])

  useEffect(() => {
    setDataOption(option)
  }, [option])

  const handleValueSearch = (value: any) => {
    form.setFieldState(props.props.key, (state) => {
      state.props['x-component-props'].searchValue = value // search的值暂存至schema的props下的searchValue
    })
  }

  return (
    <Space size={20} style={{ justifyContent: justifyAlign, width: '100%' }}>
      <Select
        onSearch={(value) => handleValueSearch(value)}
        onChange={(v) => props.mutators.change(v)}
        value={props.value}
        {...props.props['x-component-props']}
      >
        {dataOption?.map((d) => (
          <Option value={d.id} key={d.id}>
            {d.name}
          </Option>
        ))}
      </Select>
    </Space>
  )
}

CustomInputSearch.defaultProps = {}

CustomInputSearch.isFieldComponent = true

export default CustomInputSearch
