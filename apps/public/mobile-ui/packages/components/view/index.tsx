import React from 'react'
import { View as TaroView } from '@tarojs/components'
import { GodViewProps } from '../../types/view'


const GodView:React.FC<GodViewProps> = (props) => {
  return <TaroView
    { ...props }
  />
}

GodView.defaultProps = {}

export default GodView
