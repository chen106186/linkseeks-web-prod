import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect } from 'react'
import { View, Text, Icons, Image, Tabs, ActivityIndicator, ScrollView } from '@apps/mobile-ui'
import { StatusItem } from '@/components/FilterModal/StatusFilterModal'
import { useIntl } from '@linkseeks/i18n'
import Search from '@/components/Search'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import FilterModal from '@/components/FilterModal'
import { dateFormat, interval } from '@/utils/date'
import { useDidShow, setNavigationBarTitle, preload } from '@apps/mobile-services/utils/taro'
import {
  getTradeMobileInquiryAddList,
  getTradeMobileInquiryToAuditList,
  getTradeMobileInquiryToAuditListTwo,
  getTradeMobileSubmitInquirySheetList,
} from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
let flag: boolean = true
const DOC_COLOR = (TYPE: number) => {
  switch (TYPE) {
    case 4:
      return '#00A98F'
    case 5:
      return '#EF3346'
    default:
      return '#2266EE'
  }
}
const InquiryListLayout: React.FC<{}> = () => {
  const intl = useIntl()
  const TAB_LIST = [
    {
      title: intl.formatMessage({
        id: 'inquiry.quanbu',
        defaultMessage: '全部',
      }),
      key: 90,
    },
    {
      title: intl.formatMessage({
        id: 'inquiry.daishenheyiji',
        defaultMessage: '待审核(一级)',
      }),
      key: 2,
    },
    {
      title: intl.formatMessage({
        id: 'inquiry.daishenheerji',
        defaultMessage: '待审核(二级)',
      }),
      key: 3,
    },
    {
      title: intl.formatMessage({
        id: 'inquiry.daitijiao',
        defaultMessage: '待提交',
      }),
      key: 4,
    },
  ]
  usePageInit()
  // setNavigationBarTitle({ title: intl.formatMessage({ id: 'inquiry.xunjiadan', defaultMessage: '询价单' }) })
  const { safeBottomHeight } = useSafeArea()
  const loadMoreLoading = React.useRef<boolean>(false)
  const [visible, setVisible] = React.useState<boolean>(false)
  const [noMoreDate, setNoMoreData] = React.useState<boolean>(false)
  const [contentList, setContentList] = React.useState<any[]>([])
  const [current, setCurrent] = React.useState<number>(1)
  const [pageSize] = React.useState<number>(10)
  const [keyword, setKeyword] = React.useState<string>('')
  const _key = React.useRef<number>(0)

  // 状态查询
  const _externalState = React.useRef<number>(90)
  const _internalState = React.useRef<number>(90)
  const _startDocumentsTime = React.useRef<any>(null)
  const _endDocumentsTime = React.useRef<any>(null)
  const [outerStatus] = React.useState<StatusItem[]>([
    {
      name: intl.formatMessage({
        id: 'inquiry.suoyouzhuangtai',
        defaultMessage: '所有状态',
      }),
      status: 90,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.daitijiaoxunjiadan',
        defaultMessage: '待提交询价单',
      }),
      status: 1,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.daitijiaobaojiadan',
        defaultMessage: '待提交报价单',
      }),
      status: 2,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.daiquerenbaojiadan',
        defaultMessage: '待确认报价单',
      }),
      status: 3,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.jieshoubaojia',
        defaultMessage: '接受报价',
      }),
      status: 4,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.bujieshoubaojia',
        defaultMessage: '不接受报价',
      }),
      status: 5,
    },
  ])
  const [innerStatus] = React.useState<StatusItem[]>([
    {
      name: intl.formatMessage({
        id: 'inquiry.suoyouzhuangtai',
        defaultMessage: '所有状态',
      }),
      status: 90,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.daitijiaoshenhe',
        defaultMessage: '待提交审核',
      }),
      status: 1,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.daishenheyiji',
        defaultMessage: '待审核(一级)',
      }),
      status: 2,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.daishenheerji',
        defaultMessage: '待审核(二级)',
      }),
      status: 3,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.daitijiaoxunjiadan',
        defaultMessage: '待提交询价单',
      }),
      status: 4,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.shenhetongguo',
        defaultMessage: '审核通过',
      }),
      status: 5,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.shenhebutongguoyiji',
        defaultMessage: '审核不通过(一级)',
      }),
      status: 6,
    },
    {
      name: intl.formatMessage({
        id: 'inquiry.shenhebutongguoerji',
        defaultMessage: '审核不通过(二级)',
      }),
      status: 7,
    },
  ])

  /** 通过api获取数据 */
  const fetchContentList = (currentPage?: number, merge: boolean = false) => {
    const params: any = {
      current: currentPage || current,
      pageSize,
    }
    if (keyword && flag) params.keyword = keyword
    if (_externalState.current !== 90) params.externalState = _externalState.current
    if (_internalState.current !== 90) params.interiorState = _internalState.current
    if (_startDocumentsTime.current) params.startDocumentsTime = _startDocumentsTime.current
    if (_endDocumentsTime.current) params.endDocumentsTime = _endDocumentsTime.current
    let fetchApi
    switch (_key.current) {
      case 1:
        fetchApi = getTradeMobileInquiryToAuditList
        break
      case 2:
        fetchApi = getTradeMobileInquiryToAuditListTwo
        break
      case 3:
        fetchApi = getTradeMobileSubmitInquirySheetList
        break
      default:
        fetchApi = getTradeMobileInquiryAddList
        break
    }
    fetchApi({
      ...params,
    }).then((res: any) => {
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
  const handleConfirm = (outerStatusValue: number, innerStatusValue: number, date: any[]) => {
    _externalState.current = outerStatusValue !== 0 ? outerStatusValue : 90
    _internalState.current = innerStatusValue !== 0 ? innerStatusValue : 90
    _startDocumentsTime.current = date.length > 0 ? date[0].getTime() : null
    _endDocumentsTime.current = date.length > 0 ? date[1].getTime() : null
    setVisible(false)
    setContentList([])
    setCurrent(1)
    loadMoreLoading.current = true
    setNoMoreData(false)
    fetchContentList()
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

  /** 头部搜索 */
  const renderHeader = () => (
    <View className={styles['nav-extra']}>
      <View className={styles['nav-extra-search']}>
        <Search
          placeholder={intl.formatMessage({
            id: 'inquiry.xunjiadanhaoxunjiazhai',
            defaultMessage: '询价单号/询价摘要',
          })}
          value={keyword}
          onChange={(value) => setKeyword(value)}
          onSearch={(value) => handleSearchSubmit(value)}
          onClear={(value) => handleClearSubmit(value)}
          searchOnClearAction={false}
          clearable
        />
      </View>
      <View className={styles['nav-extra-filter']} onClick={() => setVisible(!visible)}>
        <Icons name="Filter" size={20} color="#252D37" />
      </View>
    </View>
  )
  const onTabChange = (activeKey: number) => {
    // _internalState.current = TAB_LIST[activeKey].key;
    setContentList([])
    setCurrent(1)
    loadMoreLoading.current = true
    setNoMoreData(false)
    _key.current = activeKey
    fetchContentList(1, false)
  }

  /** tab 切换 */
  const renderTab = () => (
    <View className={styles['inquiryListContainer-tabBar']}>
      <Tabs height="100%" current={_key.current} onClick={onTabChange} tabList={TAB_LIST} scroll />
    </View>
  )

  /**
   * @param fmt 时间参数
   * @returns 时间格式的文字
   */
  const fmtView = (fmt: string) => {
    const fmtText = fmt.split('')
    fmtText.splice(
      2,
      0,
      intl.formatMessage({
        id: 'inquiry.tian',
        defaultMessage: '天',
      }),
    )
    fmtText.splice(
      5,
      0,
      intl.formatMessage({
        id: 'inquiry.shi',
        defaultMessage: '时',
      }),
    )
    fmtText.splice(
      8,
      0,
      intl.formatMessage({
        id: 'inquiry.fen',
        defaultMessage: '分',
      }),
    )
    return (
      <Text className={styles['inquiryListContainer-inquiryTime']}>
        {fmtText.map((item: string) => (
          <>{item}</>
        ))}
      </Text>
    )
  }
  const handleLink = (code, id: number, PAGE?: string) => {
    preload({
      id,
      PAGE,
      refresh: () => {
        setContentList([])
        setCurrent(1)
        loadMoreLoading.current = true
        setNoMoreData(false)
        fetchContentList(1, false)
      },
    })
    Router.navigateTo(code, {
      id,
      PAGE,
    })
  }

  /** 列表数据 */
  const renderItem = ({ item }: { item: any }) => (
    <View
      className={styles['inquiryListContainer-boxSizeing']}
      onClick={() => handleLink('order/inquiry/inquiryDetail', item.id, 'PREVIEW')}
    >
      <View className={styles['inquiryListContainer-boxItem']}>
        <View className={styles['inquiryListContainer-boxTitlenNav']}>
          <View className={styles['inquiryListContainer-docsStatus']}>
            <View
              className={styles['inquiryListContainer-docsItem']}
              style={{
                backgroundColor: DOC_COLOR(item.externalState),
              }}
            />
            <Text className={styles['inquiryListContainer-docsStatusText']}>{item.externalStateName}</Text>
          </View>
          <Text className={styles['inquiryListContainer-stateName']}>{item.interiorStateName}</Text>
        </View>
        <View className={styles['inquiryListContainer-productTitleBox']}>
          <View className={styles['inquiryListContainer-productTitle']}>{item.details}</View>
        </View>
        <View className={styles['inquiryListContainer-productBox']}>
          <View className={styles['inquiryListContainer-procuctInfo']}>
            <View className={styles['inquiryListContainer-timeitem']}>
              <Icons name="Clock" className={styles['inquiryListContainer-timeIcons']} />
              {fmtView(interval(item.quotationAsTime))}
            </View>
            <View>
              <Text className={styles['inquiryListContainer-corpText']}>{item.memberName}</Text>
            </View>
          </View>
          <View className={styles['inquiryListContainer-procuctImage']}>
            <Image src={item.imgUrl} className={styles['inquiryListContainer-procuctImageItem']} />
          </View>
        </View>
        {_key.current !== 0 && (
          <View className={styles['inquiryListContainer-optionBox']}>
            {_key.current === 1 && (
              <View
                className={styles['inquiryListContainer-enterShopBtn']}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLink('order/inquiry/inquiryDetail', item.id, 'ONE')
                }}
              >
                <Text className={styles['inquiryListContainer-enterShopBtnText']}>
                  {intl.formatMessage({
                    id: 'inquiry.shenhe',
                    defaultMessage: '审核',
                  })}
                </Text>
              </View>
            )}
            {_key.current === 2 && (
              <View
                className={styles['inquiryListContainer-enterShopBtn']}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLink('order/inquiry/inquiryDetail', item.id, 'TWO')
                }}
              >
                <Text className={styles['inquiryListContainer-enterShopBtnText']}>
                  {intl.formatMessage({
                    id: 'inquiry.shenhe',
                    defaultMessage: '审核',
                  })}
                </Text>
              </View>
            )}
            {_key.current === 3 && (
              <View
                className={styles['inquiryListContainer-enterShopBtn']}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLink('order/inquiry/inquiryDetail', item.id, 'SUBMIT')
                }}
              >
                <Text className={styles['inquiryListContainer-enterShopBtnText']}>
                  {intl.formatMessage({
                    id: 'inquiry.tijiao',
                    defaultMessage: '提交',
                  })}
                </Text>
              </View>
            )}
          </View>
        )}
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
  const genIndicator = useCallback(() => {
    if (!noMoreDate) {
      return (
        <View className={styles['inquiryListContainer-indicatorContainer']}>
          <ActivityIndicator size={14} color="#909399" className={styles['inquiryListContainer-indicator']} />
          <Text className={styles['inquiryListContainer-indicatorText']}>
            {intl.formatMessage({
              id: 'inquiry.zhengzaijiazai',
              defaultMessage: '正在加载~',
            })}
          </Text>
        </View>
      )
    }
    return (
      <View className={styles['inquiryListContainer-indicatorContainer']}>
        <Text className={styles['inquiryListContainer-indicatorText']}>
          {intl.formatMessage({
            id: 'inquiry.meiyougengduola',
            defaultMessage: '没有更多啦~',
          })}
        </Text>
      </View>
    )
  }, [noMoreDate])
  useEffect(() => {
    _internalState.current = 90
    fetchContentList()
  }, [])
  // useEffect(() => {
  //   switch (route.params) {
  //     case 'ONE':
  //       flite.internalState = 2
  //       set_key.current('2')
  //       fetchContentList()
  //       break;
  //     case 'TWO':
  //       flite.internalState = 3
  //       set_key.current('3')
  //       fetchContentList()
  //       break;
  //     default:
  //       break
  //   }
  // }, [route.params])

  useDidShow(() => {
    fetchContentList()
  })
  return (
    <View
      className={styles['inquiryListContainer']}
      style={
        safeBottomHeight
          ? {
              paddingBottom: `${safeBottomHeight}PX`,
            }
          : {}
      }
    >
      <FilterModal.Status
        renderHeaderComponent={
          <View className={styles['inquiryListContainer-header']}>
            {renderHeader()}
            {renderTab()}
          </View>
        }
        outerStatus={outerStatus}
        innerStatus={innerStatus}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
      />
      {/* 加载的内容 */}
      <View className={styles['inquiryListContainer-scrollView']}>
        <ScrollView
          className={styles['inquiryListContainer-flatList']}
          data={contentList}
          renderItem={renderItem}
          keyExtractor={(item: any) => `scrollItem${item.id}`}
          onEndReachedThreshold={50}
          listFooterComponent={genIndicator}
          horizontal={false}
          onEndReached={() => {
            loadMoreData()
          }}
        />
      </View>
    </View>
  )
}
export default GlobalWrapper(InquiryListLayout)
