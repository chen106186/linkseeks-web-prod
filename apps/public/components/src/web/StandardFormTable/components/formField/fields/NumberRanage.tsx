import NumberRanage from '../../../../NumberRanage'
import React, { useState } from 'react'

const NumberRanageField = ({ name, value, onChange, innerStyle, placeholder }: any) => {
  const [minValue, setMinValue] = useState<number>()
  const [maxValue, setMaxValue] = useState<number>()
  if (Array.isArray(name)) {
    const handleSetMinValue = (value) => {
      setMinValue(value)
      onChange([value, maxValue])
    }

    const handleSetMaxValue = (value) => {
      setMaxValue(value)
      onChange([minValue, value])
    }
    return (
      <NumberRanage
        name={name}
        value={[minValue, maxValue]}
        onChange={[handleSetMinValue, handleSetMaxValue]}
        innerStyle={innerStyle}
        placeholder={placeholder}
      />
    )
  } else {
    console.error('numberRanage 必须传入数组类型的name， [min, max]')
    return null
  }
}

export default NumberRanageField
