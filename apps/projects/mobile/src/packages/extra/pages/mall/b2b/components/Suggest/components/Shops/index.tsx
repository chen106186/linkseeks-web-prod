import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { postCommodityWebStoreWebMemberShopInCommodityListAdorn } from '@apps/apis'
import ShopItem, { ShopItemProps } from '@/components/ShopItem'
import { useIntl } from '@linkseeks/i18n'
import { ItemType } from '../..'
import styles from './index.module.scss'

interface ShopsProps {
  id: string
  actived: boolean
  shopId: number | undefined
  tabInfo: ItemType
  onSwiperHeightChange?: (height: number) => void
}

const Shops: React.FC<ShopsProps> = (props) => {
  const { shopId, actived, tabInfo } = props
  const intl = useIntl()
  const [dataList, setDataList] = useState<ShopItemProps[]>([])
  const loadingRef = useRef<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const {
    locationStore: { currentCity },
  } = useStores()

  const getDataList = (): Promise<any[]> => {
    if (loadingRef.current) {
      return Promise.reject()
    }
    loadingRef.current = true
    return new Promise(async (resolve, reject) => {
      try {
        const storeInCommodityList: any = []
        tabInfo?.details?.forEach((detailsItem: any) => {
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
        try {
          const res = await postCommodityWebStoreWebMemberShopInCommodityListAdorn(param)
          if (res.code === 1000) {
            const shopResList: ShopItemProps[] = []
            const allShopList: any[] = res.data
            allShopList.forEach((item) => {
              shopResList.push({
                ...item,
                productList: item.commodityVOList,
                productIds: item.commodityVOList && item.commodityVOList.map((goodItem: any) => goodItem.id),
              })
            })
            resolve(shopResList)
            setHasMore(false)
          }
        } catch (error) {}
        loadingRef.current = false
      } catch (error) {
        reject()
        loadingRef.current = false
      }
    })
  }

  useEffect(() => {
    if (tabInfo && actived && hasMore) {
      getDataList()
        .then((res) => {
          setDataList(res)
        })
        .catch(() => {})
    }
  }, [tabInfo, actived])

  const _listFooter = () => (
    <Text className={styles['footer']}>
      {intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_1', defaultMessage: '已经到底啦～' })}
    </Text>
  )

  return (
    <View className={styles.shopList}>
      {dataList &&
        dataList.map((shopItem) => (
          <ShopItem
            key={shopItem.id}
            {...shopItem}
            contextShopId={shopId}
            contextProvinceCode={currentCity?.provinceCode}
            contextCityCode={currentCity?.cityCode}
          />
        ))}
      {_listFooter()}
    </View>
  )
}

export default Shops
