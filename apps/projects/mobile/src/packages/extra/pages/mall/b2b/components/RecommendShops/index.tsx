import React, { useState, useEffect, useRef } from 'react'
import { View, Text } from '@apps/mobile-ui'
import ShopItem from '@/components/ShopItem'
import { useIntl } from '@linkseeks/i18n'
import { CurrentCityType } from '@/store/locationStore/model'
import { postCommodityMobileStoreMobileMemberShopInCommodityList } from '@apps/apis'
import styles from './index.module.scss'

interface ShopListType {
  productIds: number[]
  productList: any
  id: number
  creditPoint: number
  logo: string
  memberName: string
  name: string
  registerYears: number
}

interface RecommendShopsProps {
  status?: boolean
  shopId: number | undefined
  details: ShopListType[]
  currentCity: CurrentCityType | undefined
  refreshing: boolean
}

const RecommendShops: React.FC<RecommendShopsProps> = (props) => {
  const { status, shopId, details, refreshing, currentCity } = props
  const [shopList, setShopList] = useState<ShopListType[]>([])
  const loadingRef = useRef<boolean>(false)
  const intl = useIntl()

  const _getRecommendShopData = async (shopDetails: any[]) => {
    const shopResList: any[] = []
    if (shopDetails && shopDetails.length > 0) {
      if (loadingRef.current) {
        return
      }
      const storeInCommodityList: any = []

      shopDetails.forEach((detailsItem) => {
        storeInCommodityList.push({
          storeId: detailsItem.id,
          commodityIdList: detailsItem.productIds,
        })
      })
      const param: any = {
        shopId,
        storeInCommodityList,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
      }
      loadingRef.current = true
      const res = await postCommodityMobileStoreMobileMemberShopInCommodityList(param, { showError: false })
      if (res.code === 1000) {
        const allShopList: any[] = res.data
        allShopList.forEach((item) => {
          shopResList.push({
            ...item,
            productList: item.commodityVOList,
          })
        })
        setShopList(shopResList)
      }
      loadingRef.current = false
    }
  }

  useEffect(() => {
    if (details) {
      _getRecommendShopData(details)
    }
  }, [currentCity])

  useEffect(() => {
    if (refreshing && details) {
      _getRecommendShopData(details)
    }
  }, [refreshing])

  return status ? (
    <View className={styles.container}>
      <View className={styles.recommentTitleWrapper}>
        <Text className={styles.recommentTitle}>
          {intl.formatMessage({ id: 'mall_recommend_shop', defaultMessage: '推荐店铺' })}
        </Text>
      </View>
      <View className={styles.shopList}>
        {shopList &&
          shopList.map((shopItem) => (
            <ShopItem
              key={shopItem.id}
              {...shopItem}
              contextShopId={shopId}
              contextProvinceCode={currentCity?.provinceCode}
              contextCityCode={currentCity?.cityCode}
            />
          ))}
      </View>
    </View>
  ) : null
}

RecommendShops.defaultProps = {
  status: true,
}

export default RecommendShops
