import React, { useState, useEffect } from 'react'
import { Select, SelectProps } from 'antd'

export interface PropsType<VT> extends SelectProps<VT> {
  requestApi?: Function
  params?: Object
  labelKey?: string
  valueKey?: string
}

const FetchSelect = (props: PropsType<number>) => {
  const { requestApi, params = {}, labelKey = 'label', valueKey = 'value', ...rest } = props

  const [options, setOptions] = useState<any[]>([])

  // 请求数据
  const getOptionsData = async () => {
    if (requestApi) {
      const res = await requestApi(params)
      if (res.code === 1000) {
        const newOptions: any[] = res.data?.map((item) => {
          return {
            label: item[labelKey],
            value: item[valueKey],
          }
        })
        setOptions(newOptions)
      }
    }
  }

  useEffect(() => {
    getOptionsData()
  }, [])

  return (
    <Select
      options={options}
      showSearch
      optionFilterProp={labelKey}
      onSearch={() => {}}
      filterOption={(input, option) => {
        return (option?.label as any)?.toLowerCase()?.includes(input?.toLowerCase())
      }}
      {...rest}
    />
  )
}

export default FetchSelect
