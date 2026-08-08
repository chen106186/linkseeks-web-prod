import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { getCurrentInstance, setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Tabs, TabsPane, Text, ScrollView } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import styles from './index.module.scss'
import useFetchCollection from './useFetchCollections'
import Loading from '@/components/Loading'
import useStores from '@/store/useStores'
import { dateFormat } from '@/utils/date'
import Router from '@/utils/router'
import Coupon from '@/components/Coupon'
import { useIntl } from '@linkseeks/i18n'
import { getMarketingMobileCouponDetailPage } from '@apps/apis'
import { usePageInit } from '@/hooks/usePageInit'
const MyCollections = () => {
  const params = getCurrentInstance().router?.params
  const [active, setActive] = useState(params?.mode ? Number(params?.mode) - 1 : 0)
  const {
    userStore: { shopAndSite },
  } = useStores()
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'card.myCoupons.navigationBarTitleText', defaultMessage: '优惠券' }),
    // })
  }, [])
  const commodityService = getMarketingMobileCouponDetailPage
  const paramInfo = {
    shopId: shopAndSite?.id || 0,
    ...params,
  }
  const { dataSource, totalCount, loading, hasMore, handleLoadMore, refreshData } = useFetchCollection(
    commodityService,
    1,
    paramInfo,
  )
  const {
    dataSource: dataSourceUsed,
    totalCount: totalCountUsed,
    loading: loadingUsed,
    hasMore: hasMoreUsed,
    handleLoadMore: handleLoadMoreUsed,
    refreshData: refreshDataUsed,
  } = useFetchCollection(commodityService, 2, paramInfo)
  const {
    dataSource: dataSourceExpired,
    totalCount: totalCountExpired,
    loading: loadingExpired,
    hasMore: hasMoreExpired,
    handleLoadMore: handleLoadMoreExpired,
    refreshData: refreshDataExpired,
  } = useFetchCollection(commodityService, 3, paramInfo)
  const handleTabChange = (key: number) => {
    setActive(key)
  }
  const handleNavigation = (info: any) => {
    if (info?.belongType === 1) {
      Router.navigateTo('commodityMerge/stocksSourcing/index', {
        idInList: info?.productIds ? info?.productIds.join(',') : '',
      })
    } else {
      Router.navigateTo('commodityMerge/stocksSourcing/conponSimilarList', {
        couponId: info?.couponId,
        belongType: info?.belongType,
      })
    }
  }
  const renderItem = (item: any, use?: boolean) => {
    const new_item = {
      ...item,
      effectiveTimeEnd: dateFormat(new Date(item.validTimeEnd), 'YYYY-MM-DD HH:mm'),
    }
    // console.log(new_item)
    if (use) {
      return (
        <Coupon
          data={new_item}
          toUse={() => handleNavigation(new_item)}
          customStyle={{
            marginBottom: pxTransform(8),
          }}
        />
      )
    }
    return (
      <Coupon
        data={new_item}
        customStyle={{
          marginBottom: pxTransform(8),
        }}
      />
    )
  }
  return (
    <View className={styles.page}>
      <Tabs
        tabList={[
          {
            title: `${intl.formatMessage({
              id: 'card.myCoupons.tab.used.not',
              defaultMessage: '未使用',
            })}(${totalCount})`,
          },
          {
            title: `${intl.formatMessage({
              id: 'card.myCoupons.tab.used',
              defaultMessage: '已使用',
            })}(${totalCountUsed})`,
          },
          {
            title: `${intl.formatMessage({
              id: 'card.myCoupons.tab.outDate',
              defaultMessage: '已过期',
            })}(${totalCountExpired})`,
          },
        ]}
        current={active}
        onClick={handleTabChange}
      >
        <TabsPane current={active} index={0}>
          <View className={styles.padd}>
            <ScrollView
              style={{
                height: '100%',
              }}
              renderItem={(item: any) => renderItem(item.item, true)}
              keyExtractor={(_, index) => `product-${index}`}
              data={dataSource}
              listFooterComponent={() => <Loading loading={loading} noMore={!hasMore} noMoreText="" />}
              onRefresh={refreshData}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.01}
            />
          </View>
        </TabsPane>
        <TabsPane current={active} index={1}>
          <View className={styles.padd}>
            <ScrollView
              style={{
                height: '100%',
              }}
              renderItem={(item: any) => renderItem(item.item)}
              keyExtractor={(_, index) => `product-${index}`}
              data={dataSourceUsed}
              listFooterComponent={() => <Loading loading={loadingUsed} noMore={!hasMoreUsed} noMoreText="" />}
              onRefresh={refreshDataUsed}
              onEndReached={handleLoadMoreUsed}
              onEndReachedThreshold={0.01}
            />
          </View>
        </TabsPane>
        <TabsPane current={active} index={2}>
          <View className={styles.padd}>
            <ScrollView
              style={{
                height: '100%',
              }}
              renderItem={(item: any) => renderItem(item.item)}
              keyExtractor={(_, index) => `product-${index}`}
              data={dataSourceExpired}
              listFooterComponent={() => <Loading loading={loadingExpired} noMore={!hasMoreExpired} noMoreText="" />}
              onRefresh={refreshDataExpired}
              onEndReached={handleLoadMoreExpired}
              onEndReachedThreshold={0.01}
            />
          </View>
        </TabsPane>
      </Tabs>
    </View>
  )
}
export default GlobalWrapper(observer(MyCollections))
