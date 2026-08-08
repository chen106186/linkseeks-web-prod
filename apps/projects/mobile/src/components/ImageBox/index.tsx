import React from 'react'
import { pxTransform, previewImage } from '@apps/mobile-services/utils/taro'
import { View, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import classNames from 'classnames'
import './index.scss'

// const defaultImg = getOssUrlPath('/miniprogram/assets/images/default_img.png')
// https://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/other/bce2cd4563774e919e1026cd9e5679fb.png

const defaultImg = getOssUrlPath(
  '/other/bce2cd4563774e919e1026cd9e5679fb.png',
  'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com',
)

// https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com:443/other/bce2cd4563774e919e1026cd9e5679fb.png

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
  const _width = width !== undefined ? (typeof width === 'string' ? width : pxTransform(width)) : ''
  const _height = height !== undefined ? (typeof height === 'string' ? height : pxTransform(height)) : ''
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
  width: undefined,
  height: undefined,
  style: {},
  lazyLoad: false,
  resizeMode: 'aspectFit',
  borderRadius: 4,
  canPreview: false,
  onPress: undefined,
}

export default ImageBox
