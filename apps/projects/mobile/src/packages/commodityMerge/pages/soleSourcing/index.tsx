import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-29 18:17:20
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-22 15:51:32
 * @Description: 企业商城-商品列表
 */
import React, { useState, useRef, useEffect } from 'react'
import { ScrollView } from '@tarojs/components'
import { View, Text, Icons } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { FilterSortBarValue } from '@/components/FilterSortBar'
import MallTabBottom from '@/components/MallTabBottom'
import { FILTER_BAR_TYPE, FILTER_PARAM } from '@/components/FilterSortBar/type'
import { checkMore } from '@/utils'
import { useIntl } from '@linkseeks/i18n'
import { postProductMobileShopEnterpriseGetCommodityList } from '@apps/apis'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import PageLayout from '@/components/PageLayout'
import ProductList from '@/components/ProductList'
import { ProductItem } from '@/components/ProductList/Item'
import Filter from '@/components/Filter'
import FilterDrawer from '@/components/FilterDrawer'
import Loading from '@/components/Loading'
import './index.scss'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
export type RouteParams = {
  /**
   * 店铺id
   */
  storeId?: string
  /**
   * 价格类型
   */
  priceType?: string
  /**
   * 商城类型
   */
  layoutType?: LAYOUT_TYPE
  /**
   * 品类id
   */
  categoryId?: string
  /**
   * 品类名称
   */
  categoryName?: string
  /**
   * 品牌id
   */
  brandId?: string
  /**
   * 品牌名称
   */
  brandName?: string
  /**
   * 品类id数组
   */
  categoryIdList?: string
  /**
   * 品牌id数组
   */
  brandIdList?: string
  /**
   * 只查询该id集合数据
   */
  idInList?: string
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
const PAGE_SIZE = 8
const SoleSourcingIndex: React.FC = () => {
  const [productList, setProductList] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sortParam, setSortParam] = useState({})
  const [filterParam, setFilterParam] = useState<FILTER_PARAM>()
  const multiple = true
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const intl = useIntl()
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const [visibleFilterDrawer, setVisibleFilterDrawer] = useState(false)
  const filterBarConfig = [FILTER_BAR_TYPE.soldSort, FILTER_BAR_TYPE.creditSort, FILTER_BAR_TYPE.priceSort]
  const $router = getCurrentInstance()
  const { hasTab } = $router.router?.params || {}

  const getProductList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      const payload: any = {
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        priceTypeList: [2],
        // 2-价格需要询价
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
        minOrder: item.minOrder,
        stockCount: item.stockCount,
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
    getProductList()
      .then((res) => {
        console.log(res, 'res')
        setProductList(_normalizeList(res))
      })
      .catch(() => {})
  }, [sortParam, filterParam])
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
  return (
    <MallTabBottom visible={hasTab === 'true'} activeUrl="commodityMerge/soleSourcing/index">
      <PageLayout
        className="page-layout-mall"
        renderHeader={
          <>
            <NavBar
              showBack={!hasTab}
              title={
                <Search
                  customClassName="stocksSourcing-search"
                  onSearch={(value) => handleSearch(value)}
                  shape="round"
                  clearable
                />
              }
              greedy
            />
            <Filter
              config={filterBarConfig}
              onChange={handleSortChange}
              extra={[
                <ProductList.SwitchButton key="1" />,
                <View key="2" onClick={() => handleVisibleFilterDrawer(true)}>
                  <Text className="filter-extra-item-name">
                    {intl.formatMessage({
                      id: 'search.shaixuan',
                    })}
                  </Text>
                  <Icons className="filter-extra-item-icon" name="Filter" size={16} />
                </View>,
              ]}
            />
          </>
        }
      >
        {(headerHeight) => (
          <View className="stocksSourcing-list">
            <ScrollView className="stocksSourcing-scrollView" onScrollToLower={handleLoadMore} scrollY>
              <ProductList dataSource={productList} />
              <Loading loading={loading} noMore={!hasMore} />
            </ScrollView>
            <FilterDrawer
              visible={visibleFilterDrawer}
              filterParam={filterParam}
              multiple={multiple}
              onClose={() => handleVisibleFilterDrawer(false)}
              offsetTop={headerHeight}
              onChange={handleFilterChange}
            />
          </View>
        )}
      </PageLayout>
    </MallTabBottom>
  )
}
export default GlobalWrapper(SoleSourcingIndex)
