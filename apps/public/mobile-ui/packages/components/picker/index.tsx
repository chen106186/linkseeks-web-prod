import React from 'react'
import { Picker } from '@tarojs/components'
import { GodPickerProps } from '../../types/picker'


const GodPicker:React.FC<GodPickerProps> = (props) => {
  return <Picker
    {...props}
  />
}

GodPicker.defaultProps = {}

export default GodPicker
