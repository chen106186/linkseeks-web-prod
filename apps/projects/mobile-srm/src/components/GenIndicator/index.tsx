import React, { useCallback } from 'react'
import { View, Text, ActivityIndicator } from '@apps/mobile-ui'
import styles from './index.module.scss'

export interface GenIndicatorProps {
  /** 没有更多 */
  noMoreDate?: boolean
  /**  */
}

const GenIndicator: React.FC<GenIndicatorProps> = (props: GenIndicatorProps) => {
  const { noMoreDate } = props

  const genIndicator = useCallback(() => {
    if (!noMoreDate) {
      return (
        <View className={styles['indicatorContainer']}>
          <ActivityIndicator size={14} color="#909399" className={styles['indicator']} />
          <Text className={styles['indicatorText']}>正在加载~</Text>
        </View>
      )
    }
    return (
      <View className={styles['indicatorContainer']}>
        <Text className={styles['indicatorText']}>没有更多啦~</Text>
      </View>
    )
  }, [noMoreDate])

  return genIndicator()
}
export default GenIndicator
