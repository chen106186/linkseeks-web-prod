import React, { useState, useEffect, useRef } from 'react'
import { View, ScrollView } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import ProductList from '@/components/ProductList'
import { ProductItem } from '@/components/ProductList/Item'
import Loading from '@/components/Loading'
import { checkMore } from '@/utils'
import { FILTER_PARAM } from '@/components/FilterSortBar/type'
import useStores from '@/store/useStores'
import { postProductMobileShopEnterpriseGetCommodityList } from '@apps/apis'
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
   * 商品名称
   */
  name?: string
}

interface CommodityListProps {
  sortParam: any
  filterParam: FILTER_PARAM | undefined
  keyword?: string
  showList: boolean
}

const CommodityList: React.FC<CommodityListProps> = (props) => {
  const { showList, keyword, sortParam, filterParam } = props
  const PAGE_SIZE = 8
  const [productList, setProductList] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})

  const getProductList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }

    setLoading(true)
    return new Promise((resolve, reject) => {
      const payload: any = {
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
        ...(searchValue.current || {}),
        ...sortParam,
        ...filterParam,
      }

      postProductMobileShopEnterpriseGetCommodityList(payload)
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

  const _normalizeList = (data: any[]): ProductItem[] => {
    const ret: ProductItem[] = []
    data.forEach((item) => {
      const atom: ProductItem = {
        id: item.id,
        name: item.name,
        describe: item.slogan,
        price: item.min,
        unit: item.unitName,
        salesVolume: item.sold,
        picture: item.mainPic,
        storeId: item.storeId,
        preferentialPrice: item.preferentialPrice,
        saleTags: item.tagList,
        priceType: item.priceType,
        activityTypeList: item.activityTypeList,
        stockCount: item.stockCount,
        minOrder: item.minOrder,
        min: item.min,
        max: item.max,
        groupPurchase: item.groupPurchase,
      }
      if (!shopAndSite?.isSelf) {
        atom.supplierInfo = {
          id: item.memberId,
          roleId: item.memberRoleId,
          name: item.storeName || item.memberName,
        }
      }
      ret.push(atom)
    })
    return ret
  }

  useEffect(() => {
    if (showList) {
      pageRef.current = 1
      searchValue.current = {
        name: keyword || '',
      }
      getProductList()
        .then((res) => {
          setProductList(_normalizeList(res))
        })
        .catch(() => {})
    }
  }, [sortParam, filterParam, keyword, showList])

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getProductList()
      .then((res) => {
        setProductList(productList.concat(_normalizeList(res)))
      })
      .catch(() => {})
  }

  return showList ? (
    <View className={styles['swiper-item-search-container']}>
      <View className={styles['stocksSourcing-list']}>
        <ScrollView className={styles['stocksSourcing-scrollView']} onScrollToLower={handleLoadMore} scrollY>
          <ProductList dataSource={productList} />
          <Loading loading={loading} noMore={!hasMore} />
        </ScrollView>
      </View>
    </View>
  ) : null
}

export default observer(CommodityList)
