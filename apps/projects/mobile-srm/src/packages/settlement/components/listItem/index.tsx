import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import cx from 'classnames'

import styles from './index.module.scss'

interface RequisitionItemProps {
  data: any
  onClick?: Function
  type?: string
}

const RequisitionItem: React.FC<RequisitionItemProps> = (props: RequisitionItemProps) => {
  const { data, onClick, type } = props

  const list = [
    {
      title: '请款单号',
      key: 'applyNo',
    },
    {
      title: '请款类型',
      key: 'applyTypeName',
    },
    {
      title: '收款方',
      key: 'payee',
    },
    {
      title: '请款金额',
      key: 'applyAmount',
      render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
    },
    {
      title: '预计付款日',
      key: 'expectPayTime',
      render: (text) => text?.split(' ')[0],
    },
    {
      title: '单据时间',
      key: 'createTime',
      render: (text) => text?.split(' ')[0],
    },
  ]
  const subArr = [12, 14, 16, 18]
  return (
    <View
      className={styles['requisitionItem']}
      onClick={() => {
        onClick?.()
      }}
    >
      <Text className={styles['requisitionItem-digest']}>{data.applyAbstract}</Text>
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
        <Text className={styles['requisitionItem-checkRow-status']}>{data.statusName}</Text>
        {!!type && subArr.includes(data.status) && (
          <View className={cx(styles['requisitionItem-checkRow-btn'], styles['btnActive'])}>
            <Text className={cx(styles['requisitionItem-checkRow-btn-text'], styles['btnTextActive'])}>
              {data.status === 12 ? '提交审核' : '审核'}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default RequisitionItem
