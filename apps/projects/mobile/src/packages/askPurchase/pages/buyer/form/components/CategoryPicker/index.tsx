import React from 'react'
import { Picker } from '@tarojs/components'

interface IPorps {
  children: React.ReactElement
  value: number
  range: Record<string, any>[]
  onChange: (e) => void
}

const CategoryPicker: React.FC<IPorps> = (props) => {
  const { value, onChange, range, children } = props

  return (
    <Picker range={range} rangeKey="name" mode="selector" value={value} onChange={onChange}>
      {children}
    </Picker>
  )
}

export default CategoryPicker
