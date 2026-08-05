import React, { useState, useEffect } from 'react'
import { getImageInfo } from '@apps/mobile-services/utils/taro'
import { Image } from '@apps/mobile-ui'

interface AutoImgProps {
  /**
   * 图片源
   */
  source: string
  /**
   * 图片宽度，不支持百分比，只支持数值
   */
  width: number
}

const AutoImg: React.FC<AutoImgProps> = (props: AutoImgProps) => {
  const { source, width } = props
  const [height, setHeight] = useState(0)

  const initImgHeight = () => {
    getImageInfo({
      src: source,
      success: (result) => {
        setHeight((width * result.height) / result.width)
      },
    })
  }

  useEffect(() => {
    initImgHeight()
  }, [source])

  return (
    <Image
      src={source}
      style={{
        width,
        height,
      }}
    />
  )
}

export default AutoImg
