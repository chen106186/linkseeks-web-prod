/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-19 09:47:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-25 14:24:11
 * @Description: 优惠券列表
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, ScrollView } from '@apps/mobile-ui'
import Coupon, { CouponProps } from './index'
import styles from './index.module.scss'

export interface CouponListProps extends Omit<CouponProps, 'data'> {
  /**
   * 数据
   */
  dataSource: CouponProps['data'][]
  /**
   * 显示方向，可选值为 vertical horizontal，默认 vertical
   */
  direction?: 'horizontal' | 'vertical'
}

const CouponList: React.FC<CouponListProps> = (props: CouponListProps) => {
  const { dataSource, direction = 'vertical', ...rest } = props

  if (direction === 'horizontal') {
    return (
      <ScrollView horizontal={direction === 'horizontal'}>
        <View className={`${styles['coupon-list']} ${styles['coupon-list-horizontal']}`}>
          {dataSource.map((item) => (
            <View className={`${styles['coupon-list-item']} ${styles['coupon-list-horizontal-item']}`} key={item.id}>
              <Coupon data={item} {...rest} customStyle={{ width: pxTransform(152) }} />
            </View>
          ))}
        </View>
      </ScrollView>
    )
  }

  return (
    <View className={styles['coupon-list']}>
      {dataSource.map((item) => (
        <View className={styles['coupon-list-item']} key={item.id}>
          <Coupon data={item} {...rest} />
        </View>
      ))}
    </View>
  )
}

export default CouponList
