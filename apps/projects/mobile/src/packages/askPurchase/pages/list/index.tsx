import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { useState, useRef, useEffect, Fragment } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import { ScrollView } from '@tarojs/components'
import Loading from '@/components/Loading'
import Filter from '@/components/Filter'
import FilterDrawer from '@/components/FilterDrawer'
import ImageBox from '@/components/ImageBox'
import cx from 'classnames'
import { observer } from 'mobx-react-lite'
import { FilterSortBarValue } from '@/components/FilterSortBar'
import { FILTER_BAR_TYPE, FILTER_PARAM } from '@/components/FilterSortBar/type'
import { postTradeAskPurchasePageByShopId, PostTradeAskPurchasePageByShopIdResponseDetail } from '@apps/apis'
import useStores from '@/store/useStores'
import { checkMore } from '@/utils'
import useCountdown from '@/hooks/useCountdown'
import Router from '@/utils/router'
import timeIcon from './time.png'
import styles from './index.module.scss'
import { FILTER_CONFIG_TYPE } from '@/store/searchStore/model'
import { preload } from '@apps/mobile-services/utils/taro'
import { RouterKeys } from '@/routes'
import { THEME_COLORS } from '@/constants/theme'
import { accAdd } from '@apps/utils/src/format'
import { useMobileIntl } from '@apps/locales'
interface ListParams {
  /**
   * 每页行数
   */
  pageSize?: number
  /**
   * 名称
   */
  keyword?: string
}
const AskPurchaseList = () => {
  const {
    userStore: { shopAndSite, userInfo },
  } = useStores()
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [dataList, setDataList] = useState<PostTradeAskPurchasePageByShopIdResponseDetail[]>([])
  const [visibleFilterDrawer, setVisibleFilterDrawer] = useState<boolean>(false)
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const [sortParam, setSortParam] = useState({})
  const [filterParam, setFilterParam] = useState<FILTER_PARAM>()
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const PAGE_SIZE = 8
  const translate = useMobileIntl()
  const handleSortChange = (values: FilterSortBarValue) => {
    const param: any = {
      orderList: [],
    }
    if (values.publishTime) {
      param.orderList.push({
        order: 'publishTime',
        direction: values.publishTime,
      })
    }
    if (values.remainingTime) {
      param.orderList.push({
        order: 'quoteEndTime',
        direction: values.remainingTime,
      })
    }
    setSortParam(param)
  }
  const getDataList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      const payload: any = {
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        shopId: shopAndSite?.id,
        status: 2,
        ...(searchValue.current || {}),
        ...sortParam,
        ...filterParam,
      }
      if (payload.categoryId) {
        payload.goodsCategoryId = payload.categoryId
      }
      if (payload.provinceCode) {
        payload.deliverAddrProvinceCode = payload.provinceCode
      }
      if (payload.cityCode) {
        payload.deliverAddrCityCode = payload.cityCode
      }
      postTradeAskPurchasePageByShopId(payload, {
        ctlType: 'none',
      })
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
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getDataList()
      .then((res) => {
        setDataList(dataList.concat(res))
      })
      .catch(() => {})
  }
  const handleRefresh = async () => {
    pageRef.current = 1
    setRefreshing(true)
    getDataList()
      .then((res) => {
        setDataList(res)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }
  useEffect(() => {
    getDataList()
      .then((res) => {
        setDataList(res)
      })
      .catch(() => {})
  }, [sortParam, filterParam])
  const getPurchaseCount = (list: any[]) => {
    if (list && list.length > 0) {
      return list.reduce((a, b) => accAdd(a, b.num || 0), 0)
    }
    return 0
  }
  const EndTime = ({ quoteEndTime }: { quoteEndTime: string }) => {
    const { count, setTime } = useCountdown()
    useEffect(() => {
      if (quoteEndTime) {
        setTime(new Date(quoteEndTime.replace(' ', 'T')).getTime())
      }
    }, [quoteEndTime])
    return (
      <View className={styles['askpurchase-list-item-text']}>
        <ImageBox
          resizeMode="aspectFit"
          width={12}
          height={12}
          source={timeIcon}
          style={{
            marginRight: 4,
          }}
        />
        {(count?.d && count?.d > 0) || (count?.h && count?.h > 0) || (count?.m && count?.m > 0) ? (
          <>
            {count?.d ? (
              <Fragment>
                <Text className={styles['askpurchase-list-item-time']}>{count?.d}</Text>
                <Text>{translate('mobile.common.tian')}</Text>
              </Fragment>
            ) : null}
            {count?.h ? (
              <Fragment>
                <Text className={styles['askpurchase-list-item-time']}>{count?.h}</Text>
                <Text>{translate('mobile.common.hour')}</Text>
              </Fragment>
            ) : null}
            {count?.m ? (
              <Fragment>
                <Text className={styles['askpurchase-list-item-time']}>{count?.m}</Text>
                <Text>{translate('mobile.common.minute')}</Text>
              </Fragment>
            ) : null}
          </>
        ) : (
          <Text>{translate('mobile.resource.askPurchase.baojiayijiezhi')}</Text>
        )}
      </View>
    )
  }
  const handleVisibleFilterDrawer = (flag?: boolean) => {
    setVisibleFilterDrawer(!!flag)
  }
  const handleFilterChange = (values: any) => {
    setFilterParam(values)
  }
  const handleLink = (id: number, path: RouterKeys) => {
    preload({
      id,
      PAGE: 'LIST',
      refresh: () => {
        handleRefresh()
      },
    })
    Router.navigateTo(path)
  }
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            customStyle={`background:${THEME_COLORS.primary}`}
            backIconColor="#FFFFFF"
            title={
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                }}
              >
                {translate('mobile.resource.askPurchase.caigouxunyuan')}
              </Text>
            }
          />
          <Filter
            config={[FILTER_BAR_TYPE.publishTime, FILTER_BAR_TYPE.remainingTime]}
            onChange={handleSortChange}
            extra={[
              <View key="2" onClick={() => handleVisibleFilterDrawer(true)}>
                <Text className="filter-extra-item-name">{translate('mobile.resource.askPurchase.shaixuan')}</Text>
                <Icons className="filter-extra-item-icon" name="Filter" size={16} />
              </View>,
            ]}
          />
        </>
      }
    >
      {(headerHeight) => (
        <View className={styles['askpurchase-wrap']}>
          <ScrollView
            className={styles['askpurchase-scrollView']}
            onScrollToLower={handleLoadMore}
            scrollY
            refresherEnabled
            refresherTriggered={refreshing}
            scrollWithAnimation
            refresherBackground="transparent"
            onRefresherRefresh={handleRefresh}
            lowerThreshold={100}
          >
            {dataList && dataList.length > 0 && (
              <View className={styles['askpurchase-list']}>
                {dataList.map((item, index) => (
                  <View
                    className={styles['askpurchase-list-item']}
                    key={`${item.id}-${index}`}
                    onClick={() => handleLink(item.id, 'askPurchase/detail')}
                  >
                    <View className={styles['askpurchase-list-item-line']}>
                      <View className={styles['askpurchase-list-item-name']}>
                        <Text>{item.name}</Text>
                      </View>
                    </View>
                    <View className={cx(styles['askpurchase-list-item-line'], styles.flexEnd)}>
                      <View className={styles['askpurchase-list-item-left']}>
                        <View className={styles['askpurchase-list-item-line']}>
                          <View className={styles['askpurchase-list-item-text']}>
                            <Text>{translate('mobile.resource.askPurchase.caigou')}</Text>
                            <Text className={styles['askpurchase-list-item-count']}>
                              {getPurchaseCount(item.askPurchaseGoodsResponses)}
                            </Text>
                            <Text>{item.askPurchaseGoodsResponses[0]?.unit}</Text>
                          </View>
                          <EndTime quoteEndTime={item.quoteEndTime} />
                        </View>
                        <View className={styles['askpurchase-list-item-company']}>{item.memberName}</View>
                      </View>
                      <View
                        className={cx(
                          styles['askpurchase-list-item-btn'],
                          (item.status !== 2 || item.whetherQuoted) && styles.disabled,
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item.status === 2 && !item.whetherQuoted) {
                            if (!userInfo) {
                              Router.navigateTo('user/login')
                              return
                            }
                            handleLink(item.id, 'askPurchase/add')
                          }
                        }}
                      >
                        <Text>
                          {item.whetherQuoted
                            ? translate('mobile.resource.askPurchase.yibaojia')
                            : translate('mobile.resource.askPurchase.lijibaojia')}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
            <Loading loading={loading} noMore={!hasMore} />
          </ScrollView>
          <FilterDrawer
            visible={visibleFilterDrawer}
            filterParam={filterParam}
            multiple={false}
            onClose={() => handleVisibleFilterDrawer(false)}
            offsetTop={headerHeight}
            onChange={handleFilterChange}
            filterConfig={[FILTER_CONFIG_TYPE.category, FILTER_CONFIG_TYPE.address]}
          />
        </View>
      )}
    </PageLayout>
  )
}
export default GlobalWrapper(observer(AskPurchaseList))
