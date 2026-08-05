import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { View, Button, Text, Radio, ScrollView, Toast } from '@apps/mobile-ui'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import { checkMore } from '@/utils'
import Loading from '@/components/Loading'
import ImageBox from '@/components/ImageBox'
import { getCurrentInstance, preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import {
  getProductCommodityCommonGetPageCommoditySku,
  GetProductCommodityCommonGetPageCommoditySkuResponseDetail,
  getProductCommodityGetPublishedShop,
} from '@apps/apis'
import styles from './index.module.scss'
import useStores from '@/store/useStores'
import { useMobileIntl } from '@apps/locales'
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
const SkuList = () => {
  const [keyword, setKeyword] = useState<string>()
  const [productList, setProductList] = useState<GetProductCommodityCommonGetPageCommoditySkuResponseDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectSku, setSelectSku] = useState<GetProductCommodityCommonGetPageCommoditySkuResponseDetail>()
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const PAGE_SIZE = 8
  const params = getCurrentInstance().preloadData as {
    preloadDate: any
    onSelect: (selectInfo: { commodityId: number; name: string; skuId: number; shopList: any[] }) => void
  }
  const { onSelect, preloadDate } = params || {}
  const {
    userStore: { userInfo },
  } = useStores()
  const translate = useMobileIntl()
  const handleSearch = (keyword: string) => {
    if (keyword) {
      setKeyword(keyword)
    } else {
      setKeyword('')
    }
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
        priceTypeList: '1',
        statusList: '5',
        ...(searchValue.current || {}),
      }
      getProductCommodityCommonGetPageCommoditySku(payload)
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
    pageRef.current = 1
    searchValue.current = {
      name: keyword || '',
    }
    getProductList()
      .then((res) => {
        setProductList(res)
      })
      .catch(() => {})
  }, [keyword])
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
  const fetchPublishedShopById = (id: number): Promise<any[]> => {
    return new Promise((resolve) => {
      getProductCommodityGetPublishedShop({
        id: String(id),
      })
        .then((res) => {
          if (res.code === 1000 && res.data && res.data.length > 0) {
            resolve(res.data)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }
  const handleConfirm = async () => {
    if (selectSku) {
      const shopList = await fetchPublishedShopById(selectSku.commodityId)
      onSelect?.({
        commodityId: selectSku.commodityId,
        skuId: selectSku.id,
        name: selectSku.name,
        shopList,
      })
      preload({
        ...preloadDate,
      })
      Router.navigateBack()
    } else {
      Toast.show({
        title: translate('mobile.resource.askPurchase.qingxuanzeshangpin'),
        icon: 'none',
      })
    }
  }
  return (
    <View>
      <PageLayout
        style={{
          height: '100vh',
        }}
        renderHeader={
          <>
            <NavBar
              title={
                <Search
                  placeholder={translate('mobile.resource.askPurchase.skushangpin')}
                  onSearch={handleSearch}
                  onClear={(val) => setKeyword(val)}
                  innerBackground="#F7F8FA"
                  customClassName={styles['page-wrap-search-key']}
                  shape="round"
                  clearable
                />
              }
              greedy
            />
          </>
        }
      >
        {() => (
          <View className={styles['sku-list']}>
            <ScrollView className={styles['sku-list-scrollView']} onScrollToLower={handleLoadMore} scrollY>
              <Radio.Group value={selectSku?.id} className={styles['sku-list-radio-group']}>
                {productList &&
                  productList.length > 0 &&
                  productList.map((productItem) => (
                    <View
                      className={styles['sku-list-item']}
                      key={productItem.id}
                      onClick={() => {
                        setSelectSku(productItem)
                      }}
                    >
                      <View className={styles['sku-list-item-left']}>
                        <ImageBox source={productItem.mainPic} width={58} height={58} borderRadius={4} />
                      </View>
                      <View className={styles['sku-list-item-right']}>
                        <Text className={styles['sku-list-item-name']}>{productItem.name}</Text>
                        <Text className={styles['sku-list-item-id']}>ID:{productItem.id}</Text>
                      </View>
                      <Radio size={20} value={productItem.id} />
                    </View>
                  ))}
              </Radio.Group>
              <Loading loading={loading} noMore={!hasMore} />
            </ScrollView>
            <View className={styles['button-wrap']} onClick={handleConfirm}>
              <Button type="primary">{translate('mobile.common.confirm')}</Button>
            </View>
          </View>
        )}
      </PageLayout>
    </View>
  )
}
export default GlobalWrapper(observer(SkuList))
