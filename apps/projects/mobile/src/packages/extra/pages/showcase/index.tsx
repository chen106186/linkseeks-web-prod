import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getSystemInfoSync, createAnimation, pxTransform } from '@apps/mobile-services/utils/taro'
import useStores from '@/store/useStores'
import NavBar from '@/components/NavBar'
import ImageBox from '@/components/ImageBox'
import ProductList from '@/components/ProductList'
import Empty from '@/components/Empty'
import ShopItem from '@/components/ShopItem'
import Loading from '@/components/Loading'
import { checkMore } from '@/utils'
import { View, Icons, Text, ScrollView } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { getOssUrlPath } from '@apps/constants'
import { getMarketingAdornGoodsListAdorn } from '@apps/apis'
import {
  postProductCommodityTemplateSearchCommodityList,
  postProductMobileShopEnterpriseGetCategoryBrand,
} from '@apps/apis'
import { postCommodityMobileStoreMobileMemberShopInCommodityList } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { shareAppMessage, shareTimeline } from '@/utils/share'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { qs } from '@linkseeks/tools'
import { observer } from 'mobx-react-lite'
import { normalizeShowcaseProductList } from './utils'
interface BrandItem {
  id: number
  logoUrl: string
  name: string
}
type StoreInCommodityItem = {
  storeId: number
  commodityIdList?: number[]
}
interface PreloadDataType {
  /**
   * 名称
   */
  name: string
  /**
   * 类型：1-商品 2-活动 3-积分 4-店铺 6-品牌
   */
  type: number
  /**
   * 橱窗广告
   */
  banner: string
  /**
   * 内页广告
   */
  inner: string
  /**
   * 推荐 ,Long
   */
  id: string

  storeInCommodityList?: string | StoreInCommodityItem[]

  isShare?: string
}

const parseStoreInCommodityList = (storeInCommodityList?: string | StoreInCommodityItem[]) => {
  if (Array.isArray(storeInCommodityList)) return storeInCommodityList
  if (!storeInCommodityList) return undefined

  const parse = (value: string) => {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : undefined
  }

  let currentValue = storeInCommodityList

  for (let index = 0; index < 3; index += 1) {
    try {
      return parse(currentValue)
    } catch {
      try {
        currentValue = decodeURIComponent(currentValue)
      } catch {
        return undefined
      }
    }
  }

  return undefined
}

