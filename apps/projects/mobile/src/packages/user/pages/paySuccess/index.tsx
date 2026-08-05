import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import { getCurrentInstance, setNavigationBarTitle, showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { Button } from '@tarojs/components'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const PaySuccess = () => {
  const { tradeCode }: any = getCurrentInstance()?.router?.params
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({id: 'pay.success.navigationBarTitleText'}) })
  }, [])
  const handleBackAppError = (event) => {
    showToast({
      title: event.detail.errMsg,
      icon: 'none',
    })
  }
  return (
    <View className={styles['paySuccess']}>
      <View className={styles['paySuccess-container']}>
        <Icons name="CheckFill" color="#00A98F" size={64} />
        <Text className={styles['paySuccess-content']}>
          {intl.formatMessage({
            id: 'pay.toast.success',
          })}
        </Text>
      </View>
      <Button
        className={styles['paySuccess-backBtn']}
        openType="launchApp"
        appParameter={tradeCode}
        onError={handleBackAppError}
      >
        {intl.formatMessage({
          id: 'pay.success.back.btn',
        })}
      </Button>
    </View>
  )
}
export default GlobalWrapper(PaySuccess)
