import React, { useEffect, useMemo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { preload } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, Image, Tabs, ScrollView, Toast } from '@apps/mobile-ui'
import PageLayout from '@/components/PageLayout'
import Search from '@/components/Search'
import Empty from '@/components/Empty'
import Router from '@/utils/router'
import defaultImage from '@/assets/images/default_img.png'
import GenIndicator from '@/components/GenIndicator'
import { useSafeArea } from '@apps/mobile-services'
import { interval } from '@/utils/date'
import { getTradeAppletProductQuotationAuditList, getTradeAppletProductQuotationSum } from '@apps/apis'
import styles from './index.module.scss'

let flag: boolean = true

enum SORT_TYPE {
  /** 全部报价单（不包含审核通过和审核不通过 */
  ALL = 1,
  /** 待提交审核 */
  WAIT_SUBMIT_AUDIT,
  /** 待审核(一级), */
  WAIT_AUDIT_ONE,
  /** 待审核(二级) */
  WAIT_AUDIT_TWO,
  /** 待确认 */
  WAIT_SUBMIT,
}

type SUM_TYPE = {
  /** 全部（待提交审核+待审核一级+待审核二级+待提交） */
  allSum?: number
  /** 待提交审核数量 */
  waitSubmitAuditSum?: number
  /** 待审核一级数量 */
  waitAuditStepOneSum?: number
  /** 待审核二级数量 */
  waitAuditStepTwoSum?: number
  /** 待待确认数量 */
  waitCommitSum?: number
}

