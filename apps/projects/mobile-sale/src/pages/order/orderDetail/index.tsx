import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import { useRouter, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import NavBar from '@/components/NavBar'
import BaseInfoCard from '@/components/OrderComponents/BaseInfoCard'
import CommodityInfoCard from '@/components/OrderComponents/CommodityInfoCard'
import MoneyInfoCard from '@/components/OrderComponents/MoneyInfoCard'
import PayInfoCard from '@/components/OrderComponents/PayInfoCard'
import OrderInfoCard from '@/components/OrderComponents/OrderInfoCard'
import { getOrderMobileVendorDetail } from '@apps/apis'
import styles from './index.module.scss'

const OrderDetail = () => {
  const intl = useIntl()
  const { orderId } = useRouter().params
  const [orderDetail, setOrderDetail] = useState<any>({})

  useEffect(() => {
    if (orderId) {
      showLoading({ title: intl.formatMessage({ id: 'common.data.loading', defaultMessage: '加载中...' }) })
      getOrderMobileVendorDetail({ orderId }).then(({ code, data }) => {
        if (code === 1000) {
          setOrderDetail(data)
          hideLoading()
        }
      })
    }
  }, [])

  return (
    <View className={styles['container']}>
      <NavBar
        title={intl.formatMessage({ id: 'order.orderDetail', defaultMessage: '订单详情' })}
        titleColor="#FFF"
        backIconColor="#FFF"
        customClassName={styles['nav-bar']}
      />

      <ScrollView className={styles['scrollView']}>
        <View className={styles['status']}>
          <Text>{orderDetail.outerStatusName}</Text>
        </View>
        <View className={styles['info']}>
          {/* 订单基本信息/采购商信息 */}
          <BaseInfoCard source={orderDetail} />
          {/* 供应商/商品/地址相关信息 */}
          <CommodityInfoCard source={orderDetail} />
          {/* 付款信息 */}
          <MoneyInfoCard source={orderDetail} />
          {/* 支付信息 */}
          <PayInfoCard source={orderDetail} />
          {/* 订单信息 */}
          <OrderInfoCard source={orderDetail} />
        </View>
      </ScrollView>
    </View>
  )
}

export default OrderDetail
