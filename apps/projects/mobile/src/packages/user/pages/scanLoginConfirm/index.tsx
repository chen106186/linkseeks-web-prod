import GlobalWrapper from '@/components/GlobalWrapper'
/**
 * 扫码登录确认页面
 */
import React, { useEffect } from 'react'
import { getCurrentInstance, setNavigationBarTitle, pxTransform, showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { Text, View, Toast, Image } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { encryptedByAES } from '@linkseeks/crypto'
import { postMemberMobileAuthCodeActive } from '@apps/apis'
import useSwitchMall from '@/hooks/useSwitchMall'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'
const loginSvg = getOssUrlPath('/miniprogram/assets/loginicon.svg')
const ScanLoginConfirm = () => {
  const {
    router: {
      params: { code },
    },
  } = getCurrentInstance()
  const intl = useIntl()
  const { fetchMall } = useSwitchMall()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'pay.saomadenglu', defaultMessage: '扫码登录' }),
    // })
  }, [])
  const handleConfirmLogin = async () => {
    console.log('Confirm Login')
    const res = await postMemberMobileAuthCodeActive({
      authCode: encryptedByAES(code, false),
    })
    if (res.code === 1000) {
      fetchMall()
    } else {
      showToast({
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
        icon: 'none',
      })
    }
  }
  return (
    <View
      style={{
        height: '100vh',
        textAlign: 'center',
        padding: pxTransform(20),
        marginTop: pxTransform(20),
      }}
    >
      <View className={styles['loginConfirmContainer']}>
        <Image
          src={loginSvg}
          style={{
            width: pxTransform(160),
            height: pxTransform(160),
          }}
        />
        <View className={styles['loginConfirmText']}>
          {intl.formatMessage({
            id: 'user.lingxizhanghaodiannaoduandeng',
            defaultMessage: '瓴犀账号电脑端登录确认',
          })}
        </View>
        <View className={styles['loginConfirmTip']}>
          {intl.formatMessage({
            id: 'user.weiquebaozhanghaoanquan',
            defaultMessage: '为确保账号安全，请确认是您本人操作',
          })}
        </View>
      </View>
      <View className={styles['foot']}>
        <View className={styles['loginConfirmBthText']} onClick={handleConfirmLogin}>
          {intl.formatMessage({
            id: 'user.querendenglu',
            defaultMessage: '确认登录',
          })}
        </View>
        <View className={styles['cancelBtnText']} onClick={() => Router.navigateBack()}>
          {intl.formatMessage({
            id: 'user.quxiaodenglu',
            defaultMessage: '取消登录',
          })}
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(ScanLoginConfirm)
