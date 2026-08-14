import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text, Icons, ScrollView } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import Filter from '@/components/Filter'
import ProductList from '@/components/ProductList'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { Tabs } from '@/components/Tabs'
import { FILTER_BAR_TYPE, FILTER_PARAM } from '@/components/FilterSortBar/type'
import { FilterSortBarValue } from '@/components/FilterSortBar'
import FilterDrawer from '@/components/FilterDrawer'
import useStores from '@/store/useStores'
import { FILTER_CONFIG_TYPE } from '@/store/searchStore/model'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import CommoditySearch from './CommoditySearch'
import ShopsSearch from './ShopsSearch'
import SearchHistory from './SearchHistory'
import ShopCategory from './ShopCategory'
import ShopsHotRank from './ShopsHotRank'
import CommodityHotRank from './CommodityHotRank'
import styles from './index.module.scss'
const SearchPage = () => {
  const intl = useIntl()
  const params = getCurrentInstance().router?.params
  const [keyword, setKeyword] = useState<string>()
  const [showList, setShowList] = useState<boolean>(false)
  // type: 1: 仅搜索商品，2：仅搜索店铺
  // const { params }: any = props
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [sortParam, setSortParam] = useState({})
  const [filterParam, setFilterParam] = useState<FILTER_PARAM>()
  const [visibleFilterDrawer, setVisibleFilterDrawer] = useState(false)
  const filterBarConfig = [FILTER_BAR_TYPE.soldSort, FILTER_BAR_TYPE.creditSort, FILTER_BAR_TYPE.priceSort]
  const shopFilterBarConfigo = [FILTER_BAR_TYPE.creditSort]
  const {
    userStore: { shopAndSite },
    searchStore: { changeSearchKeyword },
    locationStore: { currentCity },
  } = useStores()
  const shopLayout = shopAndSite?.property === 1 ? LAYOUT_TYPE.mall : LAYOUT_TYPE.client
  const multiple = false
  useEffect(() => {
    if (params?.type) {
      setCurrentIndex(Number(params?.type) === 1 ? 0 : 1)
    }
  }, [params])

  // const renderComponentByType = () => {
  //   switch (params?.type) {
  //     case '1':
  //       return <CommoditySearch keyword={keyword} {...params} showSearch />
  //     case '2':
  //       return <ShopsSearch keyword={keyword} showSearch />
  //     default:
  //       return null
  //   }
  // }

  const showPlaceHolder = (): string => {
    switch (params?.type) {
      case '1':
        return intl.formatMessage({
          id: 'search.qingshurushangpinmingcheng',
          defaultMessage: '请输入商品名称',
        })
      case '2':
        return intl.formatMessage({
          id: 'search.qingshurudianpumingcheng',
          defaultMessage: '请输入店铺名称',
        })
      default:
        return intl.formatMessage({
          id: 'search.sousuoshangpindianpu',
          defaultMessage: '搜索商品/店铺',
        })
    }
  }

  // const renderCommodityOrShop = () => {
  //   if (currentIndex === 0) {
  //     return <CommoditySearch keyword={keyword} />
  //   } if (currentIndex === 1) {
  //     return <ShopsSearch keyword={keyword} />
  //   }
  //   return null
  // }

  const handleCurrentIndex = (index: number) => {
    setCurrentIndex(index)
  }
  const handleSwiperChange = (e) => {
    setCurrentIndex(e.detail.current)
  }
  const handleSearch = (keyword: string) => {
    if (keyword) {
      if (currentIndex === 0) {
        changeSearchKeyword(keyword, shopLayout)
      }
      setKeyword(keyword)
      setShowList(true)
    } else {
      setKeyword('')
      setShowList(false)
    }
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
    }
    setSortParam(param)
  }
  const handleVisibleFilterDrawer = (flag?: boolean) => {
    setVisibleFilterDrawer(!!flag)
  }
  const handleFilterChange = (values: any) => {
    if (!showList) {
      setShowList(true)
    }
    setFilterParam(values)
  }

  // 分类跳转来的
  useEffect(() => {
    if (params?.brandId || params?.categoryId) {
      if (!showList) {
        setShowList(true)
      }
      const values: any = {}
      params?.brandId && (values.brandId = params?.brandId)
      params?.categoryId && (values.categoryId = params?.categoryId)
      setFilterParam(values)
    }
  }, [params?.brandId, params?.categoryId, showList])
  return (
    <View>
      <PageLayout
        className={styles['search-page']}
        renderHeader={
          <>
            <NavBar
              title={
                <Search
                  customClassName={styles['stocksSourcing-search']}
                  background="#FDF9F5"
                  innerBackground="#FCF7F1"
                  defaultValue={keyword}
                  onSearch={handleSearch}
                  placeholder={showPlaceHolder()}
                  shape="round"
                  clearable
                />
              }
              greedy
            />
            <Tabs
              current={currentIndex}
              onClick={handleCurrentIndex}
              tabList={[
                {
                  title: intl.formatMessage({
                    id: 'search.shangpin',
                    defaultMessage: '商品',
                  }),
                },
                {
                  title: intl.formatMessage({
                    id: 'search.dianpu',
                    defaultMessage: '店铺',
                  }),
                },
              ]}
            />
            {showList && (
              <Filter
                config={currentIndex === 0 ? filterBarConfig : shopFilterBarConfigo}
                onChange={handleSortChange}
                extra={[
                  currentIndex === 0 && <ProductList.SwitchButton key="1" />,
                  <View key="2" onClick={() => handleVisibleFilterDrawer(!visibleFilterDrawer)}>
                    <Text className={styles['filter-extra-item-name']}>
                      {intl.formatMessage({
                        id: 'search.shaixuan',
                        defaultMessage: '筛选',
                      })}
                    </Text>
                    <Icons className={styles['filter-extra-item-icon']} name="Filter" size={16} />
                  </View>,
                ]}
              />
            )}
          </>
        }
      >
        {(headerHeight) => (
          <>
            <Swiper
              current={currentIndex}
              duration={300}
              style={{
                height: '100%',
              }}
              onChange={handleSwiperChange}
            >
              <SwiperItem>
                {showList ? (
                  <CommoditySearch
                    keyword={keyword}
                    sortParam={sortParam}
                    filterParam={filterParam}
                    showList={showList}
                  />
                ) : (
                  <ScrollView
                    scrollY
                    style={{
                      height: '100%',
                    }}
                  >
                    <SearchHistory type={shopLayout} onSelect={handleSearch} />
                    <CommodityHotRank />
                  </ScrollView>
                )}
              </SwiperItem>
              <SwiperItem>
                {showList ? (
                  <ShopsSearch
                    keyword={keyword}
                    currentCity={currentCity}
                    sortParam={sortParam}
                    filterParam={filterParam}
                    showList={showList}
                  />
                ) : (
                  <ScrollView
                    scrollY
                    style={{
                      height: '100%',
                    }}
                  >
                    <ShopCategory onSelect={handleFilterChange} />
                    <ShopsHotRank currentCity={currentCity} />
                  </ScrollView>
                )}
              </SwiperItem>
            </Swiper>
            <FilterDrawer
              visible={visibleFilterDrawer}
              filterParam={filterParam}
              multiple={multiple}
              onClose={() => handleVisibleFilterDrawer(false)}
              offsetTop={headerHeight}
              filterConfig={currentIndex === 1 ? [FILTER_CONFIG_TYPE.category, FILTER_CONFIG_TYPE.address] : undefined}
              onChange={handleFilterChange}
            />
          </>
        )}
      </PageLayout>
    </View>
  )
}
export default GlobalWrapper(observer(SearchPage))
