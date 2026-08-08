import React from 'react'
import CountryPhone from '.'
import { OptionsType, ValueType } from '.'

interface Iprops {
  editable: boolean
  value: ValueType
  mutators: {
    change: (params: ValueType) => void
  }
  props: {
    enum: OptionsType[]
  }
}

const FormilyCountryPhone: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, editable } = props

  const formatValue = (data) => {
    if (typeof data === 'undefined' || !data) {
      return {
        code: '',
        phone: '',
      }
    }
    return data
  }

  const formattedValue = formatValue(value)
  const handleChange = (data: ValueType) => {
    props.mutators.change?.(data)
  }

  return (
    <CountryPhone
      disable={!editable}
      countryOptions={props.props?.enum}
      value={formattedValue}
      onChange={handleChange}
    />
  )
}

FormilyCountryPhone.isFieldComponent = true

export default FormilyCountryPhone
