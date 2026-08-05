import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Image, Text } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import Router from '@/utils/router'
import styles from './index.module.scss'

interface Iprops {
  userInfo: any
  userData: any
}

const Head = (props: Iprops) => {
  const intl = useIntl()
  const { userInfo, userData } = props
  useEffect(() => {}, [])

  const jump = () => {
    if (userInfo?.accessToken) {
      Router.navigateTo('root/user/userInfo')
    } else {
      Router.navigateTo('root/login')
    }
  }
  return (
    <View className={styles['container-Head']}>
      <View className={styles['userInfo']}>
        <View className={styles['userInfo-warp']}>
          <View className={styles['name']}>
            {intl.formatMessage({ id: 'user.mimadenglu', defaultMessage: 'Hi' })}， {userInfo?.userName}
          </View>
          <View className={styles['account']}>{userInfo?.account}</View>
        </View>
        <Image className={styles['Iocn']} src={getOssUrlPath(`/Images/setting.png`)} onClick={() => jump()} />
      </View>
      <View className={styles['box']}>
        <View className={styles['box-left']}>
          <Image className={styles['box-img']} src={getOssUrlPath(`/Images/num.png`)} />
          <View className={styles['box-Price']}>
            <Text className={styles['Symbol']}>¥</Text>
            <Text className={styles['PriceText']}>{userData.orderFinishAllAmount}</Text>
          </View>
          <View className={styles['Text']}>
            {intl.formatMessage({ id: 'user.dingdaowanchegnzonge', defaultMessage: '订单完成总额' })}
          </View>
        </View>
        <View className={styles['box-right']}>
          <Image className={styles['box-img']} src={getOssUrlPath(`/Images/userNum.png`)} />
          <View className={styles['box-Price']}>
            <Text className={styles['PriceText']}>{userData.memberAllQuantity}</Text>
          </View>
          <View className={styles['Text']}>
            {intl.formatMessage({ id: 'user.huiyuankehuzongshu', defaultMessage: '会员客户总数' })}
          </View>
        </View>
      </View>
    </View>
  )
}
Head.defaultProps = {}
export default Head
