import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import cx from 'classnames'

import styles from './index.module.scss'

interface RequisitionItemProps {
  data: any
  onClick?: Function
  type?: 1 | 2
  showTag?: boolean
  isAudit?: boolean
}

const RequisitionItem: React.FC<RequisitionItemProps> = (props: RequisitionItemProps) => {
  const { data, onClick, type = 1, showTag = true, isAudit = true } = props
  const _renderTag = (data) => {
    switch (data?.innerStatus) {
      case 1:
        return '修改'
      case 7:
        if (Number(data?.transferQuantity) === 0) {
          return '取消'
        } else if (Number(data?.transferQuantity) !== 0 && Number(data?.transferQuantity) < Number(data?.quantity)) {
          return '中止'
        }
        break
    }
    return null
  }
  return (
    <View
      className={styles['requisitionItem']}
      onClick={() => {
        onClick?.()
      }}
    >
      <Text className={styles['requisitionItem-digest']}>{data.digest}</Text>
      <View className={styles['requisitionItem-labelRow']}>
        <Text className={styles['requisitionItem-labelRow-label']}>供应会员</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.vendorMemberName}</Text>
      </View>
      <View className={styles['requisitionItem-labelRow']}>
        <Text className={styles['requisitionItem-labelRow-label']}>预交时间</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.advanceDeliveryDate}</Text>
      </View>
      <View className={styles['requisitionItem-labelRow']}>
        <Text className={styles['requisitionItem-labelRow-label']}>请购部门</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.department}</Text>
      </View>
      <View className={styles['requisitionItem-labelRow']}>
        <Text className={styles['requisitionItem-labelRow-label']}>请购人</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.requisitioner}</Text>
      </View>
      <View className={styles['requisitionItem-checkRow']}>
        <Text className={styles['requisitionItem-checkRow-status']}>{data.innerStatusName}</Text>
        {showTag && (
          <View className={cx(styles['requisitionItem-checkRow-btn'], type === 2 ? styles['btnActive'] : '')}>
            <Text
              className={cx(styles['requisitionItem-checkRow-btn-text'], type === 2 ? styles['btnTextActive'] : '')}
            >
              {isAudit ? '审核' : _renderTag(data)}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default RequisitionItem
