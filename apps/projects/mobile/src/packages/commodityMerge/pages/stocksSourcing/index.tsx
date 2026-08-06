import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-29 18:17:20
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 16:14:52
 * @Description: 企业商城-商品列表
 */
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { ScrollView } from '@tarojs/components'
import { View, Text, Icons } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { FilterSortBarValue } from '@/components/FilterSortBar'
import MallTabBottom from '@/components/MallTabBottom'
import { FILTER_BAR_TYPE, FILTER_PARAM, FILTER_PARAM_KEY } from '@/components/FilterSortBar/type'
import { checkMore } from '@/utils'
import {
  postProductMobileShopEnterpriseGetCommodityList,
  postProductMobileShopSelfGetCommodityList,
  postProductMobileShopStoreGetCommodityList,
} from '@apps/apis'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import useShopLayout from '@/hooks/useShopLayout'
import PageLayout from '@/components/PageLayout'
import ProductList from '@/components/ProductList'
import { ProductItem } from '@/components/ProductList/Item'
import Filter from '@/components/Filter'
import FilterDrawer from '@/components/FilterDrawer'
import Loading from '@/components/Loading'
import './index.scss'
import { usePageInit } from '@/hooks/usePageInit'
export type RouteParams = {
  /**
   * 店铺id
   */
  id?: string
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
  /**
   * 店铺商品列表才需要
   * 运费方式: 1-卖家承担运费（默认）,2-买家承担运费
   */
  carriageType?: string
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
interface StocksSourcingIndexProps {}
const StocksSourcingIndex: React.FC<StocksSourcingIndexProps> = () => {
  const router = useRouter<RouteParams>()
  const {
    params: { idInList, id, layoutType, carriageType },
  } = router
  const [productList, setProductList] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sortParam, setSortParam] = useState({})
  const [filterParam, setFilterParam] = useState<FILTER_PARAM>()
  const loadState = useRef<boolean>(true)
  const multiple = true
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const $router = getCurrentInstance()
  const { hasTab } = $router.router?.params || {}
  const intl = useIntl()
  const ParamFiltterList = [
    FILTER_PARAM_KEY.brandId,
    FILTER_PARAM_KEY.brandIdList,
    FILTER_PARAM_KEY.categoryId,
    FILTER_PARAM_KEY.categoryIdList,
    FILTER_PARAM_KEY.priceTypeList,
  ]
  usePageInit()
  /**
   * 获取当前商城类型
   */
  const shopLayout = useShopLayout(id !== undefined)
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const [visibleFilterDrawer, setVisibleFilterDrawer] = useState(false)
  const filterBarConfig = [FILTER_BAR_TYPE.soldSort, FILTER_BAR_TYPE.priceSort, FILTER_BAR_TYPE.publishTime]
  if (shopLayout === LAYOUT_TYPE.spot) {
    filterBarConfig.push(FILTER_BAR_TYPE.creditSort)
  }
  const API_MAP = {
    // 找现货商品列表
    [LAYOUT_TYPE.spot]: postProductMobileShopEnterpriseGetCommodityList,
    // C端商品列表
    [LAYOUT_TYPE.client]: postProductMobileShopEnterpriseGetCommodityList,
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
      if (idInList && typeof idInList === 'string') {
        payload.idInList = idInList.split(',')
      }
      if (!filterParam?.priceTypeList) {
        payload.priceTypeList = [1] // 1-现货价格
      }
      if (shopLayout === LAYOUT_TYPE.own) {
        payload.memberId = shopAndSite?.memberId
      }
      if (shopLayout === LAYOUT_TYPE.shop) {
        payload.storeId = +id!
        payload.carriageType = +carriageType!
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
            switch (shopLayout) {
              case LAYOUT_TYPE.spot:
              case LAYOUT_TYPE.client:
              case LAYOUT_TYPE.mall:
                if (multiple) {
                  tempParam[FILTER_PARAM_KEY.categoryIdList] = [paramsItem]
                } else {
                  tempParam[FILTER_PARAM_KEY.categoryId] = paramsItem
                }
                break
              default:
                if (multiple) {
                  tempParam[FILTER_PARAM_KEY.customerCategoryIdList] = [paramsItem]
                } else {
                  tempParam[FILTER_PARAM_KEY.customerCategoryId] = paramsItem
                }
                break
            }
            break
          case FILTER_PARAM_KEY.priceTypeList:
            tempParam[FILTER_PARAM_KEY.priceTypeList] = [paramsItem]
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
        activityTypeList: item.activityTypeList,
        minOrder: item.minOrder,
        stockCount: item.stockCount,
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
  const checkInitLoad = () => {
    let load = true
    if (
      loadState.current &&
      router.params &&
      Object.keys(router.params).some((key: FILTER_PARAM_KEY) => ParamFiltterList.includes(key))
    ) {
      if (loadState.current) {
        loadState.current = false
        load = false
      }
    }
    if (load) {
      pageRef.current = 1
      getProductList()
        .then((res) => {
          setProductList(_normalizeList(res))
        })
        .catch(() => {})
    }
  }
  useEffect(() => {
    checkInitLoad()
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
    } else if (values.publishTime) {
      param.orderType = 5
    }
    setSortParam(param)
  }
  const handleFilterChange = (values: any) => {
    console.log(values, 'values')
    setFilterParam(values)
  }
  return (
    <MallTabBottom visible={hasTab === 'true'} layoutType={layoutType} activeUrl="commodityMerge/stocksSourcing/index">
      <PageLayout
        className={hasTab === 'true' ? 'page-layout-mall' : ''}
        renderHeader={
          <>
            <NavBar
              showBack={!hasTab}
              title={
                <Search
                  customClassName="stocksSourcing-search"
                  placeholder={intl.formatMessage({
                    id: 'search.qingshurushangpinmingcheng',
                    defaultMessage: '请输入商品名称',
                  })}
                  onSearch={(value) => handleSearch(value)}
                  shape="round"
                  clearable
                />
              }
              greedy
            />
            <Filter
              customClassName="stocksSourcing-filter"
              config={filterBarConfig}
              onChange={handleSortChange}
              extra={[
                <ProductList.SwitchButton key="1" />,
                <View key="2" onClick={() => handleVisibleFilterDrawer(true)}>
                  <Text className="filter-extra-item-name">
                    {intl.formatMessage({
                      id: 'search.shaixuan',
                      defaultMessage: '筛选',
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
              storeId={id}
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
export default GlobalWrapper(StocksSourcingIndex)
