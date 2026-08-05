import React from 'react'
import { Space, Select } from '@linkseeks/ui'
import { useField } from '@apps/form'
const { Option } = Select

interface CustomInputSearchProps {
  align?: string
  dataoption?: any
  showSearch?: boolean
  showArrow?: boolean
  defaultActiveFirstOption?: boolean
  placeholder?: string
  style?: any
  notFoundContent?: string
}

const CustomInputSearch = (props: CustomInputSearchProps) => {
  const justifyAlign = props.align || 'flex-end'
  const option = props.dataoption
  const field = useField()

  const onChange = (value: any) => {
    field.setState((state) => {
      state.value = value
    })
  }

  return (
    <Space size={20} style={{ justifyContent: justifyAlign, width: '100%' }}>
      <Select
        optionLabelProp="label"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        showSearch={props.showSearch}
        showArrow={props.showArrow}
        defaultActiveFirstOption={props.defaultActiveFirstOption}
        placeholder={props.placeholder}
        style={props.style}
        notFoundContent={props.notFoundContent}
        onChange={onChange}
      >
        {option?.map((d) => (
          <Option value={d.id} label={d.name} key={d.id}>
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
