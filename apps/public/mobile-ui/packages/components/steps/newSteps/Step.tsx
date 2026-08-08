import React from 'react'
import type { FC, ReactNode } from 'react'
import classNames from 'classnames'
import { StepProps } from './types'
import { View, Text } from '@tarojs/components'

const rootClassPrefix = 'mobile-step'

export const Step: FC<StepProps> = (props) => {
  const { title, description, icon, status = 'wait' } = props

  return (
    <View className={classNames(`${rootClassPrefix}`, `${rootClassPrefix}-status-${status}`)}>
      <View className={`${rootClassPrefix}-indicator`}>
        <View className={`${rootClassPrefix}-icon-container`}>{icon}</View>
      </View>
      <View className={`${rootClassPrefix}-content`}>
        <View className={`${rootClassPrefix}-title`}>{title}</View>
        {!!description && <Text className={`${rootClassPrefix}-description`}>{description}</Text>}
      </View>
    </View>
  )
}
