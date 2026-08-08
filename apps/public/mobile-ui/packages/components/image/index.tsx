import React from 'react'
import { Image as TaroImage } from '@tarojs/components'
import { GodImageProps } from '../../types/image'


const GodImage:React.FC<GodImageProps> = (props) => {
  return <TaroImage
    { ...props }
  />
}

GodImage.defaultProps = {}

export default GodImage
