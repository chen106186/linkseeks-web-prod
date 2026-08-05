/*
 * @Description: 操作区容器
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import Space, { JustifyType } from '@/components/Space'
import './index.scss'

export interface SpaceshipWrapProps {
  /**
   * 按钮容器是否沾满的，默认 true
   */
  full?: boolean
  /**
   * 水平对其方式，默认 right
   */
  align?: 'left' | 'right'

  children?: React.ReactNode
}

const justifyMap: Record<string, JustifyType> = {
  left: 'start',
  right: 'end',
}

const SpaceshipWrap: React.FC<SpaceshipWrapProps> = (props: SpaceshipWrapProps) => {
  const { full = true, align = 'right', children } = props

  const { safeBottomHeight } = useSafeArea()

  if (!React.Children.toArray(children).some((item) => React.isValidElement(item))) {
    return null
  }

  return (
    <View
      className={classNames('spaceship-wrap', { 'spaceship-wrap__full': full })}
      style={{
        paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
        textAlign: align,
      }}
    >
      <Space justify={justifyMap[align]}>{children}</Space>
    </View>
  )
}

export default SpaceshipWrap
