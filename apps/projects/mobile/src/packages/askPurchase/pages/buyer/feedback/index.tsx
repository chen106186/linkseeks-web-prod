import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { View, TextArea, Toast } from '@apps/mobile-ui'
import { getCurrentInstance, pxTransform } from '@apps/mobile-services/utils/taro'
import { useMobileIntl } from '@apps/locales'
import Router from '@/utils/router'
import styles from './index.module.scss'
import useBuyerList from '../hooks'
const Feedback = () => {
  const params = getCurrentInstance().preloadData as {
    id: string
    refresh: () => void
  }
  const translate = useMobileIntl()
  const { id, refresh } = params
  const { handleAudit } = useBuyerList()
  const [reason, setreason] = useState('')
  const Submit = () => {
    if (reason) {
      handleAudit(Number(id), 0, reason).then((result) => {
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
        {translate('mobile.common.queren')}
      </View>
    </View>
  )
}
export default GlobalWrapper(Feedback)
