import React, { useEffect } from 'react'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Toast, Image } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'
import Store from '@/store'
import { getOssUrlPath } from '@apps/constants'

/* 用户信息 */
const Userinfo = () => {
  const intl = useIntl()
  const {
    userStore: { removeUserInfo, userInfo, getRoleName },
  } = useStores()

  const handleLogout = async () => {
    Store.userStore.removeUserInfo()
    Toast.show({ title: intl.formatMessage({ id: 'user.tuichuchenggong', defaultMessage: '退出成功' }), icon: 'none' })
    Router.redirectTo('extra/login')
  }

  useEffect(() => {
    setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.gerenziliao', defaultMessage: '账号信息' }) })
  }, [])

  const Logout = (
    <View className={styles['logout']}>
      <View className={styles['logout-btn']}>
        <Text className={styles['logout-text']} onClick={() => handleLogout()}>
          {intl.formatMessage({ id: 'user.tuichudenglu', defaultMessage: '退出登录' })}
        </Text>
      </View>
    </View>
  )
  return (
    <View className={styles['userinfo-container']}>
      <View className={styles['warp']}>
        <View className={styles['mian']}>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({ id: 'user.bangdingshoujihao', defaultMessage: '头像' })}
            </Text>
            <View className={styles['boxright']}>
              <Image
                className={styles['avatar']}
                src={userInfo?.logo || getOssUrlPath('/irregular/default_logod2352e564b114944b0be2dcdaade9816.png')}
              />
            </View>
          </View>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({ id: 'user.bangdingshoujihao', defaultMessage: '姓名' })}
            </Text>
            <Text className={styles['boxright']}>{userInfo?.userName}</Text>
          </View>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({ id: 'user.dengluzhanghao', defaultMessage: '账号' })}
            </Text>
            <Text className={styles['boxright']}>{userInfo?.account}</Text>
          </View>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({ id: 'user.shenfenzheng', defaultMessage: '角色' })}
            </Text>
            <Text className={styles['boxright']}>{getRoleName()}</Text>
          </View>
          <View className={styles['box']}>
            <Text className={styles['boxleft']}>
              {intl.formatMessage({ id: 'user.suoshuzuzhijigou', defaultMessage: '所属组织机构' })}
            </Text>
            <Text className={styles['boxright']}>{userInfo?.memberName}</Text>
          </View>
        </View>
      </View>
      <View className={styles['foot']}>{Logout}</View>
    </View>
  )
}
export default observer(Userinfo)
