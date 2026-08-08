import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useRef, useEffect, Fragment } from 'react'
import { View, Text, Image, Tabs, Modal, Input, Icons, ActionSheet } from '@apps/mobile-ui'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import { Button, ScrollView } from '@tarojs/components'
import Loading from '@/components/Loading'
import ImageBox from '@/components/ImageBox'
import Search from '@/components/Search'
import cx from 'classnames'
import { observer } from 'mobx-react-lite'
import { PostTradeMobileAskPurchaseQuotePageResponseDetail, postTradeMobileAskPurchaseQuotePage } from '@apps/apis'
import { checkMore } from '@/utils'
import useCountdown from '@/hooks/useCountdown'
import Router from '@/utils/router'
import { preload } from '@apps/mobile-services/utils/taro'
import { dateFormat } from '@/utils/date'
import { RouterKeys } from '@/routes'
import { filterIcon } from '@/constants'
import Empty from '@/components/Empty'
import timeIcon from '../../list/time.png'
import { quoteStatusList } from '../../../constants'
import FilterModal from '../../../components/FilterModal'
import useMerchants from '../hooks/useMerchants'
import { PAGE_TYPE } from '../../detail'
import styles from './index.module.scss'
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
const EndTime = ({ quoteEndTime }: { quoteEndTime: string }) => {
  const { count, setTime } = useCountdown()
  const translate = useMobileIntl()
  useEffect(() => {
    if (quoteEndTime) {
      setTime(new Date(quoteEndTime.replace(' ', 'T')).getTime())
    }
  }, [quoteEndTime])
  return (
    <View className={styles['merchants-askpurchase-list-item-text']}>
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
              <Text className={styles['merchants-askpurchase-list-item-time']}>{count?.d}</Text>
              <Text>{translate('mobile.common.tian')}</Text>
            </Fragment>
          ) : null}
          {count?.h ? (
            <Fragment>
              <Text className={styles['merchants-askpurchase-list-item-time']}>{count?.h}</Text>
              <Text>{translate('mobile.common.hour')}</Text>
            </Fragment>
          ) : null}
          {count?.m ? (
            <Fragment>
              <Text className={styles['merchants-askpurchase-list-item-time']}>{count?.m}</Text>
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
const QuoteList = () => {
  const {
    modalVisible,
    optionModalVisible,
    modalTitle,
    optionItem,
    optionType,
    optionReson,
    setOptionType,
    setModalTitle,
    setOptionItem,
    setOptionReson,
    setOptionModalVisible,
    setModalVisible,
    handleDeleteItem,
    handleExpired,
  } = useMerchants()
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [dataList, setDataList] = useState<PostTradeMobileAskPurchaseQuotePageResponseDetail[]>([])
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const [filterParam, setFilterParam] = useState<Record<string, any>>()
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [activeKey, setActiveKey] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false) // 显示模态框
  const PAGE_SIZE = 8
  const translate = useMobileIntl()
  const TAB_LIST = [
    {
      title: translate('mobile.common.all'),
      key: 0,
    },
    {
      title: translate('mobile.resource.askPurchase.daitijiaoshenhe'),
      key: [1, 6, 7],
    },
    {
      title: translate('mobile.resource.askPurchase.daishenheyiji'),
      key: 2,
    },
    {
      title: translate('mobile.resource.askPurchase.daishenheerji'),
      key: 3,
    },
    {
      title: translate('mobile.resource.askPurchase.daitijiao'),
      key: 4,
    },
  ]
  const getDataList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }
    setLoading(true)
    return new Promise((resolve, reject) => {
      const payload: any = {
        current: pageRef.current,
        pageSize: PAGE_SIZE,
        ...(searchValue.current || {}),
        ...filterParam,
      }
      if (!payload.innerStatus && !payload.innerStatusList) {
        payload.innerStatusList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }
      postTradeMobileAskPurchaseQuotePage(payload, {
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
  }, [filterParam])
  const handleLink = (id: number, path: RouterKeys, PAGE?: PAGE_TYPE) => {
    preload({
      id,
      PAGE: PAGE || 'MERCHANTS_LIST',
      refresh: () => {
        handleRefresh()
      },
    })
    Router.navigateTo(path)
  }

  /* 头部点击事件 */
  const handleTabClick = (index: number) => {
    pageRef.current = 1
    setActiveKey(index)
    if (index) {
      if (Array.isArray(TAB_LIST[index].key)) {
        setFilterParam({
          ...filterParam,
          innerStatus: undefined,
          innerStatusList: TAB_LIST[index].key,
        })
      } else {
        setFilterParam({
          ...filterParam,
          innerStatus: TAB_LIST[index].key,
          innerStatusList: undefined,
        })
      }
    } else {
      setFilterParam({
        ...filterParam,
        innerStatus: undefined,
        innerStatusList: undefined,
      })
    }
  }

  /* 选着搜索条件 */
  const onSelect = (data: any) => {
    pageRef.current = 1
    setFilterParam({
      ...filterParam,
      ...data,
    })
  }
  const handleSearchSubmit = (value: string) => {
    pageRef.current = 1
    setFilterParam({
      ...filterParam,
      quoteSearchKeyword: value ? value : undefined,
    })
  }
  const handleConfirm = () => {
    if (optionItem) {
      if (optionType === 'expired') {
        handleExpired(optionItem.quoteId).then((result) => {
          if (result) {
            setModalVisible(false)
            handleRefresh()
          }
        })
      } else if (optionType === 'delete') {
        handleDeleteItem(optionItem.quoteId).then((result) => {
          if (result) {
            setModalVisible(false)
            handleRefresh()
          }
        })
      }
    }
  }
  const renderButtons = (data: PostTradeMobileAskPurchaseQuotePageResponseDetail) => {
    if (data.outerStatus === 10 && [2, 3, 4, 6, 7].includes(data.innerStatus)) {
      return (
        <View className={styles['bottom-buttons-wrap']}>
          <Button
            className={cx(styles['merchants-askpurchase-bottom-button'], styles.primary)}
            onClick={(e) => {
              e.stopPropagation()
              setOptionType('expired')
              setModalTitle(translate('mobile.resource.askPurchase.shifouguoqizuofei'))
              setOptionItem(data)
              setModalVisible(true)
            }}
          >
            {translate('mobile.resource.askPurchase.guoqizuofei')}
          </Button>
        </View>
      )
    }
    switch (data.innerStatus) {
      case 1:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['merchants-askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.quoteId, 'askPurchase/quoteDetail')
              }}
            >
              {translate('mobile.resource.askPurchase.tijiaoshenhe')}
            </Button>
            <Button
              className={cx(styles['merchants-askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                preload({
                  id: data.askPurchaseId,
                  quoteId: data.quoteId,
                  PAGE: 'MERCHANTS_LIST',
                  refresh: () => {
                    handleRefresh()
                  },
                })
                Router.navigateTo('askPurchase/add')
              }}
            >
              {translate('mobile.resource.askPurchase.xiugai')}
            </Button>
            <Button
              className={cx(styles['merchants-askpurchase-bottom-button'])}
              onClick={(e) => {
                e.stopPropagation()
                setOptionType('delete')
                setModalTitle(translate('mobile.resource.askPurchase.shifoushanchugaibaojiadan'))
                setOptionItem(data)
                setModalVisible(true)
              }}
            >
              {translate('mobile.resource.askPurchase.shanchu')}
            </Button>
          </View>
        )
      case 2:
      case 3:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['merchants-askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.quoteId, 'askPurchase/quoteDetail')
              }}
            >
              {translate('mobile.resource.askPurchase.shenhe')}
            </Button>
          </View>
        )
      case 4:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['merchants-askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.quoteId, 'askPurchase/quoteDetail')
              }}
            >
              {translate('mobile.resource.askPurchase.tijiao')}
            </Button>
          </View>
        )
      case 6:
      case 7:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['merchants-askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                preload({
                  id: data.askPurchaseId,
                  quoteId: data.quoteId,
                  PAGE: 'MERCHANTS_LIST',
                  refresh: () => {
                    handleRefresh()
                  },
                })
                Router.navigateTo('askPurchase/add')
              }}
            >
              {translate('mobile.resource.askPurchase.xiugai')}
            </Button>
            <Button
              className={cx(styles['merchants-askpurchase-bottom-button'])}
              onClick={(e) => {
                e.stopPropagation()
                setOptionType('delete')
                setModalTitle(translate('mobile.resource.askPurchase.shifoushanchugaibaojiadan'))
                setOptionItem(data)
                setModalVisible(true)
              }}
            >
              {translate('mobile.resource.askPurchase.shanchu')}
            </Button>
          </View>
        )
      default:
        return null
    }
  }
  return (
    <PageLayout
      style={{
        height: '100vh',
      }}
      renderHeader={
        <>
          <NavBar
            title={
              <Text
                style={{
                  fontSize: 14,
                }}
              >
                {translate('mobile.resource.askPurchase.baojiaguanli')}
              </Text>
            }
          />
          <View className={styles['page-wrap-search']}>
            <Search
              value={keyword}
              placeholder={translate('mobile.resource.askPurchase.baojiadanhaobaojiadanzhaiyao')}
              onChange={(value) => {
                setKeyword(value)
              }}
              onClear={handleSearchSubmit}
              onSearch={handleSearchSubmit}
              innerBackground="#F7F8FA"
              customClassName={styles['page-wrap-search-key']}
              shape="round"
              clearable
            />
            <Image src={filterIcon} onClick={() => setVisible(true)} />
          </View>
          <Tabs current={activeKey} tabList={TAB_LIST} onClick={handleTabClick} hideUnderLine scroll />
        </>
      }
    >
      {() => (
        <View className={styles['merchants-askpurchase-wrap']}>
          <ScrollView
            className={styles['merchants-askpurchase-scrollView']}
            onScrollToLower={handleLoadMore}
            scrollY
            refresherEnabled
            refresherTriggered={refreshing}
            scrollWithAnimation
            refresherBackground="transparent"
            onRefresherRefresh={handleRefresh}
            lowerThreshold={100}
          >
            {dataList && dataList.length > 0 ? (
              <View className={styles['merchants-askpurchase-list']}>
                {dataList.map((item, index) => (
                  <View className={styles['merchants-askpurchase-list-item']} key={`${item.askPurchaseId}-${index}`}>
                    <View className={styles['merchants-askpurchase-list-item-box']}>
                      {item.quoteId && (
                        <>
                          <View className={styles['merchants-askpurchase-list-item-box']}>
                            <View
                              className={styles['merchants-askpurchase-list-item-line']}
                              onClick={() => handleLink(item.quoteId, 'askPurchase/quoteDetail', 'MERCHANTS_DETAIL')}
                            >
                              <View className={cx(styles['merchants-askpurchase-list-item-tag'], styles.quote)}>
                                {translate('mobile.resource.askPurchase.bao')}
                              </View>
                              <View className={styles['merchants-askpurchase-list-item-name']}>
                                <Text>{item.quoteName}</Text>
                              </View>
                              <View className={styles['merchants-askpurchase-list-item-arrow']}>
                                <Icons name="ChevronRight" size={12} />
                              </View>
                            </View>
                            <View className={cx(styles['merchants-askpurchase-list-item-line'])}>
                              <View className={styles['merchants-askpurchase-list-item-left']}>
                                <View className={cx(styles['merchants-askpurchase-list-item-line'])}>
                                  <Text className={styles['merchants-askpurchase-list-item-purchaseMemberName']}>
                                    {dateFormat(new Date(item.quoteTime))}
                                  </Text>
                                  <View className={styles['merchants-askpurchase-list-item-outerStatus']}>
                                    <Text>{quoteStatusList[item.innerStatus]}</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                          <View className={cx(styles['merchants-askpurchase-list-item-split'])} />
                        </>
                      )}
                      <View
                        className={styles['merchants-askpurchase-list-item-line']}
                        onClick={() => handleLink(item.askPurchaseId, 'askPurchase/detail', 'MERCHANTS_LIST')}
                      >
                        <View className={styles['merchants-askpurchase-list-item-tag']}>
                          {translate('mobile.resource.askPurchase.xun')}
                        </View>
                        <View className={styles['merchants-askpurchase-list-item-name']}>
                          <Text>{item.name}</Text>
                        </View>
                        <View className={styles['merchants-askpurchase-list-item-arrow']}>
                          <Icons name="ChevronRight" size={12} />
                        </View>
                      </View>
                      <View
                        className={cx(styles['merchants-askpurchase-list-item-line'])}
                        style={{
                          marginBottom: 12,
                        }}
                      >
                        <View className={styles['merchants-askpurchase-list-item-left']}>
                          <View className={cx(styles['merchants-askpurchase-list-item-line'])}>
                            <EndTime quoteEndTime={item.quoteEndTime} />
                          </View>
                        </View>
                      </View>
                      <View
                        className={styles['merchants-askpurchase-list-item-line']}
                        style={{
                          marginBottom: 8,
                        }}
                      >
                        <Text className={styles['merchants-askpurchase-list-item-purchaseMemberName']}>
                          {item.purchaseMemberName}
                        </Text>
                      </View>
                      <View className={cx(styles['merchants-askpurchase-list-item-line'], styles.flexEnd)}>
                        {renderButtons(item)}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              !loading && <Empty />
            )}
            <Loading loading={loading} noMore={!hasMore} />
          </ScrollView>
          {/* 搜索条件 */}
          <FilterModal visible={visible} onClose={() => setVisible(false)} onSelect={onSelect} searchValue={keyword} />
          <Modal
            title={modalTitle}
            isOpened={modalVisible}
            onConfirm={handleConfirm}
            onCancel={() => {
              setModalVisible(false)
            }}
            cancelText={translate('mobile.common.cancel')}
            confirmText={translate('mobile.common.confirm')}
            className={styles['order-model']}
          />
          <ActionSheet
            isOpened={optionModalVisible}
            onClose={() => setOptionModalVisible(false)}
            customContainerStyle={styles['ActionSheet-round']}
          >
            <View className={styles['ActionSheet-wrap']}>
              <View className={styles['ActionSheet-title']}>
                {optionType === 'invalid'
                  ? translate('mobile.resource.askPurchase.zuofei')
                  : translate('mobile.resource.askPurchase.zhongzhi')}
              </View>
              <View className={styles['ActionSheet-content']}>
                <View className={styles['ActionSheet-formItem']}>
                  <Text className={styles['ActionSheet-formItem-label']}>
                    {optionType === 'invalid'
                      ? translate('mobile.resource.askPurchase.zuofeishijian')
                      : translate('mobile.resource.askPurchase.zhongzhishijian')}
                  </Text>
                  <View className={styles['ActionSheet-formItem-content']}>
                    <Input disabled value={dateFormat(new Date())} />
                  </View>
                </View>
                <View className={styles['ActionSheet-formItem']}>
                  <Text className={styles['ActionSheet-formItem-label']}>
                    {optionType === 'invalid'
                      ? translate('mobile.resource.askPurchase.zuofeiyuanyin')
                      : translate('mobile.resource.askPurchase.zhongzhiyuanyin')}
                  </Text>
                  <View className={styles['ActionSheet-formItem-content']}>
                    <Input
                      type="text"
                      value={optionReson}
                      placeholder={translate('mobile.common.qingshuru')}
                      onChange={(val: any) => setOptionReson(val)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ActionSheet>
        </View>
      )}
    </PageLayout>
  )
}
export default GlobalWrapper(observer(QuoteList))
