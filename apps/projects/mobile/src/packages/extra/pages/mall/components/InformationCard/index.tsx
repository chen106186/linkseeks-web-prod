import { createSelectorQuery, createAnimation } from '@apps/mobile-services/utils/taro'
import React, { useState, useEffect, useRef } from 'react'
import { Text, Icons } from '@apps/mobile-ui'
import { View } from '@tarojs/components'
import Router from '@/utils/router'
import { useMobileIntl } from '@apps/locales'
import styles from './index.module.scss'

interface InformationCardProps {
  dataList?: any[]
}

const InformationCard: React.FC<InformationCardProps> = (props) => {
  const { dataList } = props
  const [animationData, setAnimationData] = useState<any>()
  const [infoRectHeight, setInfoRectHeight] = useState<number>(0)
  let top = useRef<number>(0).current
  const timer = useRef<any>(null)
  const translate = useMobileIntl()

  const _clearTimer = () => {
    clearInterval(timer.current)
    timer.current = null
  }

  const startScrollAnimate = (list: any[], dom_h: number) => {
    const count = list.length - 1
    const toValue = -(dom_h * count)
    const animation = createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0,
    })
    timer.current = setInterval(() => {
      if (Math.abs(top) >= Math.abs(toValue)) {
        top = 0
        const animationLoop = createAnimation({
          duration: 0,
          timingFunction: 'ease',
          delay: 0,
        })
        animationLoop.translateY(top).step()
        setAnimationData(animationLoop.export())
        return
      }
      top -= dom_h
      animation.translateY(top).step()
      setAnimationData(animation.export())
    }, 3000)
  }

  useEffect(() => {
    if (dataList && dataList.length > 0) {
      // 获取滚动项的高度
      createSelectorQuery()
        .select('#informationTitle_0')
        .boundingClientRect((rect: any) => {
          if (rect) {
            rect.height && setInfoRectHeight(rect.height)
            startScrollAnimate(dataList, rect.height || infoRectHeight)
          }
        })
        .exec()
    } else {
      _clearTimer()
    }
    return () => {
      _clearTimer()
    }
  }, [dataList])

  return (
    <View className={styles['information-card']}>
      <View className={styles['wrap']}>
        <Text className={styles['title']}>{translate('mobile.common.zixun')}</Text>
        <View className={styles['split']} />
        {dataList && dataList.length > 0 && <View className={styles['rect']} />}
        <View className={styles['informationListBox']}>
          <View animation={animationData} className={styles['informationListBody']}>
            {dataList &&
              dataList.length > 0 &&
              dataList.map((item, index) => (
                <View
                  key={`${item.id}_${index}`}
                  className={styles['informationTitle']}
                  id={`informationTitle_${index}`}
                  onClick={() => Router.navigateTo('companyNews/newsInformation', { informationId: item.id })}
                >
                  <Text className={styles['content']}>{item?.title}</Text>
                </View>
              ))}
          </View>
        </View>
        <View onClick={() => Router.navigateTo('companyNews/newsHome')}>
          <Icons name="ChevronRight" color="#91959B" size={16} />
        </View>
      </View>
    </View>
  )
}

export default InformationCard
