/*
 * @Description: 省市区选择组件子项
 */
import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import { getManageAreaByPcode } from '@apps/apis'

export type AreaSelectValueType = {
  /**
   * 名称
   */
  name?: string
  /**
   * 编码
   */
  code: string
}

export type OptionType = {
  label: string
  value: string
}

interface AreaSelectItemProps {
  /**
   * 父级code，null 表示第一层级，也就是省
   */
  pcode: string | undefined
  /**
   * 值，code数组
   */
  value?: AreaSelectValueType
  /**
   * 选择触发改变
   */
  onChange?: (value: AreaSelectValueType) => void
  /**
   * 自定义外部 className
   */
  customClassName?: string
  /**
   * placeholder
   */
  placeholder?: string
}

const AreaSelectItem: React.FC<AreaSelectItemProps> = (props) => {
  const { pcode, value, onChange, customClassName, placeholder } = props

  const [innerValue, setInnerValue] = useState<string | undefined>(undefined)
  const [options, setOptions] = useState<OptionType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getAreaByPcode = (code?: string) =>
    getManageAreaByPcode({
      pcode: code,
    })

  const initProvinceOptions = async () => {
    if (pcode === undefined) {
      setOptions([])
      return
    }
    setLoading(true)
    const res = await getAreaByPcode(pcode)
    if (res.code === 1000) {
      setOptions(res.data.map((item) => ({ label: item.name, value: item.code })))
    }
    setLoading(false)
  }

  useEffect(() => {
    initProvinceOptions()
  }, [pcode])

  useEffect(() => {
    if ('value' in props) {
      setInnerValue(value?.code)
    }
  }, [value])

  const triggerChange = (value: any) => {
    if (onChange) {
      onChange(value)
    }
  }

  const handleSelectChange = (value: string) => {
    if (!('value' in props)) {
      setInnerValue(value)
    }
    triggerChange(
      value
        ? {
            name: options.find((curOptions) => curOptions.value === value)?.label || '',
            code: value,
          }
        : undefined,
    )
  }

  return (
    <Select
      className={customClassName}
      options={options}
      value={innerValue}
      onChange={handleSelectChange}
      loading={loading}
      placeholder={placeholder}
      allowClear
    />
  )
}

export default AreaSelectItem
