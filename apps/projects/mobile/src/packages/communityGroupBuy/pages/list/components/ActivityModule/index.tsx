import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Image } from '@apps/mobile-ui'
import cs from 'classnames'
import styles from './index.module.scss'
import { formatDateFromTimestamp } from '../../../../utils/formatter'

type DateMap = {
  d: string
  h: string
  m: string
  s: string
}

interface Iprops {
  data: any
  currentTime: number
  onClick?: (value: any) => void
}

const ActivityModule: React.FC<Iprops> = (props: Iprops) => {
  const { data, currentTime, onClick } = props
  const intl = useIntl()

  const [timeMap, setTimeMap] = useState<DateMap>({
    d: '00',
    h: '00',
    m: '00',
    s: '00',
  })
  useEffect(() => {
    const time = (data.status === 1 ? data.startTime : data.endTime) - currentTime
    const d = Math.floor(time / 1000 / 60 / 60 / 24)
    const h = Math.floor((time / 1000 / 60 / 60) % 24)
    const m = Math.floor((time / 1000 / 60) % 60)
    const s = Math.floor((time / 1000) % 60)
    setTimeMap({
      d: (d < 10 ? '0' : '') + d,
      h: (h < 10 ? '0' : '') + h,
      m: (m < 10 ? '0' : '') + m,
      s: (s < 10 ? '0' : '') + s,
    })
  }, [currentTime])

  return (
    <View className={styles['activity']} onClick={() => onClick?.(data)}>
      <View className={styles['activity-box']}>
        <View className={cs(styles['activity-box-top'], data.status === 3 && styles['end'])}>
          <View className={styles['activity-box-top-view']}>
            <View className={styles['activity-box-top-text']}>{data.name}</View>
            <View className={styles['activity-box-top-text2']}>
              {data.status === 1
                ? intl.formatMessage({
                    id: 'communityGroupBuy.activity.status.jijiangjinxing',
                    defaultMessage: '即将进行',
                  })
                : data.status === 2
                ? intl.formatMessage({
                    id: 'communityGroupBuy.activity.status.jinxingzhong',
                    defaultMessage: '进行中',
                  })
                : intl.formatMessage({
                    id: 'communityGroupBuy.activity.status.yijiesu',
                    defaultMessage: '已结束',
                  })}
            </View>
          </View>
          <Text className={styles['activity-box-top-text2']}>
            <Text>{intl.formatMessage({ id: 'communityGroupBuy.activity.time', defaultMessage: '活动时间' })}：</Text>
            <Text>{formatDateFromTimestamp(data.startTime, 1)}</Text>
            <Text> ～ </Text>
            <Text>{formatDateFromTimestamp(data.endTime, 1)}</Text>
          </Text>
        </View>
        <View className={styles['activity-box-content']}>
          <View className={styles['content-item']}>
            {data?.goodsList.map((item, index) => {
              return index < 4 ? (
                <View className={styles['content-item-view']} key={index.toString()}>
                  <Image className={styles['content-item-view-img']} src={item.productImgUrl} />
                  {data?.goodsList.length > 4 && index === 3 && (
                    <View className={styles['content-item-view-more']}>更多</View>
                  )}
                </View>
              ) : null
            })}
          </View>
          {data.status < 3 && (
            <View className={styles['content-bottom']}>
              <View className={styles['content-bottom-text1']}>
                {data.status === 1
                  ? intl.formatMessage({
                      id: 'communityGroupBuy.activity.status.jukaishi',
                      defaultMessage: '距开始',
                    })
                  : intl.formatMessage({
                      id: 'communityGroupBuy.activity.status.jujiesu',
                      defaultMessage: '距结束',
                    })}
              </View>
              <View className={styles['content-bottom-text2']}>
                {timeMap.d +
                  intl.formatMessage({
                    id: 'communityGroupBuy.activity.tian',
                    defaultMessage: '天',
                  })}
              </View>
              <View className={styles['content-bottom-time']}>{timeMap.h}</View>
              <view>:</view>
              <View className={styles['content-bottom-time']}>{timeMap.m}</View>
              <view>:</view>
              <View className={styles['content-bottom-time']}>{timeMap.s}</View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default ActivityModule
