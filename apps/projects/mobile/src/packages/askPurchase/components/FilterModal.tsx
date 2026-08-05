import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, ScrollView, Text, Icons } from '@apps/mobile-ui'
import cx from 'classnames'
import Router from '@/utils/router'
import { getMenuButtonBoundingClientRect, pxTransform } from '@apps/mobile-services/utils/taro'
import Header from '@/components/NavBar'
import Search from '@/components/Search'
import useStatusBarHeight from '@/hooks/useStatusBarHeight'
import { useIntl } from '@linkseeks/i18n'
import { filterIcon } from '@/constants'
import styles from './index.module.scss'

interface FilterModalProps {
  // 显示控制
  visible?: boolean
  // 关闭方法
  onClose?: () => void
  // 确定方法
  onSelect?: (item: any) => void
  /**
   * 搜索值，临时解决方案
   */
  searchValue?: string
}

const FilterModal = (props: FilterModalProps) => {
  const { visible, onClose, onSelect, searchValue } = props
  const [name, setName] = useState<string>('')
  const [list, setlist] = useState<any>([])
  const [checkRadio, setCheckRadio] = useState<{ [key: string]: any }>({
    name: '',
    billStartTime: '',
    billEndTime: '',
    dateId: '',
  })
  const intl = useIntl()

  useEffect(() => {
    if ('searchValue' in props && searchValue !== name) {
      setName(searchValue || '')
    }
  }, [searchValue])

  const getPreMonth = (number: any) => {
    const time30 = 2592000000 // 30天的时间戳
    const newTime = new Date().getTime()
    const lastTime = time30 * number
    const initTime = newTime - lastTime
    const newData = new Date(initTime)
    const Y = newData.getFullYear()
    let M: any = newData.getMonth() + 1
    let D: any = newData.getDate()
    if (M < 10) {
      M = `0${String(M)}`
    }
    if (D < 10) {
      D = `0${String(D)}`
    }
    return `${Y}-${M}-${D}`
  }

  /* 获取当前时间 */
  const starttime = () => {
    const date = new Date()
    const Y = date.getFullYear()
    let M: any = date.getMonth() + 1
    let D: any = date.getDate()
    if (M < 10) {
      M = `0${String(M)}`
    }
    if (D < 10) {
      D = `0${String(D)}`
    }
    return `${Y}-${M}-${D}`
  }
  const handleState = (name: string, key: any) => {
    const state = { ...checkRadio }
    if (name === 'dateId') {
      state.billStartTime = key.endtime
      state.billEndTime = key.starttime
      state.dateId = key.id
    }
    setCheckRadio(state)
  }
  const handleSubmit = (flag: boolean) => {
    if (flag) {
      const state: any = { ...checkRadio, name }
      onSelect && onSelect(state)
      onClose && onClose()
    } else {
      let data = {
        name: undefined,
        billStartTime: undefined,
        billEndTime: undefined,
        dateId: undefined,
      }
      setCheckRadio({
        name: '',
        billStartTime: '',
        billEndTime: '',
        dateId: '',
      })
      setName('')
      onSelect && onSelect(data)
      onClose && onClose()
    }
  }
  useEffect(() => {
    const start = starttime()
    const arr = [
      {
        name: intl.formatMessage({ id: 'order.yigeyuenei', defaultMessage: '一个月内' }),
        starttime: `${start} 00:00:00`,
        endtime: `${getPreMonth(1)} 23:59:59`,
        id: 1,
      },
      {
        name: intl.formatMessage({ id: 'order.sangeyuenei', defaultMessage: '三个月内' }),
        starttime: `${start} 00:00:00`,
        endtime: `${getPreMonth(3)} 23:59:59`,
        id: 2,
      },
      {
        name: intl.formatMessage({ id: 'order.6geyuenei', defaultMessage: '6个月内' }),
        starttime: `${start} 00:00:00`,
        endtime: `${getPreMonth(6)} 23:59:59`,
        id: 3,
      },
      {
        name: '今年',
        starttime: `${getPreMonth(0).substring(0, 4)}-12-30 00:00:00`,
        endtime: `${getPreMonth(0).substring(0, 4)}-01-01 23:59:59`,
        id: 4,
      },
      {
        name: '1年前',
        starttime: `${getPreMonth(12).substring(0, 4)}-12-30 00:00:00`,
        endtime: `${getPreMonth(12).substring(0, 4)}-01-01 23:59:59`,
        id: 5,
      },
      {
        name: '2年前',
        starttime: `${getPreMonth(24).substring(0, 4)}-12-30 00:00:00`,
        endtime: `${getPreMonth(24).substring(0, 4)}-01-01 23:59:59`,
        id: 6,
      },
    ]
    setlist(arr)
  }, [])

  const [menuRect, setMenuRect] = useState<Taro.getMenuButtonBoundingClientRect.Rect>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
  })

  const getMenuRect = () => {
    const res = getMenuButtonBoundingClientRect()
    setMenuRect(res)
  }

  useEffect(() => {
    getMenuRect()
  }, [])

  const { statusBarHeight } = useStatusBarHeight()
  const navHeight = statusBarHeight + menuRect.height + (menuRect.top - statusBarHeight) * 2

  return (
    <View>
      {visible && (
        <View
          className={cx(styles['ap'], visible ? styles['ap--active'] : '')}
          style={{ marginTop: pxTransform(navHeight) }}
        >
          <Header
            title={
              <Text
                style={{ lineHeight: pxTransform(60), fontSize: pxTransform(14), textAlign: 'center', color: '#000' }}
              >
                {intl.formatMessage({ id: 'order.wodedingdan', defaultMessage: '我的订单' })}
              </Text>
            }
            customRenderLeft={
              <View style={{ flex: 2 }}>
                <Icons
                  name="ChevronLeft"
                  size={24}
                  color="#000"
                  onClick={() => Router.reLaunch('extra/mine', { hasTab: 'true' })}
                />
              </View>
            }
          />
          <View
            className={cx(styles['ap-seat'], visible ? styles['ap-seat--active'] : '')}
            onClick={() => {
              onClose && onClose()
            }}
          ></View>
          <View className={cx(styles['ap-container'], styles['position'], visible ? styles['container--active'] : '')}>
            <View className={styles['page-wrap-search']}>
              <Search
                value={name}
                placeholder={'采购寻源单号/寻源摘要'}
                innerBackground="#F7F8FA"
                onChange={(value) => setName(value)}
                customClassName={styles['page-wrap-search-key']}
                shape="round"
                clearable
              />
              <Image style={{ width: pxTransform(18), height: pxTransform(18) }} src={filterIcon} />
            </View>
            <ScrollView style={{ height: pxTransform(200) }}>
              <View className={styles['radioBox']}>
                <View className={styles['title']}>
                  {intl.formatMessage({ id: 'order.anshijian', defaultMessage: '按时间' })}
                </View>
                <View className={styles['radioBoxCon']}>
                  {list.map((item: any) => (
                    <View
                      className={checkRadio.dateId === item.id ? styles['radioActive'] : styles['radioBoxCon-radio']}
                      key={item.id}
                      onClick={() => handleState('dateId', item)}
                    >
                      {item.name}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
            {/* onClick={()} */}
            <View className={styles['FilterModalfoot']}>
              <View className={styles['filterBtn']} onClick={() => handleSubmit(false)}>
                {intl.formatMessage({ id: 'order.zhongzhi', defaultMessage: '重置' })}
              </View>
              <View className={styles['filterText']} onClick={() => handleSubmit(true)}>
                {intl.formatMessage({ id: 'order.queding', defaultMessage: '确定' })}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
export default FilterModal
