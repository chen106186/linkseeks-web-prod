import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View } from '@apps/mobile-ui'
import { ColumnCommodity } from '@/components/Commodity'
import { Iprops as LabelProps } from '@/components/Label'
import Loading from '@/components/Loading'
import useStores from '@/store/useStores'
import { observer } from 'mobx-react-lite'
import { getMarketingAdornGoodsListAdorn, getMarketingMobileActivityGoodsAreaAdorn } from '@apps/apis'
import { checkMore } from '@/utils'
import { ItemType } from '../..'
import styles from './index.module.scss'

interface ProductItemType {
  /** 商品名 */
  productName: string
  /** 商品图片 */
  productImg: string
  /** 原价 */
  originalPrice?: number
  /** 折扣价 */
  discount: number
  /** 商品id */
  productId: number
  tags?: LabelProps[] | string[]
  customItemClassName?: string
  /** 自定义 */
  renderFooter?: React.ReactNode
  /** 售出数 */
  sale?: number | string
}

interface ItemProps {
  id: string
  actived: boolean
  tabInfo: ItemType
  /**
   * 是否加载更多
   */
  loadMore: boolean
  /**
   * 是否刷新
   */
  refreshing: boolean
  onSwiperHeightChange?: (height: number) => void
  loadMoreFn: React.Dispatch<React.SetStateAction<boolean>>
}

const Commodity: React.FC<ItemProps> = (props) => {
  const { tabInfo, actived, loadMoreFn, loadMore } = props
  const [productList, setProductList] = useState<ProductItemType[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const loadingRef = useRef<boolean>(false)
  const pageRef = useRef<number>(1)
  const showCount = useRef<number | undefined>()
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()

  const getProductList = (): Promise<any[]> => {
    if (loadingRef.current) {
      return Promise.reject()
    }
    loadingRef.current = true
    return new Promise(async (resolve, reject) => {
      try {
        let pageSize = 20
        if (tabInfo?.manageWay === 3) {
          const selectIds = tabInfo?.details?.map((item) => item.id) || []
          if (selectIds && selectIds.length > 0) {
            const param: any = {
              idInList: selectIds.join(','),
              shopId: shopAndSite?.id,
              current: pageRef.current,
              pageSize,
              provinceCode: currentCity?.provinceCode,
              cityCode: currentCity?.cityCode,
            }
            const res = await getMarketingAdornGoodsListAdorn(param)
            if (res.code === 1000 && res.data.data) {
              resolve(
                res.data.data.map((item) => ({
                  productName: item.name,
                  productImg: item.mainPic,
                  discount: item.min,
                  productId: item.id,
                  priceType: item.priceType,
                  minOrder: item.minOrder,
                  stockCount: item.stockCount,
                  sellingPoint: item.sellingPoint,
                  tagList: item.tagList,
                  activityTypeList: item.activityTypeList,
                  min: item.min,
                  max: item.max,
                  groupPurchase: item.groupPurchase,
                  tags: tabInfo?.details?.find((listItem: any) => listItem.id === item.id)?.tags || [],
                })),
              )
              setHasMore(checkMore(pageRef.current, pageSize, (res.data.data || []).length, res.data.totalCount))
            }
          }
        } else {
          let paramPageSize = 20
          if (showCount.current) {
            if (showCount.current < pageSize) {
              paramPageSize = showCount.current
              showCount.current = 0
            } else {
              showCount.current = showCount.current - pageSize
            }
          }

          const param: any = {
            shopId: shopAndSite?.id,
            type: tabInfo?.manageWay || 1,
            current: pageRef.current,
            pageSize: paramPageSize,
            provinceCode: currentCity?.provinceCode,
            cityCode: currentCity?.cityCode,
          }

          const res = await getMarketingMobileActivityGoodsAreaAdorn(param)
          if (res.code === 1000 && res.data) {
            resolve(
              res.data.data.map((item) => ({
                productName: item.name,
                productImg: item.mainPic,
                discount: item.min,
                productId: item.id,
                dataType: 1,
                priceType: item.priceType,
                minOrder: item.minOrder,
                stockCount: item.stockCount,
                sellingPoint: item.sellingPoint,
                tagList: item.tagList,
                activityTypeList: item.activityTypeList,
                min: item.min,
                max: item.max,
                groupPurchase: item.groupPurchase,
                tags: tabInfo?.details?.find((listItem: any) => listItem.id === item.id)?.tags || [],
              })),
            )
            if (showCount.current === 0) {
              setHasMore(false)
            } else {
              setHasMore(checkMore(pageRef.current, pageSize, (res.data.data || []).length, res.data.totalCount))
            }
          }
        }
        loadingRef.current = false
      } catch (error) {
        reject()
        loadingRef.current = false
      }
    })
  }

  useEffect(() => {
    if (tabInfo && actived && hasMore) {
      pageRef.current = 1
      showCount.current = tabInfo?.num
      getProductList()
        .then((res) => {
          console.log(res, 'res123456')
          setProductList(res)
        })
        .catch(() => {})
    }
  }, [tabInfo, actived])

  useEffect(() => {
    const loadMoreData = () => {
      if (loadingRef.current || !hasMore) {
        loadMoreFn(false)
        return
      }
      pageRef.current += 1
      getProductList()
        .then((res) => {
          setProductList(productList.concat(res))
          loadMoreFn(false)
        })
        .catch(() => {})
    }

    if (loadMore && actived && hasMore) {
      loadMoreData()
    } else {
      loadMoreFn(false)
    }
  }, [loadMore, actived, hasMore])

  return useMemo(() => {
    return (
      <View className={styles['item-container']}>
        <ColumnCommodity dataSource={productList} />
        <Loading loading={loadMore} noMore={!hasMore} />
      </View>
    )
  }, [loadMore, productList])
}

export default observer(Commodity)
