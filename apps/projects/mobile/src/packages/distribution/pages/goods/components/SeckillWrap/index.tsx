/**
 * @Description 秒杀信息容器
 */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDidShow, useDidHide } from '@apps/mobile-services/utils/taro'
import { View, Text, CountDown } from '@apps/mobile-ui'
import { appState as AppState } from '@apps/mobile-ui/packages/types/countdown'
import classNames from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { dateFormat } from '@/utils/date'
import { priceFormat } from '@/utils/numberFormat'
import './index.scss'

interface SeckillWrapProps {
  /**
   * 秒杀开始时间，时间戳
   */
  startTime: number
  /**
   * 秒杀结束时间，时间戳
   */
  endTime: number
  /**
   * 服务器响应时间，时间戳
   * 去本地时间不一定准确，所以取服务器响应时间
   */
  serverTime: number
  /**
   * 原价
   */
  pricing: number
  /**
   * 秒杀价
   */
  seckillPrice: number
  /**
   * 原价
   */
  wasPrice?: number
  /**
   * 会员价
   */
  vipPrice?: number
  /**
   * 秒杀活动结束时间
   */
  activityEndTime: number
  /**
   * 秒杀活动状态改变触发事件
   */
  onSeckillStatusChange?: (status: SeckillStatus) => void
  /**
   * 自定义外部容器样式
   */
  customStyle?: React.CSSProperties

  children?: React.ReactNode
}

export type SeckillStatus = 'wait' | 'active' | 'end'

let restStartTime = 0

