import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useRef } from 'react'
import { setNavigationBarTitle, preload } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, Icons, ScrollView } from '@apps/mobile-ui'
import { Picker } from '@tarojs/components'
import { checkMore } from '@/utils'
import { dateFormat } from '@/utils/date'
import Loading from '@/components/Loading'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import {
  getPayMobileEAccountAllInPayGetEAccountTradeRecord,
  GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail,
} from '@apps/apis'
import styles from './index.module.scss'
import { getTypeImg } from '../../../utils'
import { usePageInit } from '@/hooks/usePageInit'
const replenishZero = (count: number) => {
  if (count < 10) {
    return `0${count}`
  }
  return count
}
const EAccountRecord = () => {
  const date = new Date()
  const [toggle, setToggle] = useState<boolean>(false) // 显示弹出
  const [list, setList] = useState<any>([]) // 处理的数据
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 15
  const [currentMonth, setCurrentMonth] = useState<number>(date.getMonth() + 1)
  const [currentDate, setCurrentData] = useState<string>()
  const startTime = useRef<string>() // 开始时间
  const endTime = useRef<string>() // 结束时间
  const pageRef = useRef<number>(1)
  const intl = useIntl()
  /* 获取数据 */
  const getTradingRecord = (): Promise<GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail[]> => {
    if (loading) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      const param: any = {
        startTime: startTime.current,
        endTime: endTime.current,
        pageSize: PAGE_SIZE,
        current: pageRef.current,
      }
      getPayMobileEAccountAllInPayGetEAccountTradeRecord(param)
        .then((res) => {
          if (res.code === 1000) {
            setHasMore(checkMore(pageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
            resolve(res.data.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  /* 点击选中时间 */
  const handleSelectDatePicker = (e) => {
    const val = e.detail.value
    const now = new Date(val)
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const monthStartDate = new Date(year, month, 1)
    const monthEndDate = new Date(year, month, 0)
    const startDay = monthStartDate.getDate()
    const endDay = monthEndDate.getDate()
    setCurrentData(`${year}年${month}月`)
    setCurrentMonth(month)
    startTime.current = `${year}-${replenishZero(month)}-${replenishZero(startDay)} 00:00:00`
    endTime.current =
      date.getMonth() + 1 > month
        ? `${year}-${replenishZero(month)}-${replenishZero(endDay)} 24:00:00`
        : dateFormat(date)
    pageRef.current = 1
    getTradingRecord()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
    setToggle(!toggle)
  }
  usePageInit()
  useEffect(() => {
    setCurrentData(`${date.getFullYear()}年${date.getMonth() + 1}月`)
    startTime.current = `${date.getFullYear()}-${replenishZero(date.getMonth() + 1)}-01 00:00:00`
    endTime.current = dateFormat(date)
    pageRef.current = 1
    getTradingRecord()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'pay.jiaoyijilu', defaultMessage: '交易记录' }) })
  }, [])

  /* 头部左边标签 */
  const extraText = () => (
    <Picker mode="date" value="" fields="month" onChange={handleSelectDatePicker}>
      <View onClick={() => setToggle(!toggle)} className={styles['extra']}>
        <Icons name="Filter" size={24} />
      </View>
    </Picker>
  )
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getTradingRecord()
      .then((res) => {
        setList(list.concat(res))
      })
      .catch(() => {})
  }
  const renderRecordItem = ({ item }: { item: GetPayMobileEAccountAllInPayGetEAccountTradeRecordResponseDetail }) => (
    <View
      className={styles['recordItem']}
      onClick={() => {
        preload({
          ...item,
        })
        Router.navigateTo('basicSetting/eAccountRecordDetail')
      }}
    >
      <Image className={styles['recordIcon']} src={getTypeImg(item.tradeType)} />
      <View className={styles['recordInfoWrap']}>
        <View className={styles['recordLine']}>
          <Text className={styles['recordLine_tradeType']}>{item.tradeType}</Text>
          <Text className={styles['recordLine_chgAmount']}>{item.chgAmount}</Text>
        </View>
        <View className={styles['recordLine']}>
          <Text className={styles['recordLine_changeTime']}>{item.changeTime}</Text>
          <Text className={styles['recordLine_type']}>{item.type}</Text>
        </View>
      </View>
    </View>
  )
  return (
    <View className={styles['eAccountRecord']}>
      <View className={styles['eAccountRecord_datePickerWrap']} onClick={() => setToggle(!toggle)}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
          }}
        >
          <Text className={styles['currentDateText']}>{currentDate}</Text>
          <Icons className={styles['currentDateIcon']} name="ArrowDownFill" size={24} />
        </View>
        {extraText()}
      </View>
      <View className={styles['eAccountRecord_listHeader']}>
        <Text className={styles['eAccountRecord_listHeaderText']}>{currentMonth}月</Text>
      </View>
      <View className={styles['eAccountRecord_container']}>
        <ScrollView
          data={list}
          className={styles['record-scrollView']}
          renderItem={renderRecordItem}
          keyExtractor={(item) => item.tradeNo}
          listFooterComponent={
            <Loading
              loading={loading}
              noMore={!hasMore}
              noMoreText={intl.formatMessage({
                id: 'pay.meiyougengduola',
                defaultMessage: '没有更多啦~',
              })}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.05}
        />
      </View>
    </View>
  )
}
export default GlobalWrapper(EAccountRecord)
