import React, { useEffect, useState } from 'react'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import ImageBox from '@/components/ImageBox'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import {
  getCommodityMobileStoreMobileNewAddStore,
  GetCommodityMobileStoreMobileNewAddStoreResponseDetail,
} from '@apps/apis'
import styles from './index.module.scss'

const NewShops = () => {
  const windowWidth = getSystemInfoSync().windowWidth
  const [shopList, setShopList] = useState<GetCommodityMobileStoreMobileNewAddStoreResponseDetail[]>([])
  const intl = useIntl()

  /**
   * 获取新入店铺列表
   */
  const fetchShopList = () => {
    const params: any = {
      current: 1,
      pageSize: 50,
    }
    getCommodityMobileStoreMobileNewAddStore(params).then((res) => {
      if (res.code === 1000) {
        setShopList(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchShopList()
  }, [])

  return shopList && shopList.length > 0 ? (
    <View className={styles['new-shops-container']}>
      <View className={styles['title-wrap']}>
        <Text className={styles['title']}>{intl.formatMessage({ id: 'findShop_newShops_title' })}</Text>
      </View>
      <ScrollView horizontal className={styles['shop-scroll-wrap']} style={{ width: pxTransform(windowWidth - 19) }}>
        <View className={styles['shop-list']}>
          {shopList &&
            shopList.map((shopItem) => (
              <View
                key={`shopItem${shopItem.id}`}
                className={styles['shop-item']}
                onClick={() => {
                  Router.navigateTo('shop/home', { id: shopItem.id })
                }}
              >
                <ImageBox width={40} height={40} source={shopItem.logo} />
                <View className={styles['shop-info']}>
                  <Text className={styles['shopname']}>{shopItem.memberName}</Text>
                  <View className={styles['address-wrap']}>
                    <Text className={styles['address-text']}>{shopItem.areas}</Text>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  ) : null
}

export default NewShops
