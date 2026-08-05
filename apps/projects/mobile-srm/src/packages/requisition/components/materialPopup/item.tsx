import React from 'react'
import { View, Text } from '@apps/mobile-ui'

import styles from './index.module.scss'

interface MaterialRow {
  title: string
  text: any
}

const Item: React.FC<MaterialRow> = (props: MaterialRow) => {
  const { title, text } = props
  return (
    <View className={styles['materialDataRow']}>
      <Text className={styles['materialDataRow-label']}>{title}</Text>
      <Text className={styles['materialDataRow-text']}>{text}</Text>
    </View>
  )
}

export default Item
