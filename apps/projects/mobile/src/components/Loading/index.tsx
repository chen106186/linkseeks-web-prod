/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-21 18:53:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 15:55:06
 * @Description: 加载组件
 */
import React, { CSSProperties } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { View, Text, ActivityIndicator } from '@apps/mobile-ui'
import './index.scss'

interface LoadingProps {
  /**
   * 是否加载中
   */
  loading: boolean
  /**
   * 颜色，默认 #C0C4CC
   */
  color?: string
  /**
   * 加载图标大小，默认 24
   */
  size?: number
  /**
   * 加载文本，默认 加载中...
   */
  text?: string
  /**
   * 是否没有更多
   */
  noMore?: boolean
  /**
   * 没有更多文本，默认 已经到底啦～
   */
  noMoreText?: string
  /**
   * 文字大小，默认 12
   */
  textSize?: number
  /**
   * 是否垂直排列图标和文字内容
   */
  vertical?: boolean
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
}

const Loading: React.FC<LoadingProps> = (props: LoadingProps) => {
  const {
    loading,
    color = '#C0C4CC',
    size = 14,
    text,
    noMore,
    noMoreText,
    textSize = 12,
    vertical,
    customStyle,
  } = props

  if (loading && text) {
    return (
      <View className={`loading ${vertical ? 'loading__vertical' : ''}`} style={customStyle}>
        <ActivityIndicator size={size} isOpened />
        <Text
          className={`loading-text ${vertical ? 'loading-text__vertical' : ''}`}
          style={{
            fontSize: textSize,
            color,
          }}
        >
          {text}
        </Text>
      </View>
    )
  }

  if (!loading && noMore && noMoreText) {
    return (
      <View className={`loading ${vertical ? 'loading__vertical' : ''}`} style={customStyle}>
        <Text
          className={`loading-text ${vertical ? 'loading-text__vertical' : ''}`}
          style={{
            fontSize: textSize,
            color,
            margin: 0,
          }}
        >
          {noMoreText}
        </Text>
      </View>
    )
  }

  return null
}

Loading.defaultProps = {
  color: '#C0C4CC',
  size: 14,
  text: getIntl().formatMessage({ id: 'components.jiazaizhong', defaultMessage: '加载中...' }),
  noMore: false,
  noMoreText: getIntl().formatMessage({ id: 'order.yijingdaodila', defaultMessage: '已经到底啦～' }),
  textSize: 12,
  vertical: false,
  customStyle: {},
}

export default Loading
