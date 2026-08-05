import React from 'react'
import { Radio, Space } from 'antd'

interface Iprops {
  value: number | string
  props: {
    enum: { label: string; value: string | number }[]
  }
  mutators: {
    change: (params: any) => void
  }
}

const FormilyRadio: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators } = props
  const enumData = props?.props?.enum

  const handleOnChange = (e) => {
    mutators.change(e.target.value)
  }
  return (
    <Radio.Group value={value} onChange={handleOnChange}>
      <Space direction="vertical">
        {enumData?.map((_item) => {
          return (
            <Radio key={_item.value} value={_item.value}>
              {_item.label}
            </Radio>
          )
        })}
      </Space>
    </Radio.Group>
  )
}

FormilyRadio.isFieldComponent = true

export default FormilyRadio
