import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useRef, useEffect, Fragment } from 'react'
import { View, Text, Image, Tabs, Modal, Input, ActionSheet, Toast } from '@apps/mobile-ui'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import { Button, ScrollView } from '@tarojs/components'
import Loading from '@/components/Loading'
import ImageBox from '@/components/ImageBox'
import Search from '@/components/Search'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { observer } from 'mobx-react-lite'
import { PostTradeMobileAskPurchasePageResponseDetail, postTradeMobileAskPurchasePage } from '@apps/apis'
import { checkMore } from '@/utils'
import useCountdown from '@/hooks/useCountdown'
import Router from '@/utils/router'
import { preload } from '@apps/mobile-services/utils/taro'
import { RouterKeys } from '@/routes'
import { filterIcon } from '@/constants'
import Empty from '@/components/Empty'
import Popover from '@/components/Popover'
import timeIcon from '../../list/time.png'
import { innerStatusList } from '../../../constants'
import FilterModal from '../../../components/FilterModal'
import useBuyerList from '../hooks'
import { dateFormat } from '@/utils/date'
import { useMobileIntl } from '@apps/locales'
import styles from './index.module.scss'
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
const AskPurchaseList = () => {
  const {
    modalVisible,
    optionModalVisible,
    modalTitle,
    optionItem,
    optionType,
    optionReson,
    handleInvalid,
    handleStop,
    setOptionReson,
    setOptionType,
    setOptionModalVisible,
    setModalVisible,
    setOptionItem,
    setModalTitle,
    handleDeleteItem,
  } = useBuyerList()
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [dataList, setDataList] = useState<PostTradeMobileAskPurchasePageResponseDetail[]>([])
  const pageRef = useRef<number>(1)
  const searchValue = useRef<ListParams>({})
  const [filterParam, setFilterParam] = useState<Record<string, any>>()
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [activeKey, setActiveKey] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(false) // 显示模态框
  const PAGE_SIZE = 8
  const intl = useIntl()
  const translate = useMobileIntl()
  const TAB_LIST = [
    {
      title: translate('mobile.common.all'),
      key: 0,
    },
    {
      title: translate('mobile.resource.askPurchase.daifabu'),
      key: 1,
    },
    {
      title: translate('mobile.resource.askPurchase.daibaojia'),
      key: 2,
    },
    {
      title: translate('mobile.resource.askPurchase.daibijia'),
      key: 3,
    },
    {
      title: translate('mobile.resource.askPurchase.daishenheshoubiaoyiji'),
      key: 4,
    },
    {
      title: translate('mobile.resource.askPurchase.daishenheshoubiaoerji'),
      key: 5,
    },
    {
      title: translate('mobile.resource.askPurchase.daishenheshoubiaobutongguoyiji'),
      key: 6,
    },
    {
      title: translate('mobile.resource.askPurchase.daishenheshoubiaobutongguoerji'),
      key: 7,
    },
    {
      title: translate('mobile.resource.askPurchase.daiqueren'),
      key: 8,
    },
    {
      title: translate('mobile.resource.askPurchase.yiwancheng'),
      key: 9,
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
      postTradeMobileAskPurchasePage(payload, {
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
  const handleLink = (id: number, awardBidQuoteId: number | undefined, path: RouterKeys, PAGE?: string) => {
    preload({
      id,
      awardBidQuoteId,
      PAGE: PAGE || 'BUYER_LIST',
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
      setFilterParam({
        ...filterParam,
        status: TAB_LIST[index].key,
      })
    } else {
      setFilterParam({
        ...filterParam,
        status: undefined,
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
      searchKeyword: value ? value : undefined,
    })
  }
  const handleConfirm = () => {
    if (optionItem) {
      if (optionType === 'stop') {
        handleStop(optionItem.id).then((result) => {
          if (result) {
            setModalVisible(false)
            handleRefresh()
          }
        })
      } else {
        handleDeleteItem(optionItem.id).then((result) => {
          if (result) {
            setModalVisible(false)
            handleRefresh()
          }
        })
      }
    }
  }
  const handleOptionConfirm = () => {
    if (optionItem) {
      if (!optionReson) {
        Toast.show({
          title: translate('mobile.resource.askPurchase.qingshuruyuanyin'),
          icon: 'none',
        })
        return
      }
      if (optionType === 'invalid') {
        handleInvalid(optionItem.id, optionReson).then((result) => {
          if (result) {
            setOptionModalVisible(false)
            handleRefresh()
          }
        })
      } else {
        handleStop(optionItem.id).then((result) => {
          if (result) {
            setOptionModalVisible(false)
            handleRefresh()
          }
        })
      }
    }
  }
  const renderButtons = (data: PostTradeMobileAskPurchasePageResponseDetail) => {
    switch (data.status) {
      case 1:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.id, data.awardBidQuoteId, 'askPurchase/detail')
              }}
            >
              {translate('mobile.resource.askPurchase.fabu')}
            </Button>
            <Button
              className={styles['askpurchase-bottom-button']}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.id, undefined, 'askPurchase/buyer/edit')
              }}
            >
              {translate('mobile.resource.askPurchase.xiugai')}
            </Button>
            <Button
              className={styles['askpurchase-bottom-button']}
              onClick={(e) => {
                e.stopPropagation()
                setOptionType('delete')
                setModalTitle(translate('mobile.resource.askPurchase.shifoushanchuxunyuanxuqiudan'))
                setOptionItem(data)
                setModalVisible(true)
              }}
            >
              {translate('mobile.resource.askPurchase.shanchu')}
            </Button>
          </View>
        )
      case 2:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            {data.quoteCount > 0 && (
              <Button
                className={cx(styles['askpurchase-bottom-button'], styles.primary)}
                onClick={(e) => {
                  e.stopPropagation()
                  setOptionType('stop')
                  setModalTitle(translate('mobile.resource.askPurchase.shifoutiqianjieshudangqianbaojia'))
                  setOptionItem(data)
                  setModalVisible(true)
                }}
              >
                {translate('mobile.resource.askPurchase.jieshubaojia')}
              </Button>
            )}
          </View>
        )
      case 3:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.id, data.awardBidQuoteId, 'askPurchase/detail')
              }}
            >
              {translate('mobile.resource.askPurchase.bijia')}
            </Button>
          </View>
        )
      case 4:
      case 5:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.id, data.awardBidQuoteId, 'askPurchase/detail')
              }}
            >
              {translate('mobile.resource.askPurchase.shenhe')}
            </Button>
          </View>
        )
      case 6:
      case 7:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.id, data.awardBidQuoteId, 'askPurchase/detail')
              }}
            >
              {translate('mobile.resource.askPurchase.xiugaishoubaiojieguo')}
            </Button>
          </View>
        )
      case 8:
        return (
          <View className={styles['bottom-buttons-wrap']}>
            <Button
              className={cx(styles['askpurchase-bottom-button'], styles.primary)}
              onClick={(e) => {
                e.stopPropagation()
                handleLink(data.id, data.awardBidQuoteId, 'askPurchase/detail')
              }}
            >
              {translate('mobile.resource.askPurchase.querenbaojia')}
            </Button>
          </View>
        )
      case 9:
        const isExpired = new Date().getTime() > new Date(data.quoteEndTime.replace(' ', 'T')).getTime()
        return (
          !isExpired && (
            <View className={styles['bottom-buttons-wrap']}>
              <Button
                className={cx(styles['askpurchase-bottom-button'], styles.primary)}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLink(data.id, data.awardBidQuoteId, 'askPurchase/detail')
                }}
              >
                {translate('mobile.resource.askPurchase.shengchengdingdan')}
              </Button>
            </View>
          )
        )
      default:
        return null
    }
  }
  return (
    <PageLayout
      className={styles['askpurchase-page']}
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
                {translate('mobile.resource.askPurchase.xunyuanxuqiu')}
              </Text>
            }
          />
          <View className={styles['page-wrap-search']}>
            <Search
              value={keyword}
              background="#FDF9F5"
              placeholder={translate('mobile.resource.askPurchase.caigouxunyuandanhaoxunyuanzhaiyao')}
              onChange={(value) => {
                setKeyword(value)
              }}
              onClear={handleSearchSubmit}
              onSearch={handleSearchSubmit}
              innerBackground="#FCF7F1"
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
            {dataList && dataList.length > 0 ? (
              <View className={styles['askpurchase-list']}>
                {dataList.map((item, index) => (
                  <View
                    className={styles['askpurchase-list-item']}
                    key={`${item.id}-${index}`}
                    onClick={() => handleLink(item.id, item.awardBidQuoteId, 'askPurchase/detail', 'BUYER_DETAIL')}
                  >
                    <View
                      className={styles['askpurchase-list-item-line']}
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      <View className={styles['askpurchase-list-item-outerStatus']}>
                        <Text>{innerStatusList[item.status]}</Text>
                      </View>
                    </View>
                    <View
                      className={styles['askpurchase-list-item-line']}
                      style={{
                        marginBottom: 16,
                      }}
                    >
                      <View className={styles['askpurchase-list-item-name']}>
                        <Text>{item.name}</Text>
                      </View>
                    </View>
                    <View className={cx(styles['askpurchase-list-item-line'], styles.flexEnd)}>
                      <View className={styles['askpurchase-list-item-left']}>
                        <View className={cx(styles['askpurchase-list-item-line'], styles.column)}>
                          <EndTime quoteEndTime={item.quoteEndTime} />
                          {item.status !== 1 && item.status !== 12 && item.status !== 11 && (
                            <View className={styles['askpurchase-more-wrap']}>
                              <Popover
                                options={[
                                  {
                                    label: translate('mobile.resource.askPurchase.chakanbaojia'),
                                    visible: item.quoteCount > 0 || item.status === 9,
                                    onClick: () => {
                                      Router.navigateTo('askPurchase/offerDetail', {
                                        id: item.id,
                                      })
                                    },
                                  },
                                  {
                                    label: translate('mobile.resource.askPurchase.zuofei'),
                                    visible: item.status !== 9,
                                    onClick: () => {
                                      setOptionType('invalid')
                                      setOptionItem(item)
                                      setOptionModalVisible(true)
                                    },
                                  },
                                ]}
                              >
                                <Text className={styles['askpurchase-more-text']}>
                                  {translate('mobile.common.more')}
                                </Text>
                              </Popover>
                            </View>
                          )}
                        </View>
                      </View>
                      {renderButtons(item)}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              !loading && <Empty />
            )}
            <Loading loading={loading} noMore={!hasMore} />
          </ScrollView>
          <View className={styles['button-wrap']}>
            <Button className={styles['add-button']} onClick={() => handleLink(0, undefined, 'askPurchase/buyer/add')}>
              {translate('mobile.resource.askPurchase.xinzengxunyuanxuqiudan')}
            </Button>
          </View>
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
              <View onClick={handleOptionConfirm} className={cx(styles['ActionSheet-button-wrap'])}>
                <Button className={cx(styles['ActionSheet-button'])}>
                  {intl.formatMessage({
                    id: 'order.queding',
                    defaultMessage: '确定',
                  })}
                </Button>
              </View>
            </View>
          </ActionSheet>
        </View>
      )}
    </PageLayout>
  )
}
export default GlobalWrapper(observer(AskPurchaseList))
