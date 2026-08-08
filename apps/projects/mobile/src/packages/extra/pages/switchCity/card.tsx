/*
 * @Author: GHua
 * @Date: 2022-03-01 11:39:46
 * @LastEditTime: 2022-03-11 17:25:06
 * @LastEditors: GHua
 * @Description:
 */
import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import cx from 'classnames'
import styles from './index.module.scss'

interface IProps {
  title: string
  contentDirection?: 'row' | 'column'
  noPadding?: boolean
  paddingStyle?: React.CSSProperties
}

const Card: React.FC<IProps> = (props) => {
  const { title, noPadding, paddingStyle, contentDirection, children } = props

  return (
    <View className={styles.card}>
      <View className={styles.cardHeader}>
        <Text className={styles.headerText}>{title}</Text>
      </View>
      <View
        className={cx(
          styles.cardBody,
          contentDirection === 'column' ? styles.column : styles.row,
          noPadding && styles.noPadding,
        )}
        style={paddingStyle && paddingStyle}
      >
        {children}
      </View>
    </View>
  )
}

Card.defaultProps = {
  contentDirection: 'row',
  noPadding: false,
}

export default Card
