/*
 * @Description: SpaceItem 间距组件Item
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import { SpaceContext } from '.'
import './index.scss'

export interface SpaceItemProps {
  /**
   * 索引
   */
  index: number
  /**
   * 间距方向，默认 horizontal
   */
  direction?: 'vertical' | 'horizontal'
  /**
   * 是否自动换行，仅在 horizontal 时有效
   */
  wrap?: boolean
  /**
   * 外边距方向
   */
  marginDirection: 'marginLeft' | 'marginRight'

  children?: React.ReactNode
}

const SpaceItem: React.FC<SpaceItemProps> = (props: SpaceItemProps) => {
  const { index, direction = 'horizontal', wrap = false, marginDirection, children } = props

  const { horizontalSize, verticalSize, latestIndex } = React.useContext(SpaceContext)

  let style: React.CSSProperties = {}

  if (direction === 'vertical') {
    if (index < latestIndex) {
      style = { marginBottom: pxTransform(horizontalSize / 1) }
    }
  } else {
    style = {
      ...(index < latestIndex && { [marginDirection]: pxTransform(horizontalSize / 1) }),
      ...(wrap && { paddingBottom: pxTransform(verticalSize) }),
    }
  }

  if (children === null || children === undefined) {
    return null
  }

  return (
    <View className="space-item" style={style}>
      {children}
    </View>
  )
}

export default SpaceItem
