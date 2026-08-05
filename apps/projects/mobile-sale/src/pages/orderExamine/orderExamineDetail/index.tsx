import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import { useRouter, useDidShow, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import NavBar from '@/components/NavBar'
import BaseInfoCard from '@/components/OrderComponents/BaseInfoCard'
import CommodityInfoCard from '@/components/OrderComponents/CommodityInfoCard'
import MoneyInfoCard from '@/components/OrderComponents/MoneyInfoCard'
import PayInfoCard from '@/components/OrderComponents/PayInfoCard'
// import ContractInfoCard from '@/components/OrderComponents/ContractInfoCard'
import OrderInfoCard from '@/components/OrderComponents/OrderInfoCard'
import FooterWrap from '@/components/OrderComponents/FooterWrap'
import { getOrderMobileVendorDetail } from '@apps/apis'
import styles from './index.module.scss'

const OrderExamineDetail = () => {
  const intl = useIntl()
  const { orderId } = useRouter().params
  const [orderDetail, setOrderDetail] = useState<any>()

  useDidShow(() => {
    if (orderId) {
      showLoading({ title: intl.formatMessage({ id: 'common.data.loading', defaultMessage: '加载中...' }) })
      getOrderMobileVendorDetail({ orderId }).then(({ code, data }) => {
        if (code === 1000) {
          setOrderDetail(data)
          hideLoading()
        }
      })
    }
  })

  return (
    <View className={styles['container']}>
      <NavBar
        title={intl.formatMessage({ id: 'order.orderDetail', defaultMessage: '订单详情' })}
        titleColor="#FFF"
        backIconColor="#FFF"
        customClassName={styles['nav-bar']}
      />
      {orderDetail && (
        <>
          <ScrollView className={styles['scrollView']}>
            <View className={styles['status']}>
              <Text>{orderDetail.innerStatusName}</Text>
            </View>
            <View className={styles['info']}>
              {/* 订单基本信息/采购商信息 */}
              <BaseInfoCard source={orderDetail} />
              {/* 供应商/商品/地址相关信息 */}
              <CommodityInfoCard source={orderDetail} showEditPrice />
              {/* 付款信息 */}
              <MoneyInfoCard source={orderDetail} showEditFreight />
              {/* 支付信息 */}
              <PayInfoCard source={orderDetail} showEditRatio />
              {/* 电子合同 */}
              {/* <ContractInfoCard /> */}
              {/* 订单信息 */}
              <OrderInfoCard source={orderDetail} />
            </View>
          </ScrollView>
          {/* 审核按钮 */}
          <FooterWrap source={orderDetail} />
        </>
      )}
    </View>
  )
}

export default OrderExamineDetail