const decodeURIComponentConversion = ({
  name,
  type,
  inner,
  id,
  banner,
  storeInCommodityList,
  isShare,
}: PreloadDataType) => ({
  name: decodeURIComponent(name),
  type: Number(type),
  inner: decodeURIComponent(inner),
  banner: decodeURIComponent(banner),
  id: decodeURIComponent(id)?.split(',') || [],
  storeInCommodityList: parseStoreInCommodityList(storeInCommodityList),
  isShare: isShare,
})
const ShowCase: React.FC = () => {
  // const { type, name, inner, id, details } = getCurrentInstance().preloadData || ({} as PreloadDataType)
  const preloadData = useRouter()?.params
  console.log('showcase preloadData', JSON.stringify(preloadData))
  const { type, name, inner, id, storeInCommodityList, isShare } = decodeURIComponentConversion(preloadData as any)
  console.log('showcase parsed params', {
    shopId: preloadData?.shopId,
    type,
    id,
    storeInCommodityList,
    isShare,
  })
  const [animationData, setAnimationData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef<number>(1)
  const PAGE_SIZE = 8
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  usePageInit()
  const WINDOW_HEIGHT = getSystemInfoSync().windowHeight
  const MAX_UNRESERVED_HEIGHT = 200 // opacity 变化到 1 的最大滚动距离

  const getDefaultInner = useMemo(() => {
    switch (type) {
      case 1:
        return getOssUrlPath('/Images/showcase_commodity.png')
      case 3:
        return getOssUrlPath('/Images/showcase_integral.png')
      case 4:
        return getOssUrlPath('/Images/showcase_shop.png')
      case 6:
        return getOssUrlPath('/Images/showcase_brand.png')
      default:
        return getOssUrlPath('/Images/showcase_commodity.png')
    }
  }, [type])
  const needShopId = type === 1 || type === 3 || type === 4
  const currentShopId = Number(preloadData?.shopId) || shopAndSite?.id
  const handleScroll = (evt: any) => {
    const offsetY = evt.detail.scrollTop
    const animation = createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0,
    })
    animation.opacity(offsetY <= MAX_UNRESERVED_HEIGHT ? offsetY / MAX_UNRESERVED_HEIGHT : 1).step()
    setAnimationData(animation.export())
  }
  const fetchDataList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }
    if (needShopId && !currentShopId) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      const param: any = {
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        provinceCode: currentCity?.provinceCode,
        cityCode: currentCity?.cityCode,
      }
      let fetchDataListFn: any
      switch (type) {
        case 1:
          if (id && id.length > 0) {
            param.idInList = id.join(',')
            param.shopId = currentShopId
            fetchDataListFn = getMarketingAdornGoodsListAdorn
          }
          break
        case 3:
          param.idInList = id || []
          param.priceTypeList = [3]
          param.shopId = currentShopId
          fetchDataListFn = postProductCommodityTemplateSearchCommodityList
          break
        case 4:
          param.shopId = currentShopId
          // param.storeInCommodityList = id.map((paramsItem: any) => ({
          //   storeId: paramsItem?.shopId,
          //   commodityIdList: paramsItem?.id,
          // }))
          if (storeInCommodityList && storeInCommodityList.length > 0) {
            param.storeInCommodityList = storeInCommodityList
          }
          fetchDataListFn = postCommodityMobileStoreMobileMemberShopInCommodityList
          break
        case 6:
          param.idList = id || []
          fetchDataListFn = postProductMobileShopEnterpriseGetCategoryBrand
          break
        default:
          break
      }
      if (fetchDataListFn) {
        fetchDataListFn(param)
          .then((res) => {
            if (res.code === 1000) {
              let totalCount = 0
              let data: any[] = []
              if (type === 4) {
                data = res.data.map((item) => ({
                  ...item,
                  productList: item.commodityVOList,
                }))
                totalCount = res.data.length
              } else if (type === 4 || type === 6) {
                data = res.data
                totalCount = res.data.length
              } else if (type === 1 || type === 3) {
                data = normalizeShowcaseProductList(res.data.data, shopAndSite?.isSelf)
                totalCount = res.data.totalCount
              } else {
                data = res.data.data
                totalCount = res.data.totalCount
              }
              setHasMore(checkMore(pageRef.current, PAGE_SIZE, (data || []).length, totalCount))
              resolve(data)
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
      }
    })
  }
  useEffect(() => {
    if (needShopId && !currentShopId) {
      return
    }
    pageRef.current = 1
    fetchDataList()
      .then((res) => {
        setDataList(res)
      })
      .catch(() => {})
  }, [needShopId, currentShopId])
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    fetchDataList()
      .then((res) => {
        setDataList(dataList.concat(res))
      })
      .catch(() => {})
  }
  const handleBrandFilter = (info: BrandItem) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', {
      brandId: info.id,
    })
  }
  const renderListByType = () => {
    if (!dataList || dataList.length === 0) return !loading ? <Empty /> : null
    switch (type) {
      case 1:
        return <ProductList dataSource={dataList} />
      case 3:
        return <ProductList type="larger" dataSource={dataList} />
      case 4:
        return (
          <View className={styles['showcase-shop-list']}>
            {dataList &&
              dataList.map((dataItem) => (
                <ShopItem
                  {...dataItem}
                  contextShopId={currentShopId}
                  contextProvinceCode={currentCity?.provinceCode}
                  contextCityCode={currentCity?.cityCode}
                />
              ))}
          </View>
        )
      case 6:
        return (
          <View className={styles['showcase-brand-list']}>
            {dataList.map((item) => (
              <View className={styles['showcase-brand-list-item']} key={item.id}>
                <View className={styles['showcase-brand-list-item-header']}>
                  <View className={styles['showcase-brand-list-item-header-logo']}>
                    <ImageBox width={40} height={40} source={item.imageUrl} />
                  </View>
                  <View className={styles['shopInfo']}>
                    <View className={styles['shopNameWrapper']}>
                      <Text className={styles['shopName']}>{item.name}</Text>
                    </View>
                  </View>
                </View>
                <View className={styles['brand-list']}>
                  {item.brandResponseList &&
                    item.brandResponseList.map((brandItem: any) => (
                      <View
                        className={styles['brand-list-item']}
                        key={`brandItem${brandItem.id}`}
                        onClick={() => handleBrandFilter(brandItem)}
                      >
                        <View className={styles['brand-list-item-body']}>
                          <ImageBox width={80} height={32} source={brandItem.logoUrl} />
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            ))}
          </View>
        )
      default:
        return !loading ? <Empty /> : null
    }
  }

  const handleBack = () => {
    if (isShare) {
      Router.reLaunch('extra/mall/b2b')
    } else {
      Router.navigateBack()
    }
  }
  const sharePath = `packages/extra/pages/showcase/index?${qs.stringify({
    shopId: currentShopId,
    id: Array.isArray(id) ? id.join(',') : preloadData?.id,
    name,
    inner,
    banner: preloadData?.banner ? decodeURIComponent(preloadData.banner) : undefined,
    type,
    storeInCommodityList: storeInCommodityList ? JSON.stringify(storeInCommodityList) : undefined,
    isShare: 1,
  })}`
  console.log('showcase sharePath', sharePath)

  // 分享给好友
  useShareAppMessage((res) => shareAppMessage(res, name, sharePath, inner || getDefaultInner))
  // 分享到朋友圈
  useShareTimeline(() => shareTimeline(name, sharePath, inner || getDefaultInner))

  return (
    <View className={styles['showcase']}>
      <View className={styles['showcase-header-nav-bar']}>
        <NavBar
          customClassName={styles['showcase-header-nav']}
          title=""
          customRenderLeft={<Icons name="ArrowLeft" size={24} color="#5A2A12" />}
        />
        <View animation={animationData} className={styles['showcase-header-nav-wrap__fix']}>
          <NavBar title={name} titleColor="#5A2A12" backIconColor="#5A2A12" back={handleBack} />
        </View>
      </View>
      <ScrollView
        className={styles['showcase-header-scroll']}
        style={{
          height: pxTransform(WINDOW_HEIGHT),
        }}
        listHeaderComponent={() => (
          <ImageBox width="100%" height={200} borderRadius={0} source={inner || getDefaultInner} />
        )}
        scrollY
        onScrollToLower={handleLoadMore}
        onScroll={handleScroll}
      >
        {renderListByType()}
        <Loading loading={loading} noMore={!hasMore} />
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(observer(ShowCase))
