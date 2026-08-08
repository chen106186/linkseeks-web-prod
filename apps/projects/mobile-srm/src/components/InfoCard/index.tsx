import React, { ReactNode } from 'react'
import { View } from '@apps/mobile-ui'
import styles from './index.module.scss'

export type InfoCardType = {
  title?: ReactNode
  subtitle?: ReactNode
  children?: ReactNode | (() => ReactNode)
  customHeaderStyle?: React.CSSProperties
  customBodyStyle?: React.CSSProperties
  onCardClick?: Function
}

const InfoCard = ({ title, subtitle, children, customHeaderStyle, customBodyStyle, onCardClick }: InfoCardType) => {
  return (
    <View className={styles['info-card']} onClick={() => onCardClick?.()}>
      <View className={styles['card-header']} style={customHeaderStyle}>
        <View className={styles['title']}>{title}</View>
        <View className={styles['subtitle']}>{subtitle}</View>
      </View>
      {!!children && (
        <View className={styles['card-body']} style={customBodyStyle}>
          {typeof children === 'function' ? children() : children}
        </View>
      )}
    </View>
  )
}

export default InfoCard
