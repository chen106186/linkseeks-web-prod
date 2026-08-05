import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface CellProps {
  /**
   * 左侧文本
   */
  title: string
  /**
   * 右侧文本
   */
  value: string
}

const Cell: React.FC<CellProps> = (props: CellProps) => {
  const { title, value } = props
  const intl = useIntl()
  return (
    <View className={styles['content-item']}>
      <Text className={styles['content-text-select']}>{title}</Text>
      <Text className={styles['content-text']}>{value}</Text>
    </View>
  )
}

export default Cell
