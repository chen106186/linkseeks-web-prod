import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import cs from 'classnames'
import './index.scss'

export interface Iprops {
  icon?: React.ReactNode
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'default' | 'violet'
  name: string
  className?: string
  textColor?: string
}

export type LabelProps = React.ComponentProps<typeof Label>
/**
 * 这里默认沾满父级， 如果不想沾满的话需要再嵌套一层View
 * <View><Label /></View>
 *
 */
const Label: React.FC<Iprops> = (props: Iprops) => {
  const { icon, type, name, className, textColor } = props

  return (
    <View className={cs('label', `label-${type}`, className)}>
      {(icon && <View className="icon">{icon}</View>) || null}
      <Text className={cs('name', `label-${type}-name`)} style={{ color: textColor }}>
        {name}
      </Text>
    </View>
  )
}

Label.defaultProps = {
  icon: null,
  type: 'danger',
}

export default Label