const OfferListLayout: React.FC<{}> = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const loadMoreLoading = React.useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = React.useState<boolean>(false)
  const [contentList, setContentList] = React.useState<any[]>([])
  const [current, setCurrent] = React.useState<number>(1)
  const [pageSize] = React.useState<number>(10)
  const [keyword, setKeyword] = React.useState<string>('')
  const [searchType, setSearchType] = React.useState<number>(SORT_TYPE.ALL)
  const [sum, setSum] = React.useState<SUM_TYPE>()
  const [refreshing, setRefreshing] = React.useState<boolean>(false)

  const zero = (num) => {
    let bool = num === 0 ? false : true
    return bool
  }

  console.log(loadMoreLoading.current)

  const tabList = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'inquiryQuotation.quanbu', defaultMessage: '全部' }),
        key: SORT_TYPE.ALL,
        badge: zero(sum?.allSum) && sum?.allSum,
      },
      {
        title: intl.formatMessage({ id: 'inquiryQuotation.daitijiaoshenhe', defaultMessage: '待提交审核' }),
        key: SORT_TYPE.WAIT_SUBMIT_AUDIT,
        badge: zero(sum?.waitSubmitAuditSum) && sum?.waitSubmitAuditSum,
      },
      {
        title: intl.formatMessage({ id: 'inquiryQuotation.daishenheyiji', defaultMessage: '待审核(一级)' }),
        key: SORT_TYPE.WAIT_AUDIT_ONE,
        badge: zero(sum?.waitAuditStepOneSum) && sum?.waitAuditStepOneSum,
      },
      {
        title: intl.formatMessage({ id: 'inquiryQuotation.daishenheerji', defaultMessage: '待审核(二级)' }),
        key: SORT_TYPE.WAIT_AUDIT_TWO,
        badge: zero(sum?.waitAuditStepTwoSum) && sum?.waitAuditStepTwoSum,
      },
      {
        title: intl.formatMessage({ id: 'inquiryQuotation.daiqueren', defaultMessage: '待确认' }),
        key: SORT_TYPE.WAIT_SUBMIT,
        badge: zero(sum?.waitCommitSum) && sum?.waitCommitSum,
      },
    ]
  }, [sum])

  /** 通过api获取数据 */
  const fetchContentList = (currentPage?: number, merge: boolean = false) => {
    const params: any = {
      current: currentPage || current,
      pageSize,
      searchType,
    }
    if (keyword && flag) params.keyword = keyword

    getTradeAppletProductQuotationAuditList({ ...params }).then((res: any) => {
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

  const GetSum = async () => {
    const { data, code, message } = await getTradeAppletProductQuotationSum()
    if (code !== 1000) {
      Toast.show({ title: message, icon: 'none' })
      return
    }
    setSum(data)
  }

  /** 头部搜索 */
  const renderHeader = () => (
    <Search
      placeholder="搜索报价单摘要或询价会员"
      onChange={(value) => setKeyword(value)}
      onSearch={(value) => handleSearchSubmit(value)}
      onClear={(value) => handleClearSubmit(value)}
      searchOnClearAction={false}
      shape="round"
      clearable
    />
  )

  const onTabChange = (activeKey: number) => {
    setContentList([])
    setCurrent(1)
    loadMoreLoading.current = true
    setNoMoreData(false)
    setSearchType(activeKey + 1)
  }

  useEffect(() => {
    fetchContentList(1, false)
    GetSum()
  }, [searchType])

  /** tab 切换 */
  const renderTab = () => (
    <View className={styles['inquiryQuotation-tabBar']}>
      <Tabs height="100%" current={searchType - 1} onClick={onTabChange} tabList={tabList} scroll />
    </View>
  )

  /**
   * @param fmt 时间参数
   * @returns 时间格式的文字
   */
  const fmtView = (fmt: string) => {
    const fmtText = fmt.split('')
    fmtText.splice(2, 0, '天')
    fmtText.splice(5, 0, '时')
    fmtText.splice(8, 0, '分')
    return (
      <Text className={styles['inquiryQuotation-inquiryTime']}>
        {fmtText.map((item: string) => (
          <>{item}</>
        ))}
      </Text>
    )
  }

  const refreshFn = () => {
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
      refresh: () => {
        refreshFn()
        GetSum()
      },
    })
    Router.navigateTo(code)
  }
  /** 列表数据 */
  const renderItem = ({ item }: { item: any }) => (
    <View
      className={styles['inquiryQuotation-boxSizeing']}
      onClick={() => handleLink('root/offer/offerDetail', item.id, 'PREVIEW')}
    >
      <View className={styles['inquiryQuotation-boxItem']}>
        <View className={styles['inquiryQuotation-boxTitlenNav']}>
          <View className={styles['inquiryQuotation-docsStatus']}>
            <Text className={styles['inquiryQuotation-docsStatusText']}>报价单号: {item.quotationNo}</Text>
          </View>
          <Text className={styles['inquiryQuotation-stateName']}>{item.interiorStateName}</Text>
        </View>
        <View className={styles['inquiryQuotation-productWrap']}>
          <View className={styles['inquiryQuotation-productTitleBox']}>
            <View className={styles['inquiryQuotation-docIcon']}>
              <Text className={styles['inquiryQuotation-docIconText']}>报</Text>
            </View>
            <Text className={styles['inquiryQuotation-productTitle']}>{item.details}</Text>
          </View>
          <View className={styles['inquiryQuotation-productBox']}>
            <View className={styles['inquiryQuotation-procuctInfo']}>
              <View className={styles['inquiryQuotation-timeitem']}>
                <Icons name="Clock" size={10} className={styles['inquiryQuotation-timeIcons']} color="#909399" />
                {fmtView(interval(item.quotationAsTime))}
              </View>
              <View className={styles['inquiryQuotation-timeitem']}>
                <Icons name="Mine" size={10} className={styles['inquiryQuotation-timeIcons']} color="#909399" />
                <Text className={styles['inquiryQuotation-corpText']}>{item.memberName}</Text>
              </View>
            </View>
            <View className={styles['inquiryQuotation-procuctImage']}>
              <Image
                src={item.productMainImgUrl || defaultImage}
                className={styles['inquiryQuotation-procuctImageItem']}
              />
            </View>
          </View>
          <View className={styles['inquiryQuotation-productTitleBox']}>
            <View className={styles['inquiryQuotation-docIcon']} style={{ backgroundColor: '#EBF9F6' }}>
              <Text className={styles['inquiryQuotation-docIconText']} style={{ color: '#00A98F' }}>
                询
              </Text>
            </View>
            <Text className={styles['inquiryQuotation-productTitle']}>{item?.inquiryDetails}</Text>
          </View>
        </View>
        <View className={styles['inquiryQuotation-optionBox']}>
          {item.button === SORT_TYPE.WAIT_SUBMIT_AUDIT - 1 && (
            <View
              className={styles['inquiryQuotation-enterShopBtn']}
              onClick={(e) => {
                e.stopPropagation()
                handleLink('root/offer/offerDetail', item.id, 'WAIT')
              }}
            >
              <Text className={styles['inquiryQuotation-enterShopBtnText']}>提交审核</Text>
            </View>
          )}
          {item.button === SORT_TYPE.WAIT_AUDIT_ONE - 1 && (
            <View
              className={styles['inquiryQuotation-enterShopBtn']}
              onClick={(e) => {
                e.stopPropagation()
                handleLink('root/offer/offerDetail', item.id, 'ONE')
              }}
            >
              <Text className={styles['inquiryQuotation-enterShopBtnText']}>审核</Text>
            </View>
          )}
          {item.button === SORT_TYPE.WAIT_AUDIT_TWO - 1 && (
            <View
              className={styles['inquiryQuotation-enterShopBtn']}
              onClick={(e) => {
                e.stopPropagation()
                handleLink('root/offer/offerDetail', item.id, 'TWO')
              }}
            >
              <Text className={styles['inquiryQuotation-enterShopBtnText']}>审核</Text>
            </View>
          )}
          {item.button === SORT_TYPE.WAIT_SUBMIT - 1 && (
            <View
              className={styles['inquiryQuotation-enterShopBtn']}
              onClick={(e) => {
                e.stopPropagation()
                handleLink('root/offer/offerDetail', item.id, 'SUBMIT')
              }}
            >
              <Text className={styles['inquiryQuotation-enterShopBtnText']}>确认报价</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )

  /** 加载更多 */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchContentList(current + 1, true)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    refreshFn()
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  return (
    <View className={styles['inquiryQuotation']}>
      <PageLayout
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <View className={styles['inquiryQuotation-header']}>
            {renderHeader()}
            {renderTab()}
          </View>
        }
      >
        <View className={styles['inquiryQuotation-scrollView']}>
          <ScrollView
            className={styles['inquiryQuotation-flatList']}
            data={contentList}
            renderItem={renderItem}
            keyExtractor={(item: any) => `scrollItem${item.id}`}
            onEndReachedThreshold={50}
            listEmptyComponent={<Empty />}
            listFooterComponent={JSON.stringify(contentList) !== '[]' ? <GenIndicator noMoreDate={noMoreDate} /> : null}
            horizontal={false}
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
export default OfferListLayout
