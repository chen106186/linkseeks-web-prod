import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import styles from './index.module.scss'

interface Iprops {
  title: string
  children?: React.ReactNode
  extra?: React.ReactNode
}

const CommodityCard: React.FC<Iprops> = (props: Iprops) => {
  const { title, children, extra } = props

  return (
    <View className={styles.card}>
      <View className={styles['card-header']}>
        <Text className={styles['card-header-title']}>{title}</Text>
        {extra}
      </View>
      {children}
    </View>
  )
}

CommodityCard.defaultProps = {
  extra: null,
}

export default CommodityCard
