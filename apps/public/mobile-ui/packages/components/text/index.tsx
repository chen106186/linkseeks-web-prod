import React from 'react'
import { Text as TaroText } from '@tarojs/components'
import { GodTextProps } from '../../types/text'


const GodText:React.FC<GodTextProps> = (props) => {
  return <TaroText
    { ...props }
  />
}

GodText.defaultProps = {}

export default GodText
