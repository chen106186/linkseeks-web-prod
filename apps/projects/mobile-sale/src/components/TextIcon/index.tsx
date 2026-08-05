import React, { ReactNode, CSSProperties } from 'react'
import { View, Icons, Text } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'

export type PropsType = {
  text?: ReactNode
  onClick?: Function
  customTextStyle?: CSSProperties
  customIconStyle?: CSSProperties
  iconName?: string
  iconSize?: number
  iconColor?: string
}

const TextIcon = ({ text, customTextStyle, iconName, iconSize, iconColor, customIconStyle, onClick }: PropsType) => {
  return (
    <View className={styles['text-icon']} onClick={() => onClick?.()}>
      <View style={customTextStyle}>{text}</View>
      <Icons
        name={iconName}
        size={iconSize}
        color={iconColor}
        customStyle={{ marginLeft: pxTransform(4), ...customIconStyle }}
      />
    </View>
  )
}

TextIcon.defaultProps = {
  iconName: 'ChevronRight',
  iconSize: 12,
  iconColor: '#91959B',
  customTextStyle: {},
  customIconStyle: {},
}

export default TextIcon
