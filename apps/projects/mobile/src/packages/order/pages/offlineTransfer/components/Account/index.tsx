import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import { useRouter, pxTransform } from '@apps/mobile-services/utils/taro'
import MelloCard from '@/components/MellowCard'
import styles from './index.module.scss'

interface Iprops {
  column: { label: string; key: string }[]
  dataSource: { [key: string]: any } | null
}

const Account: React.FC<Iprops> = (props: Iprops) => {
  const { column, dataSource } = props

  return (
    <MelloCard bodyStyle={{ padding: pxTransform(12) }}>
      {column.map((_item) => (
        <View className={styles['account-item']} key={_item.key}>
          <Text className={styles['account-item-name']}>{_item.label}</Text>
          <Text className={styles['account-item-value']}>{dataSource && dataSource[_item.key]}</Text>
        </View>
      ))}
    </MelloCard>
  )
}

export default Account
