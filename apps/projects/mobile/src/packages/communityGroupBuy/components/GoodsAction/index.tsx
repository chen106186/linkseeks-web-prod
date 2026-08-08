import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import GoodsActionIcon from './Icon'
import GoodsActionButton from './Button'
import './styles.scss'

interface GoodsActionProps {
  /**
   * 是否开启底部安全距离，默认 true
   */
  safeAreaInsetBottom?: boolean
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties

  children?: React.ReactNode
}

const GoodsAction = (props: GoodsActionProps) => {
  const { safeAreaInsetBottom, customStyle, children } = props

  const { safeBottomHeight } = useSafeArea()

  const paddingBottom =
    safeAreaInsetBottom && safeBottomHeight ? safeBottomHeight : 0 || pxTransform(themeLayout['padding-xs'])

  return (
    <View
      className="goods-action"
      style={{
        paddingBottom: `${paddingBottom}PX`,
        ...customStyle,
      }}
    >
      {children}
    </View>
  )
}

GoodsAction.defaultProps = {
  safeAreaInsetBottom: true,
  customStyle: {},
  children: null,
}

GoodsAction.Icon = GoodsActionIcon
GoodsAction.Button = GoodsActionButton

export default GoodsAction
