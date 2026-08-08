import React from 'react'
import { pxTransform, previewImage } from '@apps/mobile-services/utils/taro'
import { View, Image } from '@apps/mobile-ui'
import classNames from 'classnames'
import defaultImg from '@/assets/images/default_img.png'
import './index.scss'

interface ImageBoxPropsType {
  width?: number | string
  height?: number | string
  source: string
  /**
   * 自定义外部容器 className
   */
  className?: string
  /**
   * 自定义外部容器 style
   */
  style?: string | React.CSSProperties
  resizeMode?:
    | 'scaleToFill'
    | 'aspectFit'
    | 'aspectFill'
    | 'widthFix'
    | 'heightFix'
    | 'top'
    | 'bottom'
    | 'center'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
  borderRadius?: number | string
  canPreview?: boolean
  lazyLoad?: boolean
  onPress?: ((event: any) => void) | undefined
}

const ImageBox = (props: ImageBoxPropsType) => {
  const {
    width,
    height,
    source = '',
    style,
    lazyLoad,
    borderRadius,
    resizeMode,
    canPreview,
    onPress,
    className,
  } = props
  const _width = width !== undefined ? (typeof width === 'string' ? width : pxTransform(width)) : 'auto'
  const _height = height !== undefined ? (typeof height === 'string' ? height : pxTransform(height)) : 'auto'
  const _borderRadius =
    borderRadius !== undefined ? (typeof borderRadius === 'string' ? borderRadius : pxTransform(borderRadius)) : 'auto'
  const showImgBg = () => {
    if (canPreview || onPress) {
      return (
        <View
          style={{ width: _width, height: _height, borderRadius: _borderRadius, overflow: 'hidden' }}
          onClick={(e: any) => {
            if (canPreview) {
              previewImage({
                current: source, // 当前显示图片的http链接
                urls: [source], // 需要预览的图片http链接列表
              })
            } else if (onPress) {
              onPress(e)
            }
          }}
        >
          <Image
            mode={resizeMode}
            style={{ width: _width, height: _height, borderRadius: _borderRadius, overflow: 'hidden' }}
            src={source}
            lazyLoad={lazyLoad}
          />
        </View>
      )
    }
    return (
      <Image
        mode={resizeMode}
        style={{ width: _width, height: _height, borderRadius: _borderRadius, overflow: 'hidden' }}
        src={source}
        lazyLoad={lazyLoad}
      />
    )
  }

  return (
    <View className={classNames('image-box', className)} style={style}>
      {source ? (
        showImgBg()
      ) : (
        <Image
          mode={resizeMode}
          style={{ width: _width, height: _height, borderRadius: _borderRadius, overflow: 'hidden' }}
          src={defaultImg}
          lazyLoad={lazyLoad}
        />
      )}
    </View>
  )
}

ImageBox.defaultProps = {
  // width: 106,
  // height: 106,
  style: {},
  lazyLoad: false,
  resizeMode: 'scaleToFill',
  // borderRadius: 4,
  canPreview: false,
  onPress: undefined,
}

export default ImageBox
