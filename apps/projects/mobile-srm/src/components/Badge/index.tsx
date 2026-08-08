import React from 'react'
import { View } from '@apps/mobile-ui'
import './index.scss'

interface BadgeProps {
  /** 角标内容 */
  value?: number
  /** 角标最大值 */
  maxValue?: number
}

const Badge: React.FC<BadgeProps> = (props) => {
  const { value = 0, maxValue = 99, children } = props

  return (
    <View className="badge">
      {children}
      {!!value && <View className="badge-num">{Math.min(value, maxValue)}</View>}
    </View>
  )
}

export default Badge
