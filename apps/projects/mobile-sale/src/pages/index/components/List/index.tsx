import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Image, Text } from '@apps/mobile-ui'

import styles from './index.module.scss'

interface Iprops {
  userInfo: any
  userData: any
}
type WarpIprops = {
  name: string
  price: any
}
const List = (props: Iprops) => {
  const intl = useIntl()
  const { userInfo, userData } = props
  const [list, setlist] = useState<any>([])

  useEffect(() => {
    const dataSource = [
      {
        name: intl.formatMessage({ id: 'user.huiyuanxiadaojine', defaultMessage: '订单应付金额' }),
        price: `¥${userData?.orderAmount}`,
      },
      {
        name: intl.formatMessage({ id: 'user.dingdaoshoukuanjin', defaultMessage: '订单已付金额' }),
        price: `¥${userData?.orderPaidAmount}`,
      },
      {
        name: intl.formatMessage({ id: 'user.dingdanwanchengjine', defaultMessage: '订单完成金额' }),
        price: `¥${userData?.orderFinishAmount}`,
      },
    ]
    setlist(dataSource)
    console.log(dataSource, userData)
  }, [userData])
  return (
    <View className={styles['container-List']}>
      <View className={styles['title']}>
        {intl.formatMessage({ id: 'user.benyueshujukuanshu', defaultMessage: '本月数据概览' })}
      </View>
      <View className={styles['warp']}>
        {list.map((item: WarpIprops, index: number) => (
          <View className={styles['warp-item']} key={index}>
            <Text className={styles['warp-item-text']}>{item.name}</Text>
            <Text className={styles['warp-item-price']}>{item.price}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
List.defaultProps = {}
export default List
