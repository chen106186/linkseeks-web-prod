import React, { useEffect, useState } from 'react'
import { Price, RowCommodity } from '@/components/Commodity'
import { toFixedFix } from '@/utils/numberFormat'
import { View, Text, CountDown } from '@apps/mobile-ui'
import Progress from '@/components/Progress'
import Button from '@/components/Commodity/button'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { ACTIVITY_NAME_TO_NUMBER, ACTIVITY_SECKILL_NUMBER } from '@/constants/const/activity'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import styles from './seckill.module.scss'

type CommodityPropsType = React.ComponentProps<typeof RowCommodity>
type Valueof<T extends Object> = T[keyof T]
type ActivityTypeNum = Valueof<typeof ACTIVITY_NAME_TO_NUMBER>

type ActivityItemType = {
  activityType: ActivityTypeNum
  /** 活动结束时间 */
  endTime: number
  id: number
  /** 活动开始时间 */
  startTime: number
}

interface Iprops extends CommodityPropsType {
  /** 秒杀开始时间 */
  secKillStartTime?: number
  /** 秒杀结束时间 */
  secKillEndTime?: number
  /** 限购 */
  restrictTotalNum: number
  /** 已售 */
  hasSold: number
  unit: string
  activityList: ActivityItemType[]
}

interface iListProps {
  dataSource: Iprops[]
}

// 只拿时分秒
const formatTimeFn = (time: number) => {
  const timeToDate = new Date(time)
  const hour = timeToDate.getHours()
  const minute = timeToDate.getMinutes()
  const second = timeToDate.getSeconds()
  return { hour, minute, second }
}

type CompareTimeType = { hour: number; minute: number; second: number }
/**
 * 默认 A < B 为true
 * @param timeA
 * @param timeB
 * @returns
 */
const compareTimesIsSmall = (timeA: CompareTimeType, timeB: CompareTimeType): boolean => {
  const timeAToArr = [timeA.hour, timeA.minute, timeA.second]
  const timeBToArr = [timeB.hour, timeB.minute, timeB.second]

  let i = 0

  while (i < timeAToArr.length) {
    const item = timeAToArr[i] || 0
    if (+timeBToArr[i] > +item) {
      return true
    }
    if (+timeBToArr[i] < +item) {
      return false
    }
    i += 1
  }
  return false
}

const getOffsetSeconds = (timeA: CompareTimeType, timeB: CompareTimeType) => {
  const timeAToString = [timeA.hour, timeA.minute, timeA.second].join(':')
  const timeBToString = [timeB.hour, timeB.minute, timeB.second].join(':')

  /** 这里直接比较两个时间 过去了多少秒 */
  return (
    Math.abs(new Date(`2022/02/01 ${timeAToString}`).valueOf() - new Date(`2022/02/01 ${timeBToString}`).valueOf()) /
    1000
  )
}

/**
 * 计算距离 倒计时时间
 * @startTime 开始时间，时间戳
 * @endTime 结束时间，时间戳
 *  */
const calculateTime = (startTime: number, endTime: number) => {
  const current = new Date().valueOf()
  const currentFormatted = formatTimeFn(current)
  const startTimeFormatted = formatTimeFn(startTime)
  const endTimeFormatted = formatTimeFn(endTime)

  if (compareTimesIsSmall(currentFormatted, startTimeFormatted)) {
    /** 1 -> 距离开始， 2 -> 活动进行中（距离结束） */
    return {
      status: 1 as 1,
      offset: getOffsetSeconds(currentFormatted, startTimeFormatted),
    }
  }
  if (
    compareTimesIsSmall(currentFormatted, endTimeFormatted) &&
    !compareTimesIsSmall(currentFormatted, startTimeFormatted)
  ) {
    return {
      status: 2 as 2,
      offset: getOffsetSeconds(currentFormatted, endTimeFormatted),
    }
  }

  // 距离第二天开始时间
  /**
   * 当前时间 2022/02/01 17:00:00
   * 活动结束时间 2022/02/01 16:00:00
   */
  return {
    status: 1 as 1,
    offset: -getOffsetSeconds(currentFormatted, startTimeFormatted) + 24 * 60 * 60 - 1,
  }
}

const isToday = (time: number) => {
  const current = new Date()
  const otherDate = new Date(time)

  const getDates = (_time: Date) => {
    const date = _time.getDate()
    const year = _time.getFullYear()
    const month = _time.getMonth() + 1
    return { date, year, month }
  }

  const getDatesResOfCurrent = getDates(current)
  const getDatesResOfOther = getDates(otherDate)

  const keys = ['year', 'month', 'date']
  const res = keys.every((_item) => {
    return getDatesResOfCurrent[_item] === getDatesResOfOther[_item]
  })

  return res
}

