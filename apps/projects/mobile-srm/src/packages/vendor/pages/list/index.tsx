import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Empty from '@/components/Empty'
import GenIndicator from '@/components/GenIndicator'
import Router from '@/utils/router'
import request from '@apps/apis/src/request'
import styles from './index.module.scss'

// TODO: replace with @apps/apis generated function once YAPI syncs
const fetchVendorOrders = (params: { current: number; pageSize: number }) =>
  request({ url: '/purchase/requisition/srm/vendor/page', method: 'GET', params })

const VENDOR_STATUS_MAP: Record<number, string> = {
  1: '待发货',
  2: '已发货',
}

const VendorOrderList: React.FC = () => {
  const [list, setList] = useState<any[]>([])
  const [current, setCurrent] = useState(1)
  const [noMoreDate, setNoMoreDate] = useState(false)
  const [loading, setLoading] = useState(false)
  const loadMoreLoading = useRef<boolean>(false)

  const fetchList = (page = 1, merge = false) => {
    setLoading(true)
    fetchVendorOrders({ current: page, pageSize: 10 })
      .then((res: any) => {
        if (res.code === 1000) {
          const items = res.data?.data || []
          if (merge) {
            if (!items || items.length <= 0) {
              setNoMoreDate(true)
              setCurrent(page - 1)
            } else {
              setList((prev) => [...prev, ...items])
              loadMoreLoading.current = false
              setNoMoreDate(false)
            }
          } else {
            setList(items)
            loadMoreLoading.current = false
            if (items.length < 10) {
              setNoMoreDate(true)
            } else {
              setNoMoreDate(false)
            }
          }
        }
      })
      .finally(() => {
        setLoading(false)
        loadMoreLoading.current = false
      })
  }

  useEffect(() => {
    fetchList(1)
  }, [])

  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      const nextPage = current + 1
      setCurrent(nextPage)
      fetchList(nextPage, true)
    }
  }

  const renderItem = ({ item }: { item: any }) => (
    <View
      key={item.id}
      className={styles.card}
      onClick={() => Router.navigateTo('vendor/orderDetail', { id: item.id })}
    >
      <View className={styles.row}>
        <Text className={styles.no}>{item.requisitionNo}</Text>
        <Text className={styles.status}>
          {item.vendorInnerStatus ? VENDOR_STATUS_MAP[item.vendorInnerStatus] : '待发货'}
        </Text>
      </View>
      <View className={styles.row}>
        <Text className={styles.label}>采购方：</Text>
        <Text>{item.buyerMemberName}</Text>
      </View>
      {item.digest && (
        <View className={styles.row}>
          <Text className={styles.label}>摘要：</Text>
          <Text>{item.digest}</Text>
        </View>
      )}
      <View className={styles.row}>
        <Text className={styles.label}>下单时间：</Text>
        <Text>{item.createTime}</Text>
      </View>
      {item.mailNo && (
        <View className={styles.row}>
          <Text className={styles.label}>快递单号：</Text>
          <Text>
            {item.mailNo}（{item.expressCompanyName}）
          </Text>
        </View>
      )}
    </View>
  )

  return (
    <PageLayout renderHeader={<NavBar title="我的采购单" />}>
      <ScrollView
        data={list}
        renderItem={renderItem}
        keyExtractor={(item: any) => `vendorItem${item.id}`}
        onEndReachedThreshold={50}
        listEmptyComponent={!loading ? <Empty /> : null}
        listFooterComponent={list.length > 0 ? <GenIndicator noMoreDate={noMoreDate} /> : null}
        horizontal={false}
        onEndReached={() => {
          loadMoreData()
        }}
      />
    </PageLayout>
  )
}

export default VendorOrderList
