import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { View, TextArea, Toast } from '@apps/mobile-ui'
import { getCurrentInstance, setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { postOrderMobileBuyerValidateGradeOne, postOrderMobileBuyerValidateGradeTwo } from '@apps/apis'
import styles from './index.module.scss'
const Feedback = () => {
  const { params }: any = getCurrentInstance()?.router
  const intl = useIntl()

  // auditState 0 是不通过 1 是通过
  // status 1 是一级 是二级
  const [reason, setreason] = useState('')
  useEffect(() => {
    setNavigationBarTitle({
      title: params.auditState
        ? intl.formatMessage({
            id: 'order.shenhetongguoyuanyin',
            defaultMessage: '审核通过原因',
          })
        : intl.formatMessage({
            id: 'order.shenhebutongguoyuanyin',
            defaultMessage: '审核不通过原因',
          }),
    })
  }, [])
  const Submit = () => {
    const fn = params.status == 1 ? postOrderMobileBuyerValidateGradeOne : postOrderMobileBuyerValidateGradeTwo
    fn({
      agree: params.auditState,
      reason,
      orderId: params.orderId,
    }).then((res: any) => {
      if (res.code === 1000) {
        Router.navigateTo('order/mycommodityList', {
          Index: params.Index,
        })
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          icon: 'none',
        })
      }
    })
  }
  const handleChange = (text: string) => {
    setreason(text)
  }
  return (
    <View className={styles['containers']}>
      <View
        style={{
          // padding: 10,
          marginTop: pxTransform(10),
          paddingBottom: pxTransform(20),
          width: '100%',
        }}
      >
        <TextArea
          placeholder={intl.formatMessage({
            id: 'order.dianjishuruqitayuanyin',
            defaultMessage: '点击输入其他原因',
          })}
          value={reason}
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
