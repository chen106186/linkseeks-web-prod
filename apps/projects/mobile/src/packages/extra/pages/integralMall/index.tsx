import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, Image, ScrollView, ActivityIndicator } from '@apps/mobile-ui'
import Empty from '@/components/Empty'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
// import Router from '@/utils/router';
import { ProductItem } from '@/components/ProductList/Item'
import NavBar from '@/components/NavBar'
import { useIntl } from '@linkseeks/i18n'
import MallTabBottom from '@/components/MallTabBottom'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { postProductMobileShopScoreGetCommodityList } from '@apps/apis'
import Banner from './components/Banner'
import Category from './components/Category'
import PopularExchange from './components/PopularExchange'
import ExchangeZone from './components/ExchangeZone'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
const RedemptionOfPointsDefault = getOssUrlPath('/miniprogram/assets/images/RedemptionOfPoints.jpg')
interface RangeItemType {
  id: number
  title: string
  min: null | number
  max?: number
}
const PAGE_SIZE = 8
const PointMall: React.FC<{}> = () => {
  const intl = useIntl()
  const { hasTab, layoutType } = useRouter()?.params || {}
  const [refreshing, setRefreshing] = useState(false)
  /** 加载更多 */
  const [currentRange, setCurrentRange] = useState<number>(1)
  const [commodityList, setCommodityList] = useState<ProductItem[]>([])
  const {
    userStore: { userInfo, shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  const loadMoreLoading = useRef<boolean>(false)
  const [current, setCurrent] = useState(1)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const pointRangList: RangeItemType[] = [
    {
      id: 1,
      title: intl.formatMessage({
        id: 'integral.jifen',
        defaultMessage: '0-100积分',
        data: '0-100',
      }),
      min: null,
      max: 100,
    },
    {
      id: 2,
      title: intl.formatMessage({
        id: 'integral.jifen',
        defaultMessage: '101-500积分',
        data: '101-500',
      }),
      min: 101,
      max: 500,
    },
    {
      id: 3,
      title: intl.formatMessage({
        id: 'integral.jifen',
        defaultMessage: '501-1000积分',
        data: '501-1000',
      }),
      min: 501,
      max: 1000,
    },
    {
      id: 4,
      title: intl.formatMessage({
        id: 'integral.jifenyishang',
        defaultMessage: '1001积分以上',
        data: '1001',
      }),
      min: 1001,
    },
  ]
  const defaultBanner = [
    {
      name: '积分1',
      type: 5,
      img: RedemptionOfPointsDefault,
    },
  ]
  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }, [])
  const _normalizeList = (data: any[]): ProductItem[] => {
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
        stockCount: item.stockCount,
        minOrder: item.minOrder,
        preferentialPrice: item.preferentialPrice,
        saleTags: item.tagList,
      }
      ret.push(atom)
    })
    return ret
  }
  const fetchDataList = (currentPage?: number, merge: boolean = false) => {
    const newParam: any = {
      current: currentPage || current,
      pageSize: PAGE_SIZE,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      priceTypeList: [3],
    }
    const currentRangItem = pointRangList.filter((item) => item.id === currentRange)[0]
    newParam.min = currentRangItem.min
    if (currentRangItem.max) {
      newParam.max = currentRangItem.max
    }
    const headers: any = {
      type: 2,
      shopId: shopAndSite?.id,
    }
    postProductMobileShopScoreGetCommodityList(newParam, {
      headers,
    }).then((res) => {
      if (res.code === 1000) {
        const { data } = res.data
        if (merge) {
          if (!data || data.length <= 0) {
            setNoMoreData(true)
            if (current > 2) setCurrent(current - 1)
          } else {
            const _res = _normalizeList(data)
            setCommodityList(commodityList.concat(_res))
            loadMoreLoading.current = false
          }
        } else {
          setCommodityList(_normalizeList(data))
          if (data.length < PAGE_SIZE) {
            setNoMoreData(true)
          }
        }
      }
    })
  }

  /** 加载更多 */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchDataList(current + 1, true)
    }
  }
  const handleChangeRange = (item: RangeItemType) => {
    loadMoreLoading.current = false
    setCurrent(1)
    setNoMoreData(false)
    setCurrentRange(item.id)
  }
  useEffect(() => {
    if (shopAndSite) {
      fetchDataList()
    }
  }, [currentRange, shopAndSite])
  const genIndicator = useCallback(() => {
    if (!noMoreDate) {
      return (
        <View className={styles['integral-mall-indicatorContainer']}>
          <ActivityIndicator className={styles['integral-mall-indicator']} size={20} isOpened />
          <Text className={styles['integral-mall-indicatorText']}>
            {intl.formatMessage({
              id: 'integral.zhengzaijiazai',
              defaultMessage: '正在加载~',
            })}
          </Text>
        </View>
      )
    }
    if (current > 1 || commodityList.length > 0) {
      return (
        <View className={styles['integral-mall-indicatorContainer']}>
          <Text className={styles['integral-mall-indicatorText']}>
            {intl.formatMessage({
              id: 'integral.meiyougengduola',
              defaultMessage: '没有更多啦~',
            })}
          </Text>
        </View>
      )
    }
    return null
  }, [noMoreDate])
  return (
    <MallTabBottom visible={hasTab === 'true'} layoutType={layoutType as LAYOUT_TYPE} activeUrl="extra/integralMall">
      <View className={styles['inte_box']}>
        <NavBar
          title={intl.formatMessage({
            id: 'integral.jifenshangcheng',
            defaultMessage: '积分商城',
          })}
          showBack={hasTab === 'true' ? false : (true as boolean)}
          showExtra={hasTab === 'true' ? false : (true as boolean)}
          customClassName={styles['integral-mall-navbar']}
          titleColor="#5A2A12"
          backIconColor="#5A2A12"
        />
        <View className={styles['integral-mall']}>
          <ScrollView
            className={styles['integral-mall-scroll']}
            refresherEnabled
            refresherTriggered={refreshing}
            scrollAnchoring
            scrollTop={0}
            listFooterComponent={genIndicator}
            listEmptyComponent={
              !loadMoreLoading ? (
                <Empty
                  description={intl.formatMessage({
                    id: 'integral.zanwushuju',
                    defaultMessage: '暂无数据',
                  })}
                />
              ) : null
            }
            onEndReachedThreshold={50}
            onEndReached={() => {
              loadMoreData()
            }}
            onRefresherRefresh={handleRefresh}
          >
            {userInfo && (
              <View className={styles['integral-mall-header']}>
                <View className={styles['integral-mall-title']}>
                  <Image className={styles['integral-mall-logo']} src={userInfo!.logo!} />
                  <Text className={styles['integral-mall-name']}>{userInfo?.userName}</Text>
                </View>
                {/* <View className={styles['integral-mall-detailLink']} >
                 <Text className={styles['integral-mall-detailLinkText']}>我的积分 &gt;</Text>
                 </View> */}
              </View>
            )}
            <View className={styles['integral-mall-bannerWrap']}>
              <Banner dataList={defaultBanner} />
            </View>
            <Category refreshing={refreshing} />
            <PopularExchange refreshing={refreshing} />
            <ExchangeZone currentRange={currentRange} commodityList={commodityList} _onChange={handleChangeRange} />
          </ScrollView>
        </View>
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(observer(PointMall))
