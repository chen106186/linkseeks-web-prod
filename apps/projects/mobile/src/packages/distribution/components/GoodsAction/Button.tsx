import React, { CSSProperties } from 'react'
import { View } from '@apps/mobile-ui'
import './styles.scss'

interface GoodsActionButtonProps {
  /**
   * 点击触发事件
   */
  onClick?: () => void
  /**
   * 自定义外部样式
   */
  customStyle?: string | CSSProperties

  children?: React.ReactNode
}

const GoodsActionButton: React.FC<GoodsActionButtonProps> = (props: GoodsActionButtonProps) => {
  const { onClick, customStyle, children } = props

  const handlePress = () => {
    onClick?.()
  }

  return (
    <View className="goods-action-button" style={customStyle} onClick={handlePress}>
      {children}
    </View>
  )
}

GoodsActionButton.defaultProps = {
  onClick: undefined,
  customStyle: {},
  children: null,
}

export default GoodsActionButton
