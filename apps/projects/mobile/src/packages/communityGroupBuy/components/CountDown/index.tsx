/*
 * @Description: 倒计时组件
 */
import React, { useEffect, useState } from 'react'
import cs from 'classnames'
import { View } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface IProps {
  /**
   * 时间
   */
  time: number
}

type DateMap = {
  d: string
  h: string
  m: string
  s: string
}

const CountDown = (props: IProps) => {
  const { time } = props

  const intl = useIntl()

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0)
  const [timeMap, setTimeMap] = useState<DateMap>({
    d: '00',
    h: '00',
    m: '00',
    s: '00',
  })
  useEffect(() => {
    if (time) {
      setCurrentTimestamp(() => new Date().getTime())
    }
  }, [time])
  useEffect(() => {
    if (!time) return
    const timer = setInterval(() => {
      setCurrentTimestamp(() => new Date().getTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [currentTimestamp])
  useEffect(() => {
    if (!time) return
    const t = time - currentTimestamp
    if (!t || t <= 0) {
      setTimeMap({
        d: '00',
        h: '00',
        m: '00',
        s: '00',
      })
      return
    }
    const d = Math.floor(t / 1000 / 60 / 60 / 24)
    const h = Math.floor((t / 1000 / 60 / 60) % 24)
    const m = Math.floor((t / 1000 / 60) % 60)
    const s = Math.floor((t / 1000) % 60)
    setTimeMap({
      d: (d < 10 ? '0' : '') + d,
      h: (h < 10 ? '0' : '') + h,
      m: (m < 10 ? '0' : '') + m,
      s: (s < 10 ? '0' : '') + s,
    })
  }, [currentTimestamp, time])

  return (
    <View className={styles['content']}>
      <View className={styles['ml-4']}>
        {timeMap.d}
        {intl.formatMessage({ id: 'communityGroupBuy.activity.tian', defaultMessage: '天' })}
      </View>
      <View className={cs(styles['ml-4'], styles['tag'])}>{timeMap.h}</View>
      <View className={styles['ml-4']}>:</View>
      <View className={cs(styles['ml-4'], styles['tag'])}>{timeMap.m}</View>
      <View className={styles['ml-4']}>:</View>
      <View className={cs(styles['ml-4'], styles['tag'])}>{timeMap.s}</View>
    </View>
  )
}

export default React.memo(CountDown)
