import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import cx from 'classnames'

import styles from './index.module.scss'
import Item from '@/packages/requisition/components/materialPopup/item'

interface RequisitionItemProps {
  data: any
  onClick?: Function
  type?: string
}

const RequisitionItem: React.FC<RequisitionItemProps> = (props: RequisitionItemProps) => {
  const { data, onClick, type } = props

  const list = [
    {
      title: '物料编码',
      key: 'code',
    },
    {
      title: '物料组',
      key: 'materialGroup',
      render: (item) => item?.name,
    },
    {
      title: '品类',
      key: 'customerCategory',
      render: (item) => item?.name,
    },
    {
      title: '品牌',
      key: 'brand',
      render: (item) => item?.name,
    },
    {
      title: '目录价',
      key: 'costPrice',
      render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
    },
    {
      title: '单位',
      key: 'unitName',
    },
  ]
  const subArr = [1, 2, 4, 51, 52, 54]
  const djArr = [0, 99]
  return (
    <View
      className={styles['requisitionItem']}
      onClick={() => {
        onClick?.()
      }}
    >
      <Text className={styles['requisitionItem-digest']}>{data.name}</Text>
      <View className={styles['requisitionItem-label']}>
        {list.map((item) => {
          return (
            <View className={styles['requisitionItem-labelRow']} key={item.title + item.key}>
              <Text className={styles['requisitionItem-labelRow-label']}>{item.title}</Text>
              <Text className={styles['requisitionItem-labelRow-text']}>
                {item.render ? item.render(data[item.key]) : data[item.key]}
              </Text>
            </View>
          )
        })}
      </View>
      <View className={styles['requisitionItem-checkRow']}>
        <Text className={styles['requisitionItem-checkRow-status']}>{data.interiorStateName}</Text>
        {!!type && subArr.includes(data.interiorState) && (
          <View className={cx(styles['requisitionItem-checkRow-btn'], styles['btnActive'])}>
            <Text className={cx(styles['requisitionItem-checkRow-btn-text'], styles['btnTextActive'])}>
              {data.interiorState === 1 || data.interiorState === 51 ? '提交审核' : '审核'}
            </Text>
          </View>
        )}
        {djArr.includes(data.interiorState) && (
          <View className={cx(styles['requisitionItem-checkRow-btn'])}>
            <Text className={cx(styles['requisitionItem-checkRow-btn-text'])}>
              {data.interiorState === 99 ? '冻结' : '启用'}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default RequisitionItem
