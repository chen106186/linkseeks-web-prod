/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-30 17:22:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-22 11:51:49
 * @Description: 权益记录列表
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import styles from './index.module.scss'

export interface ItemData {
  /**
   * id
   */
  id: number
  /**
   * 名称
   */
  rightTypeName: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 得分
   */
  point: number
  /**
   * 备注
   */
  remark: string
  /**
   * 使用类型
   */
  spendTypeName?: string
}

interface PowerRecordItemProps {
  /**
   * 数据
   */
  data: ItemData
  /**
   * 是否显示边框
   */
  border?: boolean
  /**
   * 是否是消费的
   */
  expended?: boolean
}

const PowerRecordItem: React.FC<PowerRecordItemProps> = (props: PowerRecordItemProps) => {
  const { data, border, expended } = props

  return (
    <View
      className={styles['list-item']}
      style={{
        borderBottomWidth: pxTransform(border ? 0.5 : 0),
      }}
    >
      <View className={styles['list-item-left']}>
        <Text className={styles['list-item-name']}>
          {data.rightTypeName}
          {data.spendTypeName ? `(${data.spendTypeName})` : ''}
        </Text>
        <Text className={styles['list-item-desc']}>{data.createTime}</Text>
      </View>
      <View className={styles['list-item-right']}>
        <Text className={styles['list-item-score']}>{`${!expended ? '+' : '-'}${data.point}`}</Text>
      </View>
    </View>
  )
}

PowerRecordItem.defaultProps = {
  border: true,
  expended: false,
}

export default PowerRecordItem
