import GlobalWrapper from '@/components/GlobalWrapper'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Loading from '@/components/Loading'
import { useIntl } from '@linkseeks/i18n'
import { getMemberMobileInfoMinePage } from '@apps/apis'
import Empty from '@/components/Empty'
import Products from './components/Products'
import useFetchCollection from './useFetchCollections'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const MyCollections = () => {
  const [active] = useState('1')
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'card.myCardBag.navigationBarTitleText', defaultMessage: '卡包' }),
    // })
  }, [])
  const commodityService = getMemberMobileInfoMinePage
  const { loading, hasMore, dataSource, handleLoadMore } = useFetchCollection(commodityService, '1', active)
  const handleCommodityLoadMore = () => {
    handleLoadMore()
  }
  return (
    <View className={styles['page-card']}>
      <ScrollView
        className={styles['page-body']}
        scrollY
        refresherEnabled
        lowerThreshold={1}
        onScrollToLower={handleCommodityLoadMore}
      >
        {dataSource.length > 0 ? (
          dataSource?.map((item: any, index: number) => {
            return (
              <View className={styles['card-container']} key={`product-${index}`}>
                <View>
                  <Products dataSource={item} />
                </View>
              </View>
            )
          })
        ) : (
          <Empty />
        )}
        <Loading loading={loading} noMore={!hasMore} noMoreText="" />
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(observer(MyCollections))
