import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { View, TextArea, Toast } from '@apps/mobile-ui'
import { getCurrentInstance, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { useMobileIntl } from '@apps/locales'
import useMerchants from '../hooks/useMerchants'
import styles from './index.module.scss'
const Feedback = () => {
  const params = getCurrentInstance().preloadData as {
    id: string
    level: 1 | 2
    refresh: () => void
  }
  const intl = useIntl()
  const translate = useMobileIntl()
  const { id, level, refresh } = params
  const { handleAudit } = useMerchants()
  const [reason, setreason] = useState('')
  const Submit = () => {
    if (reason) {
      handleAudit(level, Number(id), 0, reason).then((result) => {
        if (result) {
          refresh()
          Router.navigateBack({
            delta: 2,
          })
        }
      })
    } else {
      Toast.show({
        title: translate('mobile.resource.askPurchase.qingshurushenhebutongguoyuanyin'),
        icon: 'none',
      })
    }
  }
  const handleChange = (text: string) => {
    setreason(text)
  }
  return (
    <View className={styles['containers']}>
      <View
        style={{
          marginTop: pxTransform(10),
          paddingBottom: pxTransform(20),
          width: '100%',
        }}
      >
        <TextArea
          placeholder={translate('mobile.resource.askPurchase.qingshurushenhebutongguoyuanyinzuiduoliangbai')}
          value={reason}
          maxLength={200}
          onChange={handleChange}
          className={styles['TextArea']}
        />
      </View>
      <View className={styles['btn']} onClick={Submit}>
        {intl.formatMessage({
          id: 'order.queren',
          defaultMessage: '确认',
        })}
      </View>
    </View>
  )
}
export default GlobalWrapper(Feedback)
