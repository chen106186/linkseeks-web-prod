import { Text, View } from '@apps/mobile-ui'
import React, { ReactNode } from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'

export interface LineCardProps {
  children: any
  title: ReactNode
  status?: STATUS_ENUM
  statusText?: ReactNode
}

export enum STATUS_ENUM {
  SUCCESS = 'success',
  READY = 'ready',
  ERROR = 'error',
}

const LineCard = (props: LineCardProps) => {
  const { children, title, status, statusText } = props
  return (
    <View className={styles.warp}>
      <View className={styles['warp-item']}>
        <View className={styles['warp-title']}>
          <View className={styles['wrap-line']}></View>
          <Text className={styles['warp-title-text']}>{title}</Text>
          {status && (
            <View className={styles.statusContainer}>
              <View className={classNames(styles.wrapCircle, styles[`status-circle-${status}`])}></View>
              <Text className={classNames(styles[`status-text-${status}`])}>{statusText}</Text>
            </View>
          )}
        </View>
      </View>
      {children}
    </View>
  )
}

export default LineCard
