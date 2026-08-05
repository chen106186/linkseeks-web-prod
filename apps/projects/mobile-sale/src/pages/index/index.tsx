import React, { useEffect, useState } from 'react'
import { Button, Text, View } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import { usePullDownRefresh, showLoading, stopPullDownRefresh, hideLoading } from '@apps/mobile-services/utils/taro'
import { getOrderMobileWechatAppletMemberSalesIndexCount } from '@apps/apis'
import styles from './index.module.scss'
import Head from './components/Head'
import List from './components/List'
import UserItem from './components/UserItem'

const HomeView = () => {
  const {
    userStore: { userInfo },
  } = useStores()
  const [userData, setuserData] = useState<any>({})
  // 获取首页订单统计
  const count = async () => {
    const res = await getOrderMobileWechatAppletMemberSalesIndexCount()
    setuserData(res.data)
  }
  usePullDownRefresh(async () => {
    showLoading()
    const res = await getOrderMobileWechatAppletMemberSalesIndexCount()
    setuserData(res.data)
    if (res.code === 1000) {
      setTimeout(() => {
        stopPullDownRefresh()
        hideLoading()
      }, 1000)
    }
  })
  useEffect(() => {
    count()
  }, [])
  return (
    <View className={styles['container']}>
      <Head userInfo={userInfo} userData={userData} />
      <List userInfo={userInfo} userData={userData} />
      <UserItem />
    </View>
  )
}

export default observer(HomeView)
