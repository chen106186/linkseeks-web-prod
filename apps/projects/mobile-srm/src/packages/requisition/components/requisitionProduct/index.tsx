import React from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import defaultImage from '@/assets/images/default_img.png'
import { formatDecimal } from '@/utils/numberFormat'
import styles from './index.module.scss'

interface RequisitionProductProps {
  data: any
  edit?: boolean
  onClick?: (item: any) => void
}

const RequisitionItem: React.FC<RequisitionProductProps> = (props: RequisitionProductProps) => {
  const { data, edit, onClick } = props

  const _counts = (data) => {
    return Number(data?.price ?? 0) * Number(data?.quantity ?? 0)
  }

  return (
    <View
      className={styles['product-box']}
      onClick={() => {
        onClick?.(data)
      }}
    >
      <View className={styles['product-box-left']}>
        <Image src={data?.goodsPic?.[0] || defaultImage} className={styles['product-box-left-image']} />
      </View>
      <View className={styles['product-box-right']}>
        <View className={styles['product-box-right-content']}>
          <Text className={styles['product-box-right-title']}>{data.name}</Text>
          <View className={styles['product-box-right-count']}>
            <View className={styles['product-box-right-count-item']}>
              <View className={styles['product-box-right-count-label']}>预估单价：</View>
              {edit && !data?.price ? (
                <View className={styles['product-box-right-count-valueEdit']}>待填写(选填)</View>
              ) : (
                <View className={styles['product-box-right-count-value']}>￥{data.price}</View>
              )}
            </View>
            <View className={styles['product-box-right-count-item']} style={{ justifyContent: 'flex-end' }}>
              <View className={styles['product-box-right-count-label']}>请购数量：</View>
              {edit && !data?.quantity ? (
                <View className={styles['product-box-right-count-valueEdit']}>待填写</View>
              ) : (
                <View className={styles['product-box-right-count-value']}>{data.quantity}</View>
              )}
            </View>
          </View>
          <View className={styles['product-box-right-amount']}>
            <View className={styles['product-box-right-amount-label']}>预估金额：</View>
            <View className={styles['product-box-right-amount-value']}>
              ￥{formatDecimal(data?.amount ?? _counts(data))}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RequisitionItem
