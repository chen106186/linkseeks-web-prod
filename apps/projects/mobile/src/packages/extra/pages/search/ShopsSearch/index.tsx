import React, { useState, useEffect, useRef } from 'react'
import { View, ScrollView } from '@apps/mobile-ui'
import Loading from '@/components/Loading'
import ShopItem from '@/components/ShopItem'
import { checkMore } from '@/utils'
import { FILTER_PARAM } from '@/components/FilterSortBar/type'
import { getCommodityMobileStoreMobileMemberShopList } from '@apps/apis'
import { CurrentCityType } from '@/store/locationStore/model'
import styles from './index.module.scss'

export type RouteParams = {
  /**
   * 店铺id
   */
  storeId?: string
  /**
   * 品类id
   */
  categoryId?: string
  /**
   * 品牌id
   */
  brandId?: string
}

interface ListParams {
  /**
   * 每页行数
   */
  pageSize?: number
  /**
   * 店铺名称
   */
  memberName?: string
}

interface ShopListListProps {
  sortParam: any
  filterParam: FILTER_PARAM | undefined
  keyword?: string
  showList: boolean
  currentCity: CurrentCityType | undefined
}

const ShopsSearch: React.FC<ShopListListProps> = (props) => {
  const { keyword, showList, sortParam, filterParam, currentCity } = props
  const PAGE_SIZE = 8
  const [shopList, setShopList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})

  const getShopList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }

    setLoading(true)
    return new Promise((resolve, reject) => {
      const payload: any = {
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        orderType: 2,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
        ...(searchValue.current || {}),
        ...sortParam,
        ...filterParam,
      }
      getCommodityMobileStoreMobileMemberShopList(payload)
        .then((res) => {
          if (res.code === 1000) {
            setHasMore(checkMore(pageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
            resolve(res.data.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  useEffect(() => {
    if (showList) {
      pageRef.current = 1
      searchValue.current = {
        memberName: keyword || '',
      }
      getShopList()
        .then((res) => {
          setShopList(res)
        })
        .catch(() => {})
    }
  }, [sortParam, filterParam, keyword, showList])

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getShopList()
      .then((res) => {
        setShopList(shopList.concat(res))
      })
      .catch(() => {})
  }

  return showList ? (
    <View className={styles['shop-list']}>
      <ScrollView
        data={shopList}
        contentContainerStyle={{ padding: '8px' }}
        className={styles['shop-list-scroll']}
        onScrollToLower={handleLoadMore}
        renderItem={({ item }) => <ShopItem key={`shopScrollItem${item.id}`} {...item} />}
        scrollY
      >
        <Loading loading={loading} noMore={!hasMore} />
      </ScrollView>
    </View>
  ) : null
}

export default ShopsSearch
