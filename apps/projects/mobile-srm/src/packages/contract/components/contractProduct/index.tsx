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
          <Text className={styles['product-box-right-title']}>{data.materielName}</Text>
          <View className={styles['product-box-right-count']}>
            <View className={styles['product-box-right-count-item']}>
              <View className={styles['product-box-right-count-label']}>单价(含税)：</View>
              {edit && !data?.price ? (
                <View className={styles['product-box-right-count-valueEdit']}>待填写(选填)</View>
              ) : (
                <View className={styles['product-box-right-count-value']}>￥{data.price}</View>
              )}
            </View>
            <View className={styles['product-box-right-count-item']} style={{ justifyContent: 'flex-end' }}>
              <View className={styles['product-box-right-count-label']}>合同数量：</View>
              {edit && !data?.bidCount ? (
                <View className={styles['product-box-right-count-valueEdit']}>待填写</View>
              ) : (
                <View className={styles['product-box-right-count-value']}>{data.bidCount}</View>
              )}
            </View>
          </View>
          <View className={styles['product-box-right-amount']}>
            <View className={styles['product-box-right-amount-label']}>合同金额：</View>
            <View className={styles['product-box-right-amount-value']}>
              {formatDecimal(data?.bidAmount ?? _counts(data))}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RequisitionItem
