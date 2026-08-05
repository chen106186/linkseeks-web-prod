import React, { useRef, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import ListScrollView, { UpdateRefType } from '@/components/ListScrollView'
import { getOrderMobileWechatAppletMemberSalesPersonalAchievement } from '@apps/apis'
import AchievementItemCard from './components/AchievementItemCard'
import styles from './index.module.scss'

const AchievementList = () => {
  const intl = useIntl()
  const scrollRef = useRef<UpdateRefType>()

  const renderItem = ({ item }) => <AchievementItemCard itemData={item} />

  useEffect(() => {
    setNavigationBarTitle({
      title: intl.formatMessage({ id: 'title.performanceStatistics', defaultMessage: '业绩统计' }),
    })
  }, [])

  return (
    <View className={styles['container']}>
      {/* <View className={styles['title']}>月业绩概况</View> */}
      <ListScrollView
        requestApi={getOrderMobileWechatAppletMemberSalesPersonalAchievement}
        renderItem={renderItem}
        ref={scrollRef}
      />
    </View>
  )
}

export default AchievementList