const SeckillItem: React.FC<Iprops> = (props: Iprops) => {
  const {
    secKillStartTime,
    secKillEndTime,
    originalPrice,
    discount,
    restrictTotalNum,
    hasSold,
    unit,
    productImg,
    productName,
    productId,
    skuId,
    activityList,
  } = props
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  /** 距离开始时间， 距离结束时间， 单位：秒 */
  const [countDownInfo, setCountdownInfo] = useState<{ offset: number; status: 1 | 2 | 3 }>({
    offset: 0,
    status: 1,
  })
  const endTime = activityList?.find((_item: any) => _item.activityType === ACTIVITY_SECKILL_NUMBER)?.endTime

  useEffect(() => {
    if (secKillStartTime && secKillEndTime) {
      const current = new Date().valueOf()
      const endTimeIsToday = isToday(endTime!)
      // console.log(endTimeIsToday)
      /** 当前时间 > 活动结束时间，那么说明活动已结束 或者 活动结束时间是今天，且当前时间 > 秒杀时间 标记成结束 */
      if (current > endTime! || (endTimeIsToday && current > secKillEndTime)) {
        setCountdownInfo({
          offset: 0,
          status: 3,
        })
        return
      }
      const res = calculateTime(secKillStartTime!, secKillEndTime!)
      setCountdownInfo(res)
    }
  }, [secKillStartTime, secKillEndTime])

  const onFinish = () => {
    if (secKillStartTime && secKillEndTime) {
      const current = new Date().valueOf()
      const endTimeIsToday = isToday(endTime!)
      if (new Date().valueOf() > endTime! || (endTimeIsToday && current > secKillEndTime)) {
        setCountdownInfo({
          offset: 0,
          status: 3,
        })
        return
      }
      const res = calculateTime(secKillStartTime!, secKillEndTime!)

      setCountdownInfo(res)
    }
  }

  const handleJump = () => {
    const withSkuId = skuId ? { skuId: skuId } : {}
    const activityTarget = activityList?.find((_item: any) => _item.activityType === ACTIVITY_SECKILL_NUMBER)
    const withActivityId = activityTarget ? { activityId: activityTarget.id } : {}
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, {
      commodityId: productId,
      ...withSkuId,
      activityType: ACTIVITY_SECKILL_NUMBER,
      ...withActivityId,
    })
  }

  const renderProgress = () => {
    const percent = toFixedFix((hasSold / restrictTotalNum) * 100, 2)
    const innerText = `${(((restrictTotalNum - hasSold) / restrictTotalNum) * 100).toFixed(2)}%`
    const highlightText = restrictTotalNum - hasSold
    const progressText = intl.formatMessage({ id: 'activity.text.surplus', defaultMessage: '剩余' })
    return (
      <View className={styles.progress}>
        <Progress
          strokeColor="#EF3346"
          trailColor="#FFF0F2"
          strokeWidth={6}
          percent={percent}
          customRenderText={
            <View className={styles['progress-container']}>
              <Text className={styles['progress-remain']}>{innerText}</Text>
              <View className={styles['progress-extra']}>
                <Text>{progressText}</Text>
                <Text className={styles['progress-extra-highlight']}>{highlightText}</Text>
                <Text>{unit}</Text>
              </View>
            </View>
          }
        />
      </View>
    )
  }

  const renderMiddleArea = () => {
    return (
      <View>
        <View className={styles['seckillPrice']}>
          <Price originalPrice={originalPrice} discount={discount} />
        </View>
        {renderProgress()}
      </View>
    )
  }

  const renderFooter = () => {
    return (
      <View className={styles.seckillFooter}>
        <View className={styles.countDownContainer}>
          <CountDown count={countDownInfo.offset} onFinish={onFinish} format="HH:mm:ss">
            {(time, formatTime) => {
              const { formatTimeString } = formatTime
              if (countDownInfo.status === 3) {
                return <Text className={styles.isOut}>活动已结束</Text>
              }
              return (
                <View className={styles.countDown}>
                  <Text className={styles.countDownTitle}>
                    {countDownInfo.status === 1
                      ? intl.formatMessage({ id: 'activity.secKill.toBegin', defaultMessage: '离开始:' })
                      : intl.formatMessage({ id: 'activity.secKill.toEnd', defaultMessage: '离结束:' })}
                  </Text>
                  {(time > 0 && <Text className={styles.countDownTitle}>{formatTimeString}</Text>) || (
                    <Text className={styles.countDownTitle} />
                  )}
                </View>
              )
            }}
          </CountDown>
          <Button type="danger">
            {intl.formatMessage({ id: 'activity.group.buyNow', defaultMessage: '立即抢购' })}
          </Button>
        </View>
      </View>
    )
  }

  return (
    <RowCommodity
      productImg={productImg}
      productName={productName}
      productId={productId}
      discount={discount}
      renderMiddleArea={renderMiddleArea()}
      renderFooter={renderFooter()}
      onClickCommodity={handleJump}
    />
  )
}

const SeckillList: React.FC<iListProps> = (props: iListProps) => {
  const { dataSource } = props
  return (
    <>
      {dataSource.map((_item) => (
        <View className={styles.seckillItem} key={_item.productId}>
          <SeckillItem {..._item} />
        </View>
      ))}
    </>
  )
}

export default SeckillList