const SeckillWrap: React.FC<SeckillWrapProps> = (props: SeckillWrapProps) => {
  const {
    startTime,
    endTime,
    serverTime,
    pricing,
    seckillPrice,
    wasPrice,
    vipPrice,
    activityEndTime,
    onSeckillStatusChange,
    customStyle,
    children,
  } = props

  const [innerStartTime, setInnerStartTime] = useState(0)
  const [status, setStatus] = useState<SeckillStatus>('wait')
  const [tick, setTick] = useState(0)
  // 预先展示秒杀内容
  const [visibleSeckillCard, setVisibleSeckillCard] = useState(true)

  const serverTimeRef = useRef(0)

  // eslint-disable-next-line no-undef
  const startTimer = useRef<NodeJS.Timeout | null>(null)
  // eslint-disable-next-line no-undef
  const tickTimer = useRef<NodeJS.Timeout | null>(null)
  const appState = useRef<AppState>('active')

  const intl = useIntl()

  const handleAppShow = useCallback(() => {
    // app激活
    if (appState.current.match(/inactive|background/)) {
      const restEndTime = +new Date()
      serverTimeRef.current += restEndTime - restStartTime
      restStartTime = 0
    }
    appState.current = 'active'
  }, [])

  const handleAppHide = useCallback(() => {
    // app切换到后台，或跳转了页面
    if (appState.current === 'active') {
      restStartTime = +new Date()
    }
    appState.current = 'background'
  }, [])

  useDidShow(handleAppShow)
  useDidHide(handleAppHide)

  /**
   * 计算秒杀活动数据
   * @param start 开始时间
   * @param end 结束时间
   * @param moment 服务器响应时间
   */
  const calculateSeckillState = (start: number, end: number, moment: number) => {
    if (!start || !end || !moment || !activityEndTime) {
      return
    }
    serverTimeRef.current = moment

    // 活动开始时间 大于 秒杀结束时间，显示 结束状态
    // or 服务器响应时间 大于 秒杀结束时间，显示 结束状态
    if (start > activityEndTime || moment > activityEndTime) {
      setStatus('end')
      onSeckillStatusChange?.('end')
      return
    }

    if (moment < start) {
      setTick((end - start) / 1000)
      setStatus('wait')
      setInnerStartTime(start)
      onSeckillStatusChange?.('wait')

      startTimer.current = setInterval(() => {
        serverTimeRef.current += 1000
        // 这里存在毫秒误差，所以 >=，而不是 ===
        if (serverTimeRef.current >= start) {
          setStatus('active')
          onSeckillStatusChange?.('active')
          startTimer.current && clearInterval(startTimer.current)
          calculateSeckillState(start, end, serverTimeRef.current)
        }
      }, 1000)
    }
    if (serverTimeRef.current >= start && serverTimeRef.current <= end) {
      setTick((end - moment) / 1000)
      setStatus('active')
      setInnerStartTime(start)
      onSeckillStatusChange?.('active')

      tickTimer.current = setInterval(() => {
        serverTimeRef.current += 1000

        // 计时器时间 大于 秒杀结束时间，显示 结束状态
        if (serverTimeRef.current > activityEndTime) {
          setStatus('end')
          onSeckillStatusChange?.('end')
          tickTimer.current && clearInterval(tickTimer.current)
        }

        if (serverTimeRef.current <= activityEndTime && serverTimeRef.current > end) {
          tickTimer.current && clearInterval(tickTimer.current)
          calculateSeckillState(start, end, serverTimeRef.current)
        }
      }, 1000)
    }
    if (moment > end) {
      setStatus('wait')
      onSeckillStatusChange?.('wait')
      const startDate = new Date(start)
      const endDate = new Date(end)
      startDate.setDate(startDate.getDate() + 1)
      endDate.setDate(endDate.getDate() + 1)
      calculateSeckillState(startDate.getTime(), endDate.getTime(), serverTimeRef.current)
    }
  }

  useEffect(() => {
    calculateSeckillState(startTime, endTime, serverTime)

    // 后台接口返回秒杀时间为 null 时，不需要展示秒杀内容
    setVisibleSeckillCard(!(startTime === null || endTime === null))

    return () => {
      startTimer.current && clearInterval(startTimer.current)
      tickTimer.current && clearInterval(tickTimer.current)
    }
  }, [startTime, endTime, serverTime, activityEndTime])

  return (
    <View className="seckillWrap" style={customStyle}>
      {visibleSeckillCard ? (
        <View className="seckillWrap-card">
          <View className="seckillWrap-card-left">
            <Text className="seckillWrap-activePrice">
              {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
              {priceFormat(status === 'active' ? seckillPrice : vipPrice || wasPrice)}
            </Text>
            {status === 'active' ? (
              <View className="seckillWrap-originWrap">
                <Text className="seckillWrap-price__original">
                  {intl.formatMessage({
                    id: 'commodityMerge.stocksSourcing.components.seckillWrap.pricing',
                    defaultMessage: '定价',
                  })}
                </Text>
                <Text className={classNames('seckillWrap-price__original', 'seckillWrap-price__through')}>
                  {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                  {priceFormat(pricing)}
                </Text>
              </View>
            ) : null}
          </View>
          <View className="seckillWrap-card-right">
            <View className="seckillWrap-triangle">
              <View className="seckillWrap-triangle-down" />
              <View className="seckillWrap-triangle-up" />
            </View>
            <Text className="seckillWrap-title">
              {status.match(/wait|active/)
                ? intl.formatMessage({
                    id: 'commodityMerge.stocksSourcing.components.seckillWrap.title',
                    defaultMessage: '限时秒杀',
                  })
                : null}
              {status === 'end'
                ? intl.formatMessage({
                    id: 'commodityMerge.stocksSourcing.components.seckillWrap.end',
                    defaultMessage: '已结束',
                  })
                : null}
            </Text>
            {status === 'wait' ? (
              <View className="seckillWrap-dateWrap">
                <Text className="seckillWrap-date">
                  {intl.formatMessage({
                    id: 'commodityMerge.stocksSourcing.components.seckillWrap.start',
                    date: innerStartTime ? dateFormat(new Date(innerStartTime), 'MM-DD HH:mm') : '00-00 00:00',
                  })}
                </Text>
              </View>
            ) : null}
            {status === 'active' ? (
              <View className="seckillWrap-countdown">
                <CountDown count={tick} format="HH:mm:ss">
                  {(_, formatTime) => {
                    const { formatTimeString } = formatTime
                    const [hour, minute, second] = formatTimeString.split(':')
                    return (
                      <View className="seckillWrap-end">
                        <Text className="seckillWrap-end-title">
                          {intl.formatMessage({
                            id: 'commodityMerge.stocksSourcing.components.seckillWrap.tick',
                            defaultMessage: '仅剩',
                          })}
                        </Text>
                        <View className="seckillWrap-end-tofu">
                          <Text className="seckillWrap-end-tofu-text">{hour}</Text>
                        </View>
                        <Text className="seckillWrap-end-splitCode">:</Text>
                        <View className="seckillWrap-end-tofu">
                          <Text className="seckillWrap-end-tofu-text">{minute}</Text>
                        </View>
                        <Text className="seckillWrap-end-splitCode">:</Text>
                        <View className="seckillWrap-end-tofu">
                          <Text className="seckillWrap-end-tofu-text">{second}</Text>
                        </View>
                      </View>
                    )
                  }}
                </CountDown>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
      <View className={visibleSeckillCard ? 'seckillWrap-content' : ''}>{children}</View>
    </View>
  )
}

export default SeckillWrap
