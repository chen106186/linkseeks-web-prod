import React from 'react'
import { View } from '@apps/mobile-ui'
import styles from './index.module.scss'

interface Iprops {
  /**
   * 显示多少步
   * */
  step: number
  /**
   * 总共多少步
   * */
  total?: number
}
const progress = (props: Iprops) => {
  const { step, total = 4 } = props
  // const {}
  return (
    <View className={styles['progressContainer']}>
      {new Array(total).fill(1).map((item: any, index: number) => {
        return <View className={index + 1 <= step ? styles['progress-active'] : styles['progress']} key={item}></View>
      })}
    </View>
  )
}

export default progress
