import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useRef, useEffect } from 'react'
import { View, Icons, Text, ScrollView } from '@apps/mobile-ui'
import { setNavigationBarTitle, setNavigationBarColor } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import Header from '@/components/NavBar'
import { useIntl } from '@linkseeks/i18n'
import useStores from '@/store/useStores'
import { getCommodityMobileStoreMobileMemberShopList } from '@apps/apis'
import { IS_WEB } from '@/constants'
import { observer } from 'mobx-react-lite'
import Category from './category'
import PopularShops from './popularShops'
import RecommendShop from './recommendShop'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
interface FilterParam {
  sortCreditPoint?: string
  /** 省编码 */
  provinceCode?: number
  cityCode?: number
  areaCode?: string
  /** 平台品类ID */
  categoryId?: number
  /** 排序类型：1：按信用积分升序 按信用积分降序 */
  orderType?: number
}
const SearchComponent = (props: { style?: any; type?: number }) => {
  const { style, type = 1 } = props
  const intl = useIntl()
  return (
    <View
      className={styles['search']}
      style={style ?? {}}
      onClick={() => {
        Router.navigateTo('extra/search', {
          type: 2,
        })
      }}
    >
      <Icons name="Search" size={20} color="#91959B" />
      <Text className={styles['keyword']}>
        {type === 1
          ? intl.formatMessage({
              id: 'findShop_searchComponent_keyword_1',
            })
          : intl.formatMessage({
              id: 'findShop_searchComponent_keyword_2',
            })}
      </Text>
      {type === 1 ? (
        <View className={styles['search-btn']}>
          <Text className={styles['search-btn-text']}>
            {intl.formatMessage({
              id: 'findShop_searchComponent_btn',
            })}
          </Text>
        </View>
      ) : null}
    </View>
  )
}
const FindShop = () => {
  const [currentCategoryId, setCurrentCategoryId] = useState<number>(0)
  const categoryRef = useRef<any>(null)
  const [cusOpacity, setCusOpacity] = useState(0)
  const [pageSize] = useState<number>(8)
  const [current, setCurrent] = useState<number>(1)
  const loadMoreLoading = useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const [filterParam, setFilterParam] = useState<FilterParam>({})
  const [shopList, setShopList] = useState<any[]>([])
  const {
    locationStore: { currentCity },
  } = useStores()
  const intl = useIntl()
  const [scrollViewTop, setScrollViewTop] = useState(0)
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'findShop_navigationBarTitleText' }) })
    setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff0000',
    })
  }, [])
  const handleScroll = (event: any) => {
    const y = event.detail.scrollTop
    if (IS_WEB) {
      setScrollViewTop(y)
    }
    if (y <= 0) {
      setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff0000',
      })
      setCusOpacity(0)
    } else if (y < 80) {
      setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ff0000',
      })
      setCusOpacity(y / 60)
    } else {
      setCusOpacity(1)
      setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ff0000',
      })
    }
  }
  const _onCategoryChange = (id: number) => {
    setCurrentCategoryId(id)
  }

  // useEffect(() => {
  //   if (currentCategoryId) {
  //     setFilterParam({
  //       ...filterParam,
  //       categoryId: currentCategoryId,
  //     })
  //   } else {
  //     const newParam = { ...filterParam }
  //     if (newParam.categoryId) {
  //       delete newParam.categoryId
  //     }
  //     setFilterParam({
  //       ...newParam,
  //     })
  //   }
  // }, [currentCategoryId])

  /**
   * 获取所有店铺列表
   */
  const fetchShopList = (currentPage?: number, merge: boolean = false) => {
    const params: any = {
      current: currentPage || current,
      pageSize,
      orderType: 2,
      provinceCode: currentCity?.provinceCode,
      cityCode: currentCity?.cityCode,
      ...filterParam,
    }
    if (currentCategoryId) {
      params.categoryId = currentCategoryId
    }
    getCommodityMobileStoreMobileMemberShopList(params).then((res) => {
      if (res.code === 1000) {
        const { data } = res.data
        if (merge) {
          if (!data || data.length <= 0) {
            setNoMoreData(true)
            setCurrent(current - 1)
          } else {
            setShopList([...shopList, ...data])
            loadMoreLoading.current = false
          }
        } else {
          setShopList(data)
          if (data.length < pageSize) {
            setNoMoreData(true)
          }
        }
      }
    })
  }
  useEffect(() => {
    loadMoreLoading.current = false
    setNoMoreData(false)
    setCurrent(1)
    fetchShopList(1)
  }, [filterParam, currentCategoryId])
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchShopList(current + 1, true)
    }
  }
  const _handleSelectItem = (item: any) => {
    setFilterParam({
      ...filterParam,
      orderType: item.value,
    })
  }
  const _handleAddressSelect = (item: any[]) => {
    // const provinceCode = item[0]
    // const cityCode = item[1]
    setFilterParam({
      ...filterParam,
      // provinceCode,
      // cityCode,
    })
  }
  return (
    <View className={styles['find-shop-container']}>
      <Header
        title={
          <SearchComponent
            type={2}
            style={{
              backgroundColor: '#F7F8FA',
              border: 0,
              borderRadius: '16px',
            }}
          />
        }
        customClassName={styles['custom-fixed-nav']}
        customStyle={`opacity:${cusOpacity};display: ${cusOpacity ? 'flex' : 'none'}`}
        greedy
        // hasRight={false}
      />
      <ScrollView
        scrollAnchoring
        scrollTop={scrollViewTop}
        style={{
          flex: 1,
          height: '100%',
          backgroundColor: '#F5F6F7',
          display: 'flex',
          flexDirection: 'column',
        }}
        onScroll={(event) => handleScroll(event)}
        onEndReached={() => {
          loadMoreData()
        }}
        onEndReachedThreshold={50}
      >
        <View
          style={{
            display: 'inline-block',
          }}
        >
          <Header
            title={
              <Text
                style={{
                  color: '#fff',
                }}
              >
                {intl.formatMessage({
                  id: 'findShop_header',
                })}
              </Text>
            }
            customClassName={styles['custom-nav']}
            backIconColor="#5A2A12"
          />
          <View className={styles['search-container']}>
            <View className={styles['search-body']}>
              <SearchComponent />
            </View>
          </View>
          {/** 人气店铺 */}
          <PopularShops currentCity={currentCity} />
          <View className={styles['linear-gradient-box']}>
            {/** 品类 */}
            <Category ref={categoryRef} categoryId={currentCategoryId} onChange={_onCategoryChange} />
          </View>
        </View>
        {/** 推荐店铺 */}
        <RecommendShop
          dataList={shopList}
          noMoreDate={noMoreDate}
          current={current}
          handleSelectItem={_handleSelectItem}
          handleAddressSelect={_handleAddressSelect}
        />
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(observer(FindShop))
