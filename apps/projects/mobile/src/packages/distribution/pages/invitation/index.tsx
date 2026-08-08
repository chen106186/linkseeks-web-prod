import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useEffect } from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { DISTRIBUTION_INVITATION_CODE } from '@/constants/storage'
import styles from './index.module.scss'
import Router from '@/utils/router'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import useStores from '@/store/useStores'

const invitationImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/invitation.png'

const InvitationPage = () => {
  const intl = useIntl()
  const router = useRouter()

  const {
    userStore: { userInfo }
  } = useStores()

  const getInvitationCode = () => {
    // c(invitationCode) 邀请码
    const { c, scene } = router.params
    if (scene) {
      const decoded = decodeURIComponent(scene)
      const params = new URLSearchParams(decoded)
      return params.get('c') || ''
    }
    return c ? decodeURIComponent(c) : ''
  }

  const invitationCode = getInvitationCode()

  useEffect(() => {
    const storeInfo = async () => {
      if (invitationCode) {
        await setAsyncStorage(DISTRIBUTION_INVITATION_CODE, invitationCode)
      }
    }
    storeInfo()
  }, [invitationCode])

  const handleJumpLogin = () => {
    Router.navigateTo('user/login')
  }

  const toApply = () => {
    if (!userInfo) {
      handleJumpLogin()
      return
    }
    Router.navigateTo('distribution/apply')
  }

  return (
    <View className={styles.psge}>
      <Image src={invitationImg} mode="aspectFit" className={styles.img}></Image>
      <View className={styles.btnView} onClick={() => toApply()}>
        <Text>
          {intl.formatMessage({
            id: 'distribution.lijijiarufenxiao',
            defaultMessage: '立即加入分销',
          })}
        </Text>
      </View>
    </View>
  )
}

export default GlobalWrapper(InvitationPage)
