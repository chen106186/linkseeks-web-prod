import React, { useEffect, useMemo } from 'react'
import { getCurrentPages, preload, useDidShow } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, ScrollView, Image } from '@apps/mobile-ui'
import Search from '@/components/Search'
import Router from '@/utils/router'
import { dateFmt, dateFormat } from '@/utils/date'
import PageLayout from '@/components/PageLayout'
import GenIndicator from '@/components/GenIndicator'
import { getTradeAppletProductInquiryList } from '@apps/apis'
import { useSafeArea } from '@apps/mobile-services'
import defaultImage from '@/assets/images/default_img.png'
import cx from 'classnames'
import styles from './index.module.scss'

let flag: boolean = true

enum SORT_TYPE {
  /** 默认 */
  DEFAULT = 0,
  /** 交付时间 正序排序 */
  DELIVEERYTIME_ASC,
  /** 交付时间 倒序排序 */
  DELIVEERYTIME_DSC,
  /** 截止时间 截止时间正序排序 */
  QUOTATIONASTIME_ASC,
  /** 截止时间 截止时间倒序排序 */
  QUOTATIONASTIME_DSC,
}

type KET_TYPE = {
  /** 默认 */
  DEFAULT
  /** 交付时间 */
  DELIVEERYTIME
  /** 截止时间 */
  QUOTATIONASTIME
}

enum ACTIVE_COLOR {
  /** avtive */
  FOCUS = '#00A98F',
  /** default */
  BLUR = '#91959B',
}

enum ISQUOTED {
  /** 是否已经报价: 否 */
  NOT,
  /** 是否已经报价: 是 */
  YES,
}

