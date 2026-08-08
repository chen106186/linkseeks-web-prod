import React, { isValidElement } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { View, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import './index.scss'

interface EmptyLayoutProps {
  /** 图片类型 */
  image?: string
  /** 图片下方的描述文字 */
  description?: string
}

const PRESET_IMAGES = ['default']

const EmptyLayout: React.FC<EmptyLayoutProps> = (props) => {
  const { description, children } = props

  /**
   *
   * @returns 图片
   */
  const renderImage = () => {
    let { image } = props

    if (isValidElement(image)) {
      return image
    }

    if (PRESET_IMAGES.includes(image as string)) {
      image = getOssUrlPath('/Images/empty-image-default.png')
    }

    return <Image className="image" src={image as string} />
  }

  /**
   *
   * @returns 文字下方按钮
   */
  const renderBottom = () => {
    if (children) {
      return <View className="taro-empty__bottom">{children}</View>
    }
    return null
  }

  return (
    <View className="taro-empty">
      <View className="taro-empty__image">{renderImage()}</View>
      <View className="taro-empty__description">{description}</View>
      {renderBottom()}
    </View>
  )
}

EmptyLayout.defaultProps = {
  image: 'default',
  description: getIntl().formatMessage({ id: 'pay.zanwushuju', defaultMessage: '暂无数据' }),
}

export default EmptyLayout
