import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, ScrollView } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import Router from '@/utils/router'
import { useStores } from '@/store/useStores'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { useIntl } from '@linkseeks/i18n'
import Empty from '@/components/Empty'
import { checkMore } from '@/utils'
import GlobalHeader from '@/components/NavBar'
import { useSwitchListChange, TYPE_ARR } from '@/components/SwitchListButton'
import ProductList from '@/components/ProductList'
import { ProductItem } from '@/components/ProductList/Item'
import Loading from '@/components/Loading'
import {
  postProductMobileShopScoreGetCommodityList,
  PostProductMobileShopScoreGetCommodityListResponseDetail,
} from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const PAGE_SIZE = 8
interface ListParams {
  /**
   * 当前页
   */
  current?: number
  /**
   * 每页行数
   */
  pageSize?: number
  /**
   * 商品名称
   */
  name?: string
}
const IngralCommodityList = observer(() => {
  const [productList, setProductList] = useState<ProductItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [orderType, setOrderType] = useState<number | null>(null)
  const { categoryId, categoryName } = getCurrentInstance()?.router?.params || {}
  const { listType } = useSwitchListChange(TYPE_ARR[1], TYPE_ARR)
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const getProductList = (params?: ListParams, state?: boolean): Promise<any[]> => {
    const requestState = state || hasMore
    if (loading || !requestState) {
      return Promise.reject()
    }
    const nextPage = params?.current || page
    setLoading(true)
    return new Promise((resolve, reject) => {
      const finalParam: any = {
        current: nextPage,
        pageSize: PAGE_SIZE,
        customerCategoryId: categoryId,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
        priceTypeList: [3],
        ...params,
      }
      if (orderType) {
        finalParam.orderType = orderType
      }
      const headers: any = {
        type: 1,
        shopId: shopAndSite?.id,
      }
      finalParam.priceTypeList = [3]
      postProductMobileShopScoreGetCommodityList(finalParam, {
        headers,
      })
        .then((res) => {
          if (res.code === 1000) {
            setHasMore(checkMore(+nextPage, PAGE_SIZE, res.data.data.length, res.data.totalCount))
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
  const _normalizeList = (data: PostProductMobileShopScoreGetCommodityListResponseDetail[]): ProductItem[] => {
    const ret: ProductItem[] = []
    data.forEach((item) => {
      const atom: ProductItem = {
        id: item.id,
        name: item.name,
        describe: item.slogan,
        price: item.min,
        min: item.min,
        max: item.max,
        priceType: item.priceType,
        unit: item.unitName,
        salesVolume: item.sold,
        picture: item.mainPic,
        storeId: item.storeId,
        stockCount: (item as any).stockCount,
        minOrder: (item as any).minOrder,
        preferentialPrice: (item as any).preferentialPrice,
        saleTags: (item as any).tagList,
      }
      ret.push(atom)
    })
    return ret
  }
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setLoading(false)
    getProductList(
      {
        current: 1,
      },
      true,
    )
      .then((res) => {
        setProductList(_normalizeList(res))
      })
      .catch(() => {})
  }, [orderType])
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    setPage(page + 1)
    getProductList({
      current: page + 1,
    })
      .then((res) => {
        setProductList(productList.concat(_normalizeList(res)))
      })
      .catch(() => {})
  }
  const handleJumpDetail = (item: ProductItem) => {
    jmpProductDetail(PRICE_TYPE_ENUM.INTEGRAL, {
      commodityId: item.id,
    })
  }
  const handleJumpShop = (item: ProductItem) => {
    // 跳转店铺
    Router.navigateTo('shop/home', {
      id: item.storeId,
    })
  }
  const renderItem = ({ item }: { item: ProductItem }) => (
    <ProductList.Item
      data={item}
      type={listType}
      onClickItem={() => handleJumpDetail(item)}
      onClickSupplier={() => handleJumpShop(item)}
    />
  )
  const isLarger = listType === 'larger'
  const handleSort = (type: string) => {
    switch (type) {
      case 'integralSort':
        if (orderType === 3) {
          setOrderType(4)
        } else {
          setOrderType(3)
        }
        break
      case 'soldSort':
        if (orderType === 1) {
          setOrderType(null)
        } else {
          setOrderType(1)
        }
        break
      default:
        break
    }
  }
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'ingralCommodityList_navigationBarTitleText' }) })
  }, [])
  return (
    <View className={styles['container']}>
      <View
        id="topbar"
        style={{
          display: 'inline-block',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <GlobalHeader
          title={<Text>{decodeURIComponent(categoryName as string)}</Text>}
          customClassName={styles['header']}
        />
        <View className={styles['filter-box']}>
          <View className={styles['filter-actions']}>
            <View className={styles['filter-item']} onClick={() => handleSort('soldSort')}>
              <Text className={`${styles['filter-text']} ${orderType === 1 ? styles['filter-active'] : ''}`}>
                {intl.formatMessage({
                  id: 'ingralCommodityList_filter_1',
                })}
              </Text>
            </View>
            <View className={styles['filter-item']} onClick={() => handleSort('integralSort')}>
              <Text
                className={`${styles['filter-text']} ${
                  orderType === 4 || orderType === 3 ? styles['filter-active'] : ''
                }`}
              >
                {intl.formatMessage({
                  id: 'ingralCommodityList_filter_2',
                })}
              </Text>
              <View className={styles['filter-arrow-box']}>
                <Icons name="ArrowUpFill" size={10} color={orderType === 4 ? '#00A98F' : '#909399'} />
                <Icons name="ArrowDownFill" size={10} color={orderType === 3 ? '#00A98F' : '#909399'} />
              </View>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#F4F5F7',
          height: 0,
        }}
        contentContainerStyle={{
          padding: 8,
        }}
        numColumns={2}
        key={`${isLarger}`}
        data={productList}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        listEmptyComponent={
          <Empty
            description={intl.formatMessage({
              id: 'ingralCommodityList_empty',
            })}
          />
        }
        listFooterComponent={<Loading loading={loading} noMore={!hasMore} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={50}
      />
    </View>
  )
})
export default GlobalWrapper(IngralCommodityList)
