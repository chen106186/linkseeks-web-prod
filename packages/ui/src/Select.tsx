import React, { useRef } from 'react'
import ClassNames from 'classnames'
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd'
import { useFormContext } from './Form/context'
import { getStringValue } from './utils'
import { DefaultOptionType } from 'antd/lib/select'

export interface SelectProps extends AntdSelectProps {
  /**
   * 多选状态下
   * 必须保留的最少项
   *
   */
  min?:
    | number
    | {
        length: number
        callback(value: any): void
      }

  /**
   * 是否开启默认搜索功能
   */
  isSearch?: boolean

  /**
   * 校验是否可以被修改，返回true则允许执行onChange
   */
  validateChange?(value: any, oldValue: any, option: DefaultOptionType | DefaultOptionType[]): boolean
}

const Select = (props: SelectProps) => {
  const { className, onChange, value, min, isSearch, validateChange, ...reset } = props
  const { preview } = useFormContext(props)
  const stringValue = getStringValue(reset)

  const searchProps = isSearch
    ? {
        showSearch: true,
        filterOption: (input, option) => {
          const label = reset?.fieldNames?.label ? option[reset.fieldNames.label] : option.label
          return (label ?? '').toLowerCase().includes(input.toLowerCase())
        },
      }
    : {}

  const handleOnChange = (newValue: any, option: DefaultOptionType | DefaultOptionType[]) => {
    if (onChange) {
      if (validateChange && !validateChange(newValue, value, option)) {
        return false
      }
      const isMultiple = reset.mode === 'multiple' || reset.mode === 'tags'
      // 通常来说 min应该为1，代表多选状态下，最少都要保留1项，否则不执行
      if (min && isMultiple) {
        const length = typeof min === 'number' ? min : min.length
        const callback = typeof min === 'number' ? () => {} : min.callback
        if (newValue.length < length) {
          callback(newValue)
        } else {
          onChange(newValue, option)
        }
      } else {
        onChange(newValue, option)
      }
    }
  }
  return preview ? (
    <span>{stringValue}</span>
  ) : (
    <AntdSelect
      value={value}
      onChange={handleOnChange}
      className={ClassNames('ui-select', className)}
      allowClear
      {...searchProps}
      {...reset}
    />
  )
}

export default Select
