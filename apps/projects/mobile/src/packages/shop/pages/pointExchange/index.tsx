import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import cx from 'classnames'
import { View, Icons, Text, ScrollView, ActivityIndicator } from '@apps/mobile-ui'
import ImageBox from '@/components/ImageBox'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { numFormat } from '@/utils/numberFormat'
import { useSafeArea } from '@apps/mobile-services'
import EmptyLayout from '@/components/Empty'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import MallTabBottom from '@/components/MallTabBottom'
import useStores from '@/store/useStores'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { postProductMobileShopScoreGetCommodityList, postProductMobileShopSelfGetScoreCommodityList } from '@apps/apis'
import { getMemberMobileLrcRightShopDetailPage } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { THEME_COLORS } from '@/constants/theme'
interface paramType {
  shopId: number
  logo: string
  memberName: string
  memberId: number
  roleId: number
}
const PointExchange: React.FC<paramType> = () => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  usePageInit()
  // setNavigationBarTitle({ title: intl.formatMessage({ id: 'integral.jifenduihuan', defaultMessage: '积分兑换' }) })
  const params = getCurrentInstance().router?.params || {}
  const { safeBottomHeight } = useSafeArea()
  const [current, setCurrent] = useState<number>(1)
  const [dataList, setDataList] = useState<any[]>([])
  const [pageSize] = useState<number>(10)
  const loadMoreLoading = useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const [currentPoint, setCurrentPoint] = useState<number>(0)
  const [sortParam, setSortParam] = useState<{
    [key: string]: any
  }>({})
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()

  /**
   * 排序
   */
  const handleSort = (type: string) => {
    const param: {
      [key: string]: number
    } = {}
    switch (type) {
      case 'sold':
        if (sortParam.orderType !== 1) {
          param.orderType = 1
        } else {
          delete param.orderType
        }
        break
      case 'price':
        if (sortParam.orderType !== 3) {
          param.orderType = 3
        } else {
          param.orderType = 4
        }
        break
      default:
        break
    }
    setSortParam(param)
  }
  const genIndicator = useCallback(() => {
    if (!noMoreDate) {
      return (
        <View className={styles['pointExchange-indicatorContainer']}>
          <ActivityIndicator className={styles['pointExchange-indicator']} size={20} isOpened />
          <Text className={styles['pointExchange-indicatorText']}>
            {intl.formatMessage({
              id: 'integral.zhengzaijiazai',
              defaultMessage: '正在加载~',
            })}
          </Text>
        </View>
      )
    }
    if (current > 1 || dataList.length > 0) {
      return (
        <View className={styles['pointExchange-indicatorContainer']}>
          <Text className={styles['pointExchange-indicatorText']}>
            {intl.formatMessage({
              id: 'integral.meiyougengduola',
              defaultMessage: '没有更多啦~',
            })}
          </Text>
        </View>
      )
    }
    if (current === 1 && dataList.length === 0) {
      return (
        <EmptyLayout
          description={intl.formatMessage({
            id: 'integral.zanwushuju',
            defaultMessage: '暂无数据~',
          })}
        />
      )
    }
    return null
  }, [noMoreDate])
  const fetchDataList = (currentPage?: number, merge: boolean = false) => {
    const param: any = {
      current: currentPage || current,
      pageSize,
      priceTypeList: [3],
      orderType: 1,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      ...sortParam,
    }
    const headers = {
      shopId: shopAndSite?.id,
    }
    let fn: any = null
    if (shopAndSite?.isSelf) {
      param.memberId = params.shopId
      fn = postProductMobileShopSelfGetScoreCommodityList
    } else {
      param.storeId = params.shopId
      fn = postProductMobileShopScoreGetCommodityList
    }
    fn &&
      fn(param, {
        headers,
      }).then((res) => {
        if (res.code === 1000) {
          const { data } = res.data
          if (merge) {
            if (!data || data.length <= 0) {
              setNoMoreData(true)
              setCurrent(current - 1)
            } else {
              setDataList([...dataList, ...data])
              loadMoreLoading.current = false
            }
          } else {
            setDataList(data)
            if (data.length < pageSize) {
              setNoMoreData(true)
            }
          }
        }
      })
  }

  /**
   * 加载更多
   */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && shopAndSite) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchDataList(current + 1, true)
    }
  }
  const getCurrentPoint = () => {
    const param: any = {
      upperMemberId: params?.memberId,
      upperRoleId: params?.roleId,
      current: 1,
      pageSize: 1,
      type: 0,
    }
    getMemberMobileLrcRightShopDetailPage(param, {
      showError: false,
    }).then((res) => {
      if (res.code === 1000) {
        setCurrentPoint(res.data.currentPoint)
      }
    })
  }
  useEffect(() => {
    if (shopAndSite) {
      setCurrent(1)
      fetchDataList(1)
      getCurrentPoint()
      loadMoreLoading.current = false
    }
  }, [sortParam, shopAndSite])
  const renderItem = ({ item }: { item: any }) => {
    let soleRate: number = 0
    let stockCount: number = item.stockCount === 0 ? item.sold : item.stockCount
    if (item.sold && stockCount) {
      soleRate = (item.sold / stockCount) * 100
    }
    return (
      <View
        className={styles['pointExchange-scrollItem']}
        key={`scrollItem${item.id}`}
        onClick={() =>
          jmpProductDetail(PRICE_TYPE_ENUM.INTEGRAL, {
            commodityId: item.id,
          })
        }
      >
        <View className={styles['pointExchange-image_box']}>
          <ImageBox source={item.mainPic} width="100%" height="100%" />
        </View>
        <View className={styles['pointExchange-commodityInfo']}>
          <Text className={styles['pointExchange-name']}>{item.name}</Text>
          <View className={styles['pointExchange-soldInfo']}>
            <View className={styles['pointExchange-soldRateBox']}>
              <View
                className={styles['pointExchange-soldRate']}
                style={{
                  width: `${soleRate}%`,
                }}
              />
            </View>
            <View className={styles['pointExchange-soldCountBox']}>
              <Text className={styles['pointExchange-soldCount']}>
                {intl.formatMessage({
                  id: 'integral.yiduihuan',
                  defaultMessage: '已兑换',
                })}
                {item.sold}
              </Text>
              <Text
                className={styles['pointExchange-soldCount']}
                style={{
                  marginLeft: 'auto',
                }}
              >
                {intl.formatMessage({
                  id: 'integral.haisheng',
                  defaultMessage: '还剩',
                })}
                {item.stockCount}
              </Text>
            </View>
          </View>
          <View className={styles['pointExchange-scrollItemLine']}>
            <View className={styles['pointExchange-commodityPriceWrap']}>
              <Text
                className={styles['pointExchange-commodityPrice']}
                style={{
                  fontWeight: 500,
                }}
              >
                {item.min}
              </Text>
              <Text className={styles['pointExchange-commodityPrice']}>
                {intl.formatMessage({
                  id: 'integral.jifen1',
                  defaultMessage: '积分',
                })}
              </Text>
            </View>
            <View className={styles['pointExchange-saleCountWrap']}>
              <View className={styles['pointExchange-exchangeBtn']}>
                <Text className={styles['pointExchange-exchangeBtnText']}>
                  {intl.formatMessage({
                    id: 'integral.lijiduihuan',
                    defaultMessage: '立即兑换',
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
  return (
    <MallTabBottom
      layoutType={params?.layoutType as LAYOUT_TYPE}
      visible={params?.hasTab === 'true' && !shopAndSite?.isSelf}
      activeUrl="shop/pointExchange"
    >
      <View className={styles['pointExchange']}>
        <View className={styles['pointExchange-header']}>
          <View className={styles['pointExchange-pointInfo']}>
            <View
              className={styles['pointExchange-currentPointTitl']}
              onClick={() =>
                Router.navigateTo('shop/pointExchange/detail', {
                  ...params,
                  memberRoleId: params?.roleId,
                })
              }
            >
              <Text className={styles['pointExchange-currentPointTitle_text']}>
                {intl.formatMessage({
                  id: 'integral.dangqianjifen',
                  defaultMessage: '当前积分',
                })}
              </Text>
              <Icons name="ChevronRight" size={12} color="#FFFFFF" />
            </View>
            <Text className={styles['pointExchange-currentPoint']}>{numFormat(currentPoint)}</Text>
          </View>
          <View className={styles['pointExchange-fixBox']}>
            <Text className={styles['pointExchange-fixBoxText']}>
              {intl.formatMessage({
                id: 'integral.shangpinduihuan',
                defaultMessage: '商品兑换',
              })}
            </Text>
            <View className={styles['pointExchange-fixBoxRight']}>
              <View onClick={() => handleSort('sold')}>
                <Text
                  className={cx(
                    styles['pointExchange-sortText'],
                    sortParam.orderType === 1 ? styles['pointExchange-sortTextActive'] : '',
                  )}
                >
                  {intl.formatMessage({
                    id: 'integral.xiaoliang',
                    defaultMessage: '销量',
                  })}
                </Text>
              </View>
              <View className={styles['pointExchange-filterItem']} onClick={() => handleSort('price')}>
                <Text
                  className={cx(
                    styles['pointExchange-sortText'],
                    sortParam.orderType === 3 ? styles['pointExchange-sortTextActive'] : '',
                  )}
                >
                  {intl.formatMessage({
                    id: 'integral.suoxujifen',
                    defaultMessage: '所需积分',
                  })}
                </Text>
                <View className={styles['pointExchange-filterArrowBox']}>
                  <Icons
                    name="ArrowUpFill"
                    size={14}
                    color={sortParam.orderType === 4 ? '#FA8C16' : '#909399'}
                    className={styles['pointExchange-upFill']}
                  />
                  <Icons
                    name="ArrowDownFill"
                    size={14}
                    color={sortParam.orderType === 3 ? '#FA8C16' : '#909399'}
                    className={styles['pointExchange-downFill']}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className={styles['pointExchange-scroll']}>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: THEME_COLORS.page,
              height: '100%',
            }}
            data={dataList}
            renderItem={renderItem}
            keyExtractor={(item) => `scrollItem${item.id}`}
            listFooterComponent={genIndicator}
            onEndReached={() => {
              loadMoreData()
            }}
            onEndReachedThreshold={50}
          />
        </View>
        <View
          style={
            safeBottomHeight && params?.hasTab !== 'true'
              ? {
                  paddingBottom: `${safeBottomHeight}PX`,
                  backgroundColor: '#FFFFFF',
                }
              : {}
          }
        />
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(PointExchange)
