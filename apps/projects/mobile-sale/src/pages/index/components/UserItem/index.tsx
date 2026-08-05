import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import { View, Image, Text } from '@apps/mobile-ui'
import Router from '@/utils/router'
import styles from './index.module.scss'

type WarpIprops = {
  name: string
  url: any
  img: string
}
const UserItem = () => {
  const intl = useIntl()
  const [list, setlist] = useState<any>([])
  useEffect(() => {
    const dataSource = [
      {
        name: intl.formatMessage({ id: 'user.yejitongji', defaultMessage: '业绩统计' }),
        img: getOssUrlPath('/Images/homeIcon1.png'),
        url: 'root/order/achievementList',
      },
      {
        name: intl.formatMessage({ id: 'user.huiyuantongji', defaultMessage: '会员统计' }),
        img: getOssUrlPath('/Images/homeIcon2.png'),
        url: 'root/order/memberList',
      },
      {
        name: intl.formatMessage({ id: 'user.baodingdingdao', defaultMessage: '绑定订单' }),
        img: getOssUrlPath('/Images/homeIcon3.png'),
        url: 'root/order/orderList',
      },
      {
        name: intl.formatMessage({ id: 'user.dingdaoshenhe', defaultMessage: '订单审核' }),
        img: getOssUrlPath('/Images/homeIcon4.png'),
        url: 'root/orderExamine/orderExamineList',
      },
      {
        name: intl.formatMessage({ id: 'user.xunjiadao', defaultMessage: '询价单' }),
        img: getOssUrlPath('/Images/homeIcon5.png'),
        url: 'root/inquiry/inquiryList',
      },
      {
        name: intl.formatMessage({ id: 'user.baojiadaoshenhe', defaultMessage: '报价单审核' }),
        img: getOssUrlPath('/Images/homeIcon6.png'),
        url: 'root/offer/offerList',
      },
    ]
    setlist(dataSource)
  }, [])
  return (
    <View className={styles['container-List']}>
      {list.map((item: WarpIprops, index: number) => (
        <View key={index} className={styles['warp-item']} onClick={() => Router.navigateTo(item.url)}>
          <Image className={styles['warp-img']} src={item.img} />
          <View className={styles['warp-item-text']}>{item.name}</View>
        </View>
      ))}
    </View>
  )
}

export default UserItem
