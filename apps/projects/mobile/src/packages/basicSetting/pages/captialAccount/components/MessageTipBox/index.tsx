import { View } from '@apps/mobile-ui'
import React from 'react'
import styles from './index.module.scss'
const MessageTipBox = ({ message }) => {
  return <View className={styles['message-tip-box']}>{message}</View>
}

export default MessageTipBox
