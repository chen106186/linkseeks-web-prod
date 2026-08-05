import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, Icons } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import PageLayout from '@/components/PageLayout'
import ProductList from '@/components/ProductList'
import { ProductItem } from '@/components/ProductList/Item'
import Filter from '@/components/Filter'
import FilterDrawer from '@/components/FilterDrawer'
import Loading from '@/components/Loading'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { checkMore } from '@/utils'
import { FilterSortBarValue } from '@/components/FilterSortBar'
import { IS_WEB } from '@/constants'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import { FILTER_BAR_TYPE, FILTER_PARAM, FILTER_PARAM_KEY } from '@/components/FilterSortBar/type'
import useShopLayout from '@/hooks/useShopLayout'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import {
  postProductMobileShopEnterpriseGetCommodityList,
  postProductMobileShopSelfGetCommodityList,
  postProductMobileShopStoreGetCommodityList,
} from '@apps/apis'
import SearchHistory from './SearchHistory'
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
const CommodityList: React.FC = () => {
  const intl = useIntl()
  const router = useRouter<RouteParams>()
  const {
    params: { storeId },
  } = router
  const PAGE_SIZE = 8
  const [name, setName] = useState('')
  const [productList, setProductList] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sortParam, setSortParam] = useState({})
  const [filterParam, setFilterParam] = useState<FILTER_PARAM>()
  const [showList, setShowList] = useState<boolean>(false)
  const multiple = true
  const {
    userStore: { shopAndSite },
    searchStore: { changeSearchKeyword },
    locationStore: { currentCity },
  } = useStores()

  /**
   * 获取当前商城类型
   */
  const shopLayout = useShopLayout(storeId !== undefined)
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const [visibleFilterDrawer, setVisibleFilterDrawer] = useState(false)
  const filterBarConfig = [FILTER_BAR_TYPE.soldSort, FILTER_BAR_TYPE.priceSort]
  if (shopLayout === LAYOUT_TYPE.spot) {
    filterBarConfig.push(FILTER_BAR_TYPE.creditSort)
  }
  const API_MAP = {
    // 找现货商品列表
    [LAYOUT_TYPE.spot]: postProductMobileShopEnterpriseGetCommodityList,
    // 店铺商品列表
    [LAYOUT_TYPE.shop]: postProductMobileShopStoreGetCommodityList,
    // 自营商城商品列表
    [LAYOUT_TYPE.own]: postProductMobileShopSelfGetCommodityList,
  }
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
      if (shopLayout === LAYOUT_TYPE.spot) {
        payload.priceTypeList = [1] // 1-现货价格
      }
      if (shopLayout === LAYOUT_TYPE.own) {
        payload.memberId = shopAndSite?.memberId
      }
      if (shopLayout === LAYOUT_TYPE.shop) {
        payload.storeId = storeId
      }
      API_MAP[shopLayout](payload)
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
    if (router.params) {
      const tempParam = {}
      Object.keys(router.params).forEach((key: FILTER_PARAM_KEY) => {
        const paramsItem = String(router.params[key])
        switch (key) {
          case FILTER_PARAM_KEY.brandId:
            if (multiple) {
              tempParam[FILTER_PARAM_KEY.brandIdList] = [paramsItem]
            } else {
              tempParam[FILTER_PARAM_KEY.brandId] = paramsItem
            }
            break
          case FILTER_PARAM_KEY.categoryId:
            if (multiple) {
              if (shopLayout !== LAYOUT_TYPE.spot) {
                tempParam[FILTER_PARAM_KEY.customerCategoryIdList] = [paramsItem]
              } else {
                tempParam[FILTER_PARAM_KEY.categoryIdList] = [paramsItem]
              }
            } else {
              if (shopLayout !== LAYOUT_TYPE.spot) {
                tempParam[FILTER_PARAM_KEY.customerCategoryId] = paramsItem
              } else {
                tempParam[FILTER_PARAM_KEY.categoryId] = paramsItem
              }
            }
            break
          default:
            break
        }
      })
      if (tempParam && Object.keys(tempParam).length > 0) {
        setFilterParam(tempParam as FILTER_PARAM)
      }
    }
  }, [])
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
        min: item.min,
        max: item.max,
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
    // if (showList) {
    pageRef.current = 1
    getProductList()
      .then((res) => {
        setProductList(_normalizeList(res))
      })
      .catch(() => {})
    // }
  }, [sortParam, filterParam, showList])
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
  const handleSearch = (keyword: string) => {
    if (loading) {
      return
    }
    pageRef.current = 1
    searchValue.current = {
      name: keyword,
    }
    setProductList([])
    if (keyword) {
      setName(keyword)
      changeSearchKeyword(keyword, shopLayout)
      setShowList(true)
    } else {
      setShowList(false)
    }
    getProductList()
      .then((res) => {
        setProductList(_normalizeList(res))
      })
      .catch(() => {})
  }
  const handleVisibleFilterDrawer = (flag?: boolean) => {
    setVisibleFilterDrawer(!!flag)
  }
  const handleSortChange = (values: FilterSortBarValue) => {
    const param: any = {}
    // 排序方式：1-销量从高到低,2-信用从高到低,3-价格从高到低,4-价格从低到高
    if (values.soldSort) {
      param.orderType = 1
    } else if (values.creditSort) {
      param.orderType = 2
    } else if (values.priceSort) {
      if (values.priceSort === 'ASC') {
        param.orderType = 4
      } else if (values.priceSort === 'DESC') {
        param.orderType = 3
      }
    }
    setSortParam(param)
  }
  const handleFilterChange = (values: any) => {
    setFilterParam(values)
  }
  console.log(showList, 'showList')
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            title={
              <Search
                customClassName={styles['stocksSourcing-search']}
                defaultValue={name}
                onSearch={handleSearch}
                shape="round"
                clearable
              />
            }
            greedy
            showExtra={!IS_WEB}
          />
          {showList && (
            <Filter
              config={filterBarConfig}
              onChange={handleSortChange}
              extra={[
                <ProductList.SwitchButton key="1" />,
                <View key="2" onClick={() => handleVisibleFilterDrawer(true)}>
                  <Text className={styles['filter-extra-item-name']}>
                    {intl.formatMessage({
                      id: 'search.shaixuan',
                      defaultMessage: '筛选',
                    })}
                  </Text>
                  <Icons className={styles['filter-extra-item-icon']} name="Filter" size={16} />
                </View>,
              ]}
            />
          )}
        </>
      }
    >
      {(headerHeight) => (
        <>
          {!showList ? (
            <ScrollView className={styles['scrollView']}>
              <SearchHistory type={shopLayout} onSelect={handleSearch} />
            </ScrollView>
          ) : (
            <View className={styles['stocksSourcing-list']}>
              <ScrollView className={styles['stocksSourcing-scrollView']} onScrollToLower={handleLoadMore} scrollY>
                <ProductList dataSource={productList} />
                <Loading loading={loading} noMore={!hasMore} />
              </ScrollView>
              <FilterDrawer
                visible={visibleFilterDrawer}
                filterParam={filterParam}
                storeId={storeId}
                multiple={multiple}
                onClose={() => handleVisibleFilterDrawer(false)}
                offsetTop={headerHeight}
                onChange={handleFilterChange}
              />
            </View>
          )}
        </>
      )}
    </PageLayout>
  )
}
export default GlobalWrapper(observer(CommodityList))
