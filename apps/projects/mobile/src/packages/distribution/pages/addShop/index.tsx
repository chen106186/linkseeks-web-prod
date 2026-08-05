import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import styles from './index.module.scss'
const addShopImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/addshop-img.png'
import Router from '@/utils/router'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { DISTRIBUTION_INVITER_ACCOUNT } from '@/constants/storage'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import useJmpHome from '@/hooks/useJmpHome'
import useStores from '@/store/useStores'

const AddShopPage = () => {
  const intl = useIntl()
  const router = useRouter()

  const { jmpHome } = useJmpHome()
  const {
    userStore: { userInfo },
  } = useStores()

  const getInviterAccount = () => {
    // a(inviterAccount) 邀请人账号
    const { a, scene } = router.params
    if (scene) {
      const decoded = decodeURIComponent(scene)
      const params = new URLSearchParams(decoded)
      return params.get('a') || ''
    }
    return a ? decodeURIComponent(a) : ''
  }

  const inviterAccount = getInviterAccount()

  useEffect(() => {
    if (userInfo) {
      jmpHome()
      return
    }
    const storeInfo = async () => {
      if (inviterAccount) {
        await setAsyncStorage(DISTRIBUTION_INVITER_ACCOUNT, inviterAccount)
      }
    }
    storeInfo()
  }, [inviterAccount])

  const toRegister = () => {
    Router.navigateTo('user/register')
  }

  return (
    <View className={styles.psge}>
      <Image src={addShopImg} mode="aspectFit" className={styles.img}></Image>
      <View className={styles.btnView} onClick={() => toRegister()}>
        <Text>
          {intl.formatMessage({
            id: 'order.lijizhuce',
            defaultMessage: '立即注册',
          })}
        </Text>
      </View>
    </View>
  )
}

export default GlobalWrapper(AddShopPage)