const InquiryListLayout: React.FC<{}> = () => {
  const { safeBottomHeight } = useSafeArea()
  const loadMoreLoading = React.useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = React.useState<boolean>(false)
  const [current, setCurrent] = React.useState<number>(1)
  const [pageSize] = React.useState<number>(10)
  const [keyword, setKeyword] = React.useState<string>('')
  const [contentList, setContentList] = React.useState<any[]>([])
  const [refreshing, setRefreshing] = React.useState<boolean>(false)

  const [sortType, setSortType] = React.useState<number>(SORT_TYPE.DEFAULT)

  /** 通过api获取数据 */
  const fetchContentList = (currentPage?: number, merge: boolean = false) => {
    const params: any = {
      current: currentPage || current,
      pageSize,
      sortType,
    }
    if (keyword && flag) params.keyword = keyword

    getTradeAppletProductInquiryList({ ...params }).then((res: any) => {
      if (res.code === 1000) {
        const { data } = res.data
        if (merge) {
          if (!data || data.length <= 0) {
            setNoMoreData(true)
            setCurrent(current - 1)
          } else {
            setContentList([...contentList, ...data])
            loadMoreLoading.current = false
            setNoMoreData(false)
          }
        } else {
          setContentList(data)
          loadMoreLoading.current = false
          if (data.length < pageSize) {
            setNoMoreData(true)
          } else {
            setNoMoreData(false)
          }
        }
      }
    })
  }

  const refresh = () => {
    setContentList([])
    setCurrent(1)
    loadMoreLoading.current = true
    setNoMoreData(false)
    fetchContentList(1, false)
  }

  const handleLink = (code, id: number, PAGE?: string) => {
    preload({
      id,
      PAGE,
    })
    Router.navigateTo(code)
  }

  const renderItem = ({ item }: { item: any }) => (
    <View className={styles['box']}>
      <View className={styles['box-item']} onClick={() => handleLink('root/inquiry/inquiryDetail', item.id, 'PREVIEW')}>
        <View className={styles['box-item-title-nav']}>
          <View className={styles['box-item-title-nav-left']}>
            <View className={styles['box-item-title-nav-left-avatar']}>
              <Image
                src={item?.inquiryMemberLogo || defaultImage}
                className={styles['box-item-title-nav-left-avatar-image']}
              />
            </View>
            <Text className={styles['box-item-title-nav-left-name']}>{item?.inquiryListMemberName}</Text>
          </View>
          <View className={styles['box-item-title-nav-right']}>
            <Text className={styles['box-item-title-nav-right-status']}>{item?.externalStateName}</Text>
          </View>
        </View>
        <View className={styles['box-item-content-box']}>
          <View className={styles['box-item-content-box-top']}>
            <Text className={styles['box-item-content-box-top-title']}>{item?.details}</Text>
          </View>
          <View className={styles['box-item-content-box-bottom']}>
            <View className={styles['box-item-content-box-bottom-left']}>
              <View className={styles['letf-box']}>
                <Text className={styles['letf-box-lable']}>交付时间</Text>
                <Text className={styles['letf-box-value']}>{dateFmt(new Date(item?.deliveryTime))}</Text>
              </View>
              <View className={styles['letf-box']}>
                <Text className={styles['letf-box-lable']}>截止时间</Text>
                <Text className={styles['letf-box-value']}>{dateFormat(new Date(item?.quotationAsTime))}</Text>
              </View>
            </View>
            <View className={styles['box-item-content-box-bottom-right']}>
              <Image
                src={item?.productMainImgUrl || defaultImage}
                className={styles['box-item-content-box-bottom-right-image']}
              />
            </View>
          </View>
        </View>
        {item?.isShowQuote && item?.isQuoted === ISQUOTED.NOT && (
          <View className={styles['box-item-operate-box']}>
            <View
              className={styles['box-item-operate-box-btn']}
              onClick={(e) => {
                e.stopPropagation()
                handleLink('root/inquiry/inquiryDetail', item.id, 'OFFER')
              }}
            >
              <Text className={styles['box-item-operate-box-btn-text']}>报价</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )

  /** 搜索 */
  const handleSearchSubmit = (val: string) => {
    if (val) {
      setCurrent(1)
      flag = true
      setContentList([])
      loadMoreLoading.current = false
      setNoMoreData(false)
      fetchContentList()
    }
  }

  /** 清除搜索 */
  const handleClearSubmit = (val: string) => {
    setKeyword(val)
    setCurrent(1)
    flag = false
    setContentList([])
    loadMoreLoading.current = false
    setNoMoreData(false)
    fetchContentList()
  }

  useEffect(() => {
    refresh()
  }, [sortType])

  /** 加载更多 */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchContentList(current + 1, true)
    }
  }

  /** 筛选 */
  const handleSort = (key: KET_TYPE['DEFAULT'] | KET_TYPE['DELIVEERYTIME'] | KET_TYPE['QUOTATIONASTIME']) => {
    let type = 0
    switch (key) {
      case 'DELIVEERYTIME':
        type = sortType === SORT_TYPE.DELIVEERYTIME_ASC ? SORT_TYPE.DELIVEERYTIME_DSC : SORT_TYPE.DELIVEERYTIME_ASC
        setSortType(type)
        break
      case 'QUOTATIONASTIME':
        type =
          sortType === SORT_TYPE.QUOTATIONASTIME_ASC ? SORT_TYPE.QUOTATIONASTIME_DSC : SORT_TYPE.QUOTATIONASTIME_ASC
        setSortType(type)
        break
      default:
        setSortType(SORT_TYPE.DEFAULT)
        break
    }
  }

  const toggle = (ASC, DSC) => {
    let type = sortType === ASC || sortType === DSC ? true : false
    return type
  }

  useDidShow(() => {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1] // 获取当前页面
    if (currPage.data.refresh) {
      refresh()
    }
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    refresh()
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  return (
    <View className={styles['container']}>
      <PageLayout
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <Search
              placeholder="询价摘要/询价会员"
              customClassName="stocksSourcing-search"
              onChange={(value) => setKeyword(value)}
              onSearch={(value) => handleSearchSubmit(value)}
              onClear={(value) => handleClearSubmit(value)}
              searchOnClearAction={false}
              shape="round"
              clearable
            />
            <View className={styles['filter']}>
              <View className={styles['filter-sort-bar']}>
                <View className={styles['filter-sort-bar-list']}>
                  <View className={styles['filter-sort-bar-list-item']} onClick={() => handleSort('DEFAULT')}>
                    <Text
                      className={cx(
                        styles['filter-sort-bar-list-item-name'],
                        sortType === SORT_TYPE.DEFAULT && styles['active'],
                      )}
                    >
                      默认
                    </Text>
                  </View>
                  <View className={styles['filter-sort-bar-list-item']} onClick={() => handleSort('DELIVEERYTIME')}>
                    <Text
                      className={cx(
                        styles['filter-sort-bar-list-item-name'],
                        toggle(SORT_TYPE.DELIVEERYTIME_ASC, SORT_TYPE.DELIVEERYTIME_DSC) && styles['active'],
                      )}
                    >
                      交付时间
                    </Text>
                    <View className={styles['filter-sort-bar-list-item-sorter']}>
                      <View className={styles['filter-sort-bar-list-item-sorter-up']}>
                        <Icons
                          className={styles['filter-sort-bar-list-item-icon']}
                          name="ArrowUpFill"
                          size={12}
                          color={sortType === SORT_TYPE.DELIVEERYTIME_ASC ? ACTIVE_COLOR.FOCUS : ACTIVE_COLOR.BLUR}
                        />
                      </View>
                      <View className={styles['filter-sort-bar-list-item-sorter-down']}>
                        <Icons
                          className={styles['filter-sort-bar-list-item-icon']}
                          name="ArrowDownFill"
                          size={12}
                          color={sortType === SORT_TYPE.DELIVEERYTIME_DSC ? ACTIVE_COLOR.FOCUS : ACTIVE_COLOR.BLUR}
                        />
                      </View>
                    </View>
                  </View>
                  <View className={styles['filter-sort-bar-list-item']} onClick={() => handleSort('QUOTATIONASTIME')}>
                    <Text
                      className={cx(
                        styles['filter-sort-bar-list-item-name'],
                        toggle(SORT_TYPE.QUOTATIONASTIME_ASC, SORT_TYPE.QUOTATIONASTIME_DSC) && styles['active'],
                      )}
                    >
                      截止时间
                    </Text>
                    <View className={styles['filter-sort-bar-list-item-sorter']}>
                      <View className={styles['filter-sort-bar-list-item-sorter-up']}>
                        <Icons
                          className={styles['filter-sort-bar-list-item-icon']}
                          name="ArrowUpFill"
                          size={12}
                          color={sortType === SORT_TYPE.QUOTATIONASTIME_ASC ? ACTIVE_COLOR.FOCUS : ACTIVE_COLOR.BLUR}
                        />
                      </View>
                      <View className={styles['filter-sort-bar-list-item-sorter-down']}>
                        <Icons
                          className={styles['filter-sort-bar-list-item-icon']}
                          name="ArrowDownFill"
                          size={12}
                          color={sortType === SORT_TYPE.QUOTATIONASTIME_DSC ? ACTIVE_COLOR.FOCUS : ACTIVE_COLOR.BLUR}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        }
      >
        {/* 加载的内容 */}
        <View className={styles['scrollView']}>
          <ScrollView
            className={styles['flatList']}
            renderItem={renderItem}
            data={contentList}
            keyExtractor={(item: any) => `scrollItem${item.id}`}
            onEndReachedThreshold={50}
            horizontal={false}
            listFooterComponent={<GenIndicator noMoreDate={noMoreDate} />}
            refresherEnabled
            refresherTriggered={refreshing}
            onRefresherRefresh={() => handleRefresh()}
            onEndReached={() => {
              loadMoreData()
            }}
          />
        </View>
      </PageLayout>
    </View>
  )
}
export default InquiryListLayout
