import React, { useState, forwardRef } from 'react'
import { Tabs } from '@apps/mobile-ui'
import { useRouter, pxTransform } from '@apps/mobile-services/utils/taro'
import { ORDER_TYPE_VALUE_MAP } from '@/constants/const/order'
import ListScrollView from '@/components/ListScrollView'
import OrderItemCard from '@/components/OrderComponents/OrderItemCard'
import { getOrderMobileVendorPage } from '@apps/apis'
import { getYearMonth } from '@/utils/date'
import Router from '@/utils/router'
import { getIntl } from '@linkseeks/i18n'

const ScrollOrder = ({}, ref) => {
  const { month, keyword, memberId, memberRoleId } = useRouter().params
  const [tabActiveIndex, setTabActiveIndex] = useState<number>(0)

  const ORDER_TYPE = {
    ALL: getIntl().formatMessage({ id: 'order.all', defaultMessage: '全部' }),
    STORE_PURCHASE: getIntl().formatMessage({ id: 'order.storePurchase', defaultMessage: '现货采购' }),
    INQUIRY_PURCHASE: getIntl().formatMessage({ id: 'order.inquiryPurchase', defaultMessage: '询价采购' }),
    CHANNEL_PURCHASE: getIntl().formatMessage({ id: 'order.channelPurchase', defaultMessage: '渠道直采' }),
    CHANNEL_STORE: getIntl().formatMessage({ id: 'order.channelStore', defaultMessage: '渠道现货' }),
  }

  const TAB_LIST = [
    { title: ORDER_TYPE.ALL, key: 'ALL' },
    { title: ORDER_TYPE.STORE_PURCHASE, key: 'STORE_PURCHASE' },
    { title: ORDER_TYPE.INQUIRY_PURCHASE, key: 'INQUIRY_PURCHASE' },
    { title: ORDER_TYPE.CHANNEL_PURCHASE, key: 'CHANNEL_PURCHASE' },
    { title: ORDER_TYPE.CHANNEL_STORE, key: 'CHANNEL_STORE' },
  ]

  // TAB 切换
  const onTab = (index: number) => {
    setTabActiveIndex(index)
    ref.current?.updateList({
      orderType: ORDER_TYPE_VALUE_MAP[TAB_LIST[index].key],
    })
  }

  const renderItem = ({ item }: { item: any }) => (
    <OrderItemCard
      itemData={item}
      showMoreProducts
      onClick={() => Router.navigateTo('root/order/orderDetail', { orderId: item.orderId })}
      customStyle={{ minHeight: pxTransform(172) }}
    />
  )

  return (
    <>
      <Tabs scroll current={tabActiveIndex} tabList={TAB_LIST} onClick={onTab} activeColor="#000" />
      <ListScrollView
        requestApi={getOrderMobileVendorPage}
        renderItem={renderItem}
        initParams={{
          month: month || getYearMonth(),
          memberName: keyword ? decodeURIComponent(keyword) : '',
          memberId: memberId || '',
          memberRoleId: memberRoleId || '',
        }}
        ref={ref}
      />
    </>
  )
}

export default forwardRef(ScrollOrder)
