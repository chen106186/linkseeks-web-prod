/*
 * @Description: 配送方式 Popup
 */
import React, { useEffect, useMemo, useState } from 'react'
import { View } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import useProductConst from '@/hooks/useProductConst'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { vibrateShort } from '@tarojs/taro'
import Popup from '@/components/Popup'
import styles from './index.module.scss'
import cs from 'classnames'
import { Swiper, SwiperItem } from '@tarojs/components'

interface IProps {
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * 默认值
   */
  defaultValue?: number
  /**
   * 配送方式
   */
  deliveryType?: number
  /**
   * 关闭触发事件
   */
  onClose: () => void
  /**
   * 确认触发事件
   */
  onConfirm: (value: number) => void
}

const DeliveryTypePopup: React.FC<IProps> = (props: IProps) => {
  const { visible, defaultValue, deliveryType = 1, onClose, onConfirm } = props
  const { DELIVERY_TYPE_TEXT } = useProductConst()
  const [current, setCurrent] = useState<number>(0)
  const [transitionCurrent, setTransitionCurrent] = useState<number>(0)
  const [touching, setTouching] = useState<boolean>(false)

  const intl = useIntl()

  useEffect(() => {
    let index = 0
    if (defaultValue) {
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        if (defaultValue === item.value) {
          index = i
        }
      }
    }
    console.log('current', index)
    setCurrent(index)
  }, [visible])

  /**
   * Closes the popup by invoking the provided onClose callback if it exists.
   */
  const handleClose = () => {
    onClose?.()
  }

  const handleCurrentChange = (e) => {
    setCurrent(e.detail.current)
    setTransitionCurrent(e.detail.current)
  }

  const handleTouchStart = () => {
    setTouching(true)
  }

  const handleTouchEnd = () => {
    setTouching(false)
  }

  const handleTransition = (e) => {
    if (!touching) return
    let itemH = 40
    let dy = e.detail.dy + itemH * current
    if (dy <= 0) {
      setTransitionCurrent(0)
    } else {
      setTransitionCurrent(Math.floor(dy / itemH + 0.5))
    }
    vibrateShort()
  }

  const triggerConfirm = () => {
    onConfirm?.(list[current].value)
  }

  const list = useMemo(() => {
    let l: any[] = []
    if ([2, 3].includes(deliveryType)) {
      l.push({ value: 2, label: DELIVERY_TYPE_TEXT[DELIVERY_TYPE_ENUM.SELF_PICKUP] }) // 自取
    }
    if ([1, 3].includes(deliveryType)) {
      l.push({ value: 1, label: DELIVERY_TYPE_TEXT[DELIVERY_TYPE_ENUM.LOGISTICS] }) // 物流
    }
    return l
  }, [deliveryType])

  return (
    <Popup
      visible={visible}
      title={intl.formatMessage({
        id: 'communityGroupBuy.deliveryTypePopup.title',
        defaultMessage: '配送方式',
      })}
      onClose={handleClose}
      customTitleStyle={{
        backgroundColor: '#FFFFFF',
        borderBottom: 'none',
      }}
    >
      <View className={styles.container}>
        <View className={styles['swiper-wrapper']}>
          <View className={styles['swiper-wrapper-center']} />
          <Swiper
            className={styles.swiper}
            activeClass={styles['swiper-item-active']}
            displayMultipleItems={5}
            vertical
            current={current}
            onChange={handleCurrentChange}
            onTransition={handleTransition}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <SwiperItem className={styles['swiper-item']} />
            <SwiperItem className={styles['swiper-item']} />
            {list.map((item, index) => (
              <SwiperItem
                key={index.toString()}
                className={cs(styles['swiper-item'], transitionCurrent === index && styles['swiper-item-active'])}
              >
                {item.label}
              </SwiperItem>
            ))}
            <SwiperItem className={styles['swiper-item']} />
            <SwiperItem className={styles['swiper-item']} />
          </Swiper>
        </View>
        <View className={styles.button} onClick={triggerConfirm}>
          {intl.formatMessage({
            id: 'communityGroupBuy.deliveryTypePopup.confirmText',
            defaultMessage: '确定',
          })}
        </View>
      </View>
    </Popup>
  )
}

export default DeliveryTypePopup
