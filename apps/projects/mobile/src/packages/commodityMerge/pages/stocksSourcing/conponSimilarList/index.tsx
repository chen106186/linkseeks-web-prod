import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-30 14:55:13
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 15:56:51
 * @Description: 优惠券可用商品列表
 */
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { ScrollView } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { postMarketingMobileCouponGoodsList, PostMarketingMobileCouponGoodsListResponse } from '@apps/apis'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import PageLayout from '@/components/PageLayout'
import ProductList from '@/components/ProductList'
import { ProductItem } from '@/components/ProductList/Item'
import Loading from '@/components/Loading'
import './index.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { checkMore } from '@/utils'
type RouteParams = {
  /**
   * 优惠券id
   */
  couponId: string
  /**
   * 所属类型1-平台2-商家
   */
  belongType: string
}
interface ListParams {
  /**
   * 商品名称
   */
  name?: string
}
const ConponSimilarList: React.FC = () => {
  const router = useRouter<RouteParams>()
  const {
    params: { couponId, belongType },
  } = router
  const [name, setName] = useState('')
  const [productList, setProductList] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const PAGE_SIZE = 20
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const intl = useIntl()
  usePageInit()
  const _normalizeList = (data: PostMarketingMobileCouponGoodsListResponse): ProductItem[] => {
    const ret: ProductItem[] = []
    data.forEach((item) => {
      const atom: ProductItem = {
        id: item.productId,
        name: item.productName,
        describe: item.slogan,
        price: item.price || item.originalPrice,
        unit: item.unitName,
        salesVolume: item.sold,
        picture: item.mainPic,
        priceType: item.priceType,
        storeId: item.storeId,
        supplierInfo: {
          id: item.memberId,
          roleId: item.memberRoleId,
          name: item.storeName || item.memberName,
        },
        saleTags: item.tagList,
      }
      ret.push(atom)
    })
    return ret
  }
  const getProductList = (): Promise<ProductItem[]> => {
    if (loading) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      postMarketingMobileCouponGoodsList({
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        shopId: shopAndSite?.id!,
        couponId: +couponId,
        belongType: +belongType,
        productName: name,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
      })
        .then((res) => {
          if (res.code === 1000) {
            if (res.data && res.data.length === 0) {
              setHasMore(false)
            }
            resolve(_normalizeList(res.data))
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
    getProductList()
      .then((res) => {
        setProductList(res)
      })
      .catch(() => {})
  }, [])

  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getProductList()
      .then((res) => {
        setProductList(productList.concat(res))
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
        setProductList(res)
      })
      .catch(() => {})
  }
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            title={
              <Search
                customClassName="conpon-similar-search"
                value={name}
                onChange={(value) => setName(value)}
                onSearch={(value) => handleSearch(value)}
                shape="round"
                clearable
              />
            }
            greedy
          />
        </>
      }
    >
      <View className="conpon-similar-list">
        <ScrollView className="conpon-similar-scrollView" onScrollToLower={handleLoadMore} scrollY>
          <ProductList dataSource={productList} />
          <Loading
            loading={loading}
            noMore
            noMoreText={intl.formatMessage({
              id: 'commodityMerge.stocksSourcing.noMore',
              defaultMessage: '没有更多商品啦~',
            })}
          />
        </ScrollView>
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(ConponSimilarList)
