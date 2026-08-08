import React from 'react';
import { View } from '@apps/mobile-ui'
import styles from './index.module.scss'

interface Iprops {
  /**
   * 显示多少步
   *
   * */
  setp: number,
}
const progress = (props: Iprops) => {
  const { setp } = props;
  // const {}
  return (
    <View className={styles['progressContainer']}>
      {
        new Array(4).fill(1).map((item: any, index: number) => {
          return (
            <View className={index + 1 <= setp ? styles['progressAtive'] : styles['progress']} key={item}></View>
          )
        })
      }

    </View>
  )
}

export default progress;
