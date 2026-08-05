import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import styles from './index.module.scss'

interface RequisitionProductProps {
  data: any
  edit?: boolean
  index?: number
  onClick?: (item: any) => void
}

const RequisitionItem: React.FC<RequisitionProductProps> = (props: RequisitionProductProps) => {
  const { data, index, onClick } = props

  const list = [
    { label: '付款阶段', text: data.payStage },
    { label: '预计付款期', text: data.expectPayTime },
    { label: '付款比例', text: data.payRatio },
    { label: '付款金额', text: data.payAmount },
    { label: '结算方式', text: '' },
    { label: '付款方式', text: data.payWayName },
  ]

  return (
    <View
      className={styles['product-box']}
      onClick={() => {
        onClick?.(data)
      }}
    >
      <View className={styles['title']}>付款批次{index}</View>
      {list.map((i) => (
        <View className={styles['item']}>
          <Text className={styles['label']}>{i.label}</Text>
          <Text className={styles['text']}>{i.text}</Text>
        </View>
      ))}
    </View>
  )
}

export default RequisitionItem
