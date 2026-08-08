import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import cx from 'classnames'

import styles from './index.module.scss'

interface RequisitionItemProps {
  data: any
  onClick?: Function
  type?: string
  showTag?: boolean
}

const ContractItem: React.FC<RequisitionItemProps> = (props: RequisitionItemProps) => {
  const { data, onClick, type = '' } = props

  const handleButton = () => {
    if (data.outerStatus == 9) {
      return { show: false, text: '' }
    }
    if (type == 'search' && data.outerStatus != 7 && data.outerStatus != 9 && data.outerStatus != 8) {
      return { show: true, text: '作废' }
    }
    if (type.indexOf('creat') > -1 || type.indexOf('sign') > -1) {
      if (data.innerStatus == 21 || data.innerStatus == 3) {
        return { show: true, text: '提交审核' }
      } else if (data.outerStatus == 4 && (data.innerStatus == 4 || data.innerStatus == 6 || data.innerStatus == 8)) {
        return { show: true, text: '确认合同签订' }
      } else {
        return { show: true, text: '审核' }
      }
    }

    return { show: false, text: '' }
  }

  return (
    <View
      className={styles['requisitionItem']}
      onClick={() => {
        onClick?.()
      }}
    >
      <Text className={styles['requisitionItem-digest']}>{data.contractAbstract}</Text>
      <View className={cx(styles['requisitionItem-labelRow'], styles['requisitionItem-half'])}>
        <Text className={styles['requisitionItem-labelRow-label']}>合同编号</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.contractNo}</Text>
      </View>
      <View className={cx(styles['requisitionItem-labelRow'], styles['requisitionItem-half'])}>
        <Text className={styles['requisitionItem-labelRow-label']}>来源类型</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.sourceTypeName}</Text>
      </View>
      <View className={cx(styles['requisitionItem-labelRow'], styles['requisitionItem-half'])}>
        <Text className={styles['requisitionItem-labelRow-label']}>生效时间</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.startTime}</Text>
      </View>
      <View className={cx(styles['requisitionItem-labelRow'], styles['requisitionItem-half'])}>
        <Text className={styles['requisitionItem-labelRow-label']}>失效时间</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.endTime}</Text>
      </View>
      <View className={styles['requisitionItem-labelRow']}>
        <Text className={styles['requisitionItem-labelRow-label']}>合同乙方</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.partyBName}</Text>
      </View>
      <View className={styles['requisitionItem-labelRow']}>
        <Text className={styles['requisitionItem-labelRow-label']}>合同总金额</Text>
        <Text className={styles['requisitionItem-labelRow-text']}>{data.totalAmount}</Text>
      </View>
      <View className={styles['requisitionItem-checkRow']}>
        <Text className={styles['requisitionItem-checkRow-status']}>
          {data.outerStatus == 9 ? data.outerStatusName : data.innerStatusName}
        </Text>
        {handleButton().show && (
          <View className={cx(styles['requisitionItem-checkRow-btn'], type == 'search' ? '' : styles['btnActive'])}>
            <Text
              className={cx(
                styles['requisitionItem-checkRow-btn-text'],
                type == 'search' ? '' : styles['btnTextActive'],
              )}
            >
              {handleButton().text}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default ContractItem
