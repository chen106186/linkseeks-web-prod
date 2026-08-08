import React from 'react'
import { View, Toast } from '@apps/mobile-ui'
import { setClipboardData } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { ORDER_TYPE_VALUE_MAP } from '@/constants/const/order'
import styles from './index.module.scss'

export type PropsType = {
  source: any
}

const BaseInfoCard = ({ source = {} }: PropsType) => {
  const intl = useIntl()
  const onCopy = (text: string) => {
    setClipboardData({
      data: text,
      success: () =>
        Toast.show({
          title: intl.formatMessage({ id: 'common.copy.success', defaultMessage: '内容复制成功' }),
          icon: 'none',
        }),
    })
  }

  const ORDER_VALUE_TYPE = {
    [ORDER_TYPE_VALUE_MAP.STORE_PURCHASE]: intl.formatMessage({
      id: 'order.storePurchase',
      defaultMessage: '现货采购',
    }),
    [ORDER_TYPE_VALUE_MAP.INQUIRY_PURCHASE]: intl.formatMessage({
      id: 'order.inquiryPurchase',
      defaultMessage: '询价采购',
    }),
    [ORDER_TYPE_VALUE_MAP.CHANNEL_PURCHASE]: intl.formatMessage({
      id: 'order.channelPurchase',
      defaultMessage: '渠道直采',
    }),
    [ORDER_TYPE_VALUE_MAP.CHANNEL_STORE]: intl.formatMessage({
      id: 'order.channelStore',
      defaultMessage: '渠道现货',
    }),
  }

  return (
    <View className={styles['info-base']}>
      <View className={styles['info-base-code']} onClick={() => onCopy('TS239748234')}>
        <View>{source.orderNo}</View>
        <View className={styles['copy']}>{intl.formatMessage({ id: 'common.copy.copy', defaultMessage: '复制' })}</View>
      </View>
      <View className={styles['info-base-buyer']}>
        {intl.formatMessage({ id: 'order.purchaser', defaultMessage: '采购商' })}：{source.buyerMemberName}
      </View>
      <View>
        {intl.formatMessage({ id: 'order.orderType', defaultMessage: '订单类型' })}：
        {ORDER_VALUE_TYPE[source.orderType]}
      </View>
    </View>
  )
}

export default BaseInfoCard
