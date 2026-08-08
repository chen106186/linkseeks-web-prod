import React, { useEffect, useState } from 'react'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, ScrollView } from '@apps/mobile-ui'
import Router from '@/utils/router'
import ImageBox from '@/components/ImageBox'
import Rating from '@/components/Rating'
import { useIntl } from '@linkseeks/i18n'
import { CurrentCityType } from '@/store/locationStore/model'
import {
  GetCommodityMobileStoreMobilePopularStoreResponse,
  getCommodityMobileStoreMobilePopularStore,
} from '@apps/apis'
import styles from './index.module.scss'

interface PopularShopsProps {
  currentCity: CurrentCityType | undefined
}

const PopularShops = (props: PopularShopsProps) => {
  const { currentCity } = props
  const [shopList, setShopList] = useState<GetCommodityMobileStoreMobilePopularStoreResponse>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { windowWidth } = getSystemInfoSync()
  const intl = useIntl()

  /**
   * 获取人气店铺列表
   */
  const fetchShopList = () => {
    const params = {
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
    }
    getCommodityMobileStoreMobilePopularStore(params)
      .then((res) => {
        if (res.code === 1000 && res.data) {
          setShopList(res.data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchShopList()
  }, [])

  const skeletonList = [0, 1, 2]

  const renderSkeleton = ({ item }) => (
    <View key={`shopSkeletonItem${item}`} className={styles['shop-item']}>
      <ImageBox width={40} height={40} source="" />
    </View>
  )

  return shopList && shopList.length > 0 ? (
    <View className={styles['popular-shops-container']}>
      <View className={styles['title-wrap']}>
        <Text className={styles['title']}>{intl.formatMessage({ id: 'findShop_popularShops_title' })}</Text>
        <View
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          onClick={() => {
            Router.navigateTo('shop/popularShop')
          }}
        >
          <Text className={styles['more-link']}>{intl.formatMessage({ id: 'findShop_popularShops_more' })}</Text>
          <Icons name="ChevronRight" size={16} color="#91959B" />
        </View>
      </View>
      <ScrollView
        horizontal
        className={styles['shop-scroll-wrap']}
        style={{ width: pxTransform(windowWidth - 19) }}
        data={shopList}
        renderItem={({ item, index }) => (
          <View
            key={`shopItem${item.id}`}
            className={styles['shop-item']}
            onClick={() => {
              Router.navigateTo('shop/home', { id: item.id })
            }}
          >
            <ImageBox width={40} height={40} source={item.logo} />
            <View className={styles['shop-info']}>
              <Text className={styles['shopname']}>{item.name || item.memberName}</Text>
              <View className={styles['start-wrap']}>
                <Text className={styles['avg-trade-comment-star']}>{item.avgTradeCommentStar || 0}</Text>
                <View className={styles['start-wrap-container']}>
                  <Rating
                    style={{ display: 'flex' }}
                    size={14}
                    betweenSize={1}
                    count={5}
                    defaultValue={item.avgTradeCommentStar || 0}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  ) : null
}

export default PopularShops
