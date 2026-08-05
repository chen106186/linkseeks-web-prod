import React, { CSSProperties } from 'react'
import { Image, ImageProps } from 'antd'

interface ImageBoxProps extends ImageProps {
  /** 圆角大小， 默认0 */
  round?: number
  /**
   * 默认：cover
   * contain: 保持原有尺寸比例，使图片的宽度完整的显示，高度自动缩放。
   * cover: 保持原有尺寸比例。高度铺满容器，宽度等比缩放，超出部分被剪掉。
   * fill: 不保证保持原有的比例，内容全部显示铺满容器
   * scale-down: 保持原有比例。当图片实际宽高小于所设置的图片宽高时，显示效果与none一致；否则，显示效果与contain一致
   * none: 图片原有宽高不变，超出部分被剪掉，保留下来的内容使图片的正中央。
   */
  resizeMode?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /**
   * 是否圆形
   */
  circle?: boolean
}

const ImageBox: React.FC<ImageBoxProps> = (props) => {
  const {
    round = 0,
    preview = false,
    resizeMode = 'contain',
    circle = false,
    className,
    style,
    wrapperStyle,
    ...reset
  } = props

  const defaultStyle: CSSProperties = {
    objectFit: resizeMode,
  }

  const defaultWrapperStyle: CSSProperties = {
    borderRadius: circle ? '50%' : round + 'px',
    overflow: 'hidden',
  }

  return (
    <Image
      preview={preview}
      className={className}
      wrapperStyle={{
        ...defaultWrapperStyle,
        ...wrapperStyle,
      }}
      style={{
        ...defaultStyle,
        ...style,
      }}
      {...reset}
    />
  )
}

export default ImageBox
