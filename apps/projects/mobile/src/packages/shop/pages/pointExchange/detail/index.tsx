import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { View, Text, ScrollView, ActivityIndicator, Toast } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import EmptyLayout from '@/components/Empty'
import { getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { getMemberMobileLrcRightShopDetailPage } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
interface ListParams {
  /**
   * 当前页
   */
  current?: number
  /**
   * 每页行数
   */
  pageSize?: number
}
type paramType = {
  shopId: number
  logo: string
  memberName: string
  memberId: number
  memberRoleId: number
}
const PAGE_SIZE = 10
const PointExchangeDetail = () => {
  const intl = useIntl()
  usePageInit()
  // setNavigationBarTitle({ title: intl.formatMessage({id: 'integral.jifenmingxi', defaultMessage: '积分明细'}) })
  const params = getCurrentInstance().router?.params || {}
  const [current, setCurrent] = useState<number>(1)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [pointDetailList, setPointDetailList] = useState<any[]>([])
  const loadMoreLoading = useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const { safeBottomHeight } = useSafeArea()
  const handleChangeTabIndex = (index: number) => {
    setCurrentIndex(index)
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
    if (current > 1 || pointDetailList.length > 0) {
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
    if (current === 1 && pointDetailList.length === 0) {
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
  const renderItem = ({ item }: { item: any }) => (
    <View
      className={styles['pointExchange-scrollItem']}
      style={{
        alignItems: 'center',
      }}
    >
      <View className={styles['pointExchange-scrollLable']}>
        <Text className={styles['pointExchange-scrollLableTitle']}>{item.operation}</Text>
        <Text className={styles['pointExchange-scrollLableDate']}>{item.date}</Text>
      </View>
      <Text
        className={cx(styles['pointExchange-countText'], item.type === 1 ? styles['pointExchange-reduceText'] : '')}
      >
        {/* {item.type === 1 ? "+" : "-"} */}
        {item.score}
      </Text>
    </View>
  )
  const fetchDataList = (currentPage?: number, merge: boolean = false) => {
    const param: any = {
      current: currentPage || current,
      pageSize: PAGE_SIZE,
      upperMemberId: params?.memberId,
      upperRoleId: params?.memberRoleId,
      type: currentIndex,
    }
    getMemberMobileLrcRightShopDetailPage(param, {
      showError: false,
    }).then((res) => {
      if (res.code !== 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          icon: 'none',
        })
        setNoMoreData(true)
        return
      }
      const { data } = res.data
      if (merge) {
        if (!data || data.length <= 0) {
          setNoMoreData(true)
          setCurrent(current - 1)
        } else {
          setPointDetailList([...pointDetailList, ...data])
          loadMoreLoading.current = false
        }
      } else {
        setPointDetailList(data)
        if (data.length < PAGE_SIZE) {
          setNoMoreData(true)
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
  useEffect(() => {
    fetchDataList()
  }, [currentIndex])
  return (
    <View
      className={styles['pointExchange']}
      style={
        safeBottomHeight
          ? {
              paddingBottom: `${safeBottomHeight}PX`,
            }
          : {}
      }
    >
      <View className={styles['pointExchange-tabs']}>
        <View className={styles['pointExchange-tabsItem']} onClick={() => handleChangeTabIndex(0)}>
          <Text
            className={cx(
              styles['pointExchange-tabsItemText'],
              currentIndex === 0 ? styles['pointExchange-tabsItemTextActive'] : '',
            )}
          >
            {intl.formatMessage({
              id: 'integral.quanbu',
              defaultMessage: '全部',
            })}
          </Text>
          {currentIndex === 0 && <View className="pointExchange-tabsItemActiveSplit" />}
        </View>
        <View className={styles['pointExchange-tabsItem']} onClick={() => handleChangeTabIndex(1)}>
          <Text
            className={cx(
              styles['pointExchange-tabsItemText'],
              currentIndex === 1 ? styles['pointExchange-tabsItemTextActive'] : '',
            )}
          >
            {intl.formatMessage({
              id: 'integral.huodejifen',
              defaultMessage: '获得积分',
            })}
          </Text>
          {currentIndex === 1 && <View className="pointExchange-tabsItemActiveSplit" />}
        </View>
        <View className={styles['pointExchange-tabsItem']} onClick={() => handleChangeTabIndex(2)}>
          <Text
            className={cx(
              styles['pointExchange-tabsItemText'],
              currentIndex === 2 ? styles['pointExchange-tabsItemTextActive'] : '',
            )}
          >
            {intl.formatMessage({
              id: 'integral.shiyongjifen',
              defaultMessage: '使用积分',
            })}
          </Text>
          {currentIndex === 2 && <View className="pointExchange-tabsItemActiveSplit" />}
        </View>
      </View>
      <View className={styles['pointExchange-scroll']}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#F4F5F7',
            height: '100%',
          }}
          renderItem={renderItem}
          data={pointDetailList}
          keyExtractor={(item) => `scrollItem${item.id}`}
          onEndReachedThreshold={50}
          onEndReached={loadMoreData}
          listFooterComponent={genIndicator}
        />
      </View>
    </View>
  )
}
export default GlobalWrapper(PointExchangeDetail)
