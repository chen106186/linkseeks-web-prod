import React, { useState, useEffect } from 'react'
import { Select, SelectProps } from 'antd'
import { useIntl } from '@linkseeks/i18n'

export interface PropsType<VT> extends SelectProps<VT> {
  requestApi?: Function
  params?: Object
  labelKey?: string
  valueKey?: string
  onChange?: (val: any) => void
  value?: any
  valueType?: 'single' | 'object'
  customId?: string
  customName?: string
}

const FetchSelect = (props: PropsType<number>) => {
  const intl = useIntl()
  const {
    requestApi,
    params = {},
    labelKey = 'name',
    valueKey = 'id',
    customId = 'id',
    customName = 'name',
    onChange,
    value,
    valueType = 'single',
    ...rest
  } = props

  const [options, setOptions] = useState<any[]>([])
  const [val, setVal] = useState<any>()

  // 请求数据
  const getOptionsData = async () => {
    if (requestApi) {
      const res = await requestApi(params)
      if (res.code === 1000) {
        const data = res.data?.data || res.data
        const newOptions: any[] = data?.map((item) => {
          return {
            label: item[labelKey],
            value: item[valueKey],
          }
        })
        setOptions(newOptions)
      }
    }
  }

  const _onChange = (v, o) => {
    onChange?.(
      valueType === 'single'
        ? v
        : {
            [customId]: v,
            [customName]: o.label,
          },
    )
  }

  useEffect(() => {
    getOptionsData()
  }, [])

  useEffect(() => {
    if (value) {
      if (valueType === 'single') {
        setVal(value)
      } else {
        setVal(value[customId])
      }
    }
  }, [value])

  return (
    <Select
      options={options}
      placeholder={intl.formatMessage({ id: 'common.select', defaultMessage: '请选择' })}
      value={val}
      onChange={_onChange}
      {...rest}
    />
  )
}

export default FetchSelect
