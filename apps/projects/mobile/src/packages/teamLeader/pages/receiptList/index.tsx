import React, { useRef, useEffect, useState } from 'react'
import { View, Icons, Input, Image, Text, ScrollView } from '@apps/mobile-ui'
import GlobalWrapper from '@/components/GlobalWrapper'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import { postOrderMobileCbgTeamLeaderDeliveryList } from '@apps/apis'
import styles from './index.module.scss'
import cx from 'classnames'
const choice = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/choice.png'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { pxTransform, useRouter, showToast, showLoading, hideLoading, useDidShow } from '@apps/mobile-services/utils/taro'
import FilterModal from '@/packages/teamLeader/components/filterModal'
import { getDateOptions } from '@/packages/teamLeader/components/filterModal/commonlyFn/filterOptions'
import Router from '@/utils/router'

const TeamLeaderReceiptList: React.FC<{}> = () => {
  const intl = useIntl()
  const router = useRouter()
  // 根据携带的路由参数修改对应的tab状态，默认为0
  const statusValue = Number(router.params?.statusValue ?? 0)
  // 分页-是否还有更多
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  // 下拉刷新
  const [refreshing, setRefreshing] = useState(false)
  // 搜索参数
  const [searchForm, setSearchForm] = useState<any>({
    type: statusValue,
    keyword: "",
    current: 1,
    pageSize: 10
  })
  const hasLoadedRef = useRef(false)
  // tabs栏
  const tabs = [
    { status: 0, label: intl.formatMessage({ id: 'teamLeader.quanbu', defaultMessage: '全部' }) },
    { status: 1, label: intl.formatMessage({ id: 'teamLeader.beihuozhong', defaultMessage: '备货中' }) },
    { status: 2, label: intl.formatMessage({ id: 'teamLeader.peisongzhong', defaultMessage: '配送中' }) },
    { status: 3, label: intl.formatMessage({ id: 'teamLeader.yisongda', defaultMessage: '已送达' }) },
  ]
  const [inputKeyword, setInputKeyword] = useState('')
  // 收货单列表
  const [deliveryOrderList, setDeliveryOrderList] = useState<any>([])

  // 显示模态框
  const [visible, setVisible] = useState<boolean>(false)
  const dateOptions = getDateOptions(intl)

  // 获取团长收货单列表
  const getDeliveryOrderList = async (loadMore = false) => {
    if (loading) return
    setLoading(true)
    showLoading({
      title: intl.formatMessage({
        id: 'teamLeader.jiazaizhong',
        defaultMessage: '加载中',
      }),
      mask: true,
    })
    try {
      const res = await postOrderMobileCbgTeamLeaderDeliveryList(searchForm)
      hideLoading()
      if (res.code === 1000) {
        const list = res.data?.data || []
        // 总条数
        const total = res.data?.totalCount || 0
        const newList = loadMore ? [...deliveryOrderList, ...list] : list
        setDeliveryOrderList(newList)
        setHasMore(newList.length < total)
      } else {
        showToast({
          title: res?.message || intl.formatMessage({
            id: 'teamLeader.huoquliebiaoshibai',
            defaultMessage: '获取列表失败',
          }),
          icon: 'none',
        })
      }
    } catch (error) {
      hideLoading()
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.huoquliebiaoshibai',
          defaultMessage: '获取列表失败',
        }),
        icon: 'none',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 切换tabs栏
  const handleActiveTab = (status: number) => {
    setSearchForm(prev => ({
      ...prev,
      type: status,
      current: 1
    }))
  }
  // 输入触发查询
  const handleSearchKeyword = (val: string) => {
    setInputKeyword(val)
  }
  // 点击触发查询
  const handleSearch = () => {
    setSearchForm(prev => ({
      ...prev,
      keyword: inputKeyword,
      current: 1,
    }))
  }

  useDidShow(() => {
    if (hasLoadedRef.current) {
      // 非首次进入页面，才进行刷新
      setSearchForm(prev => ({
        ...prev,
        current: 1,
      }))
      getDeliveryOrderList(false)
    } else {
      // 首次进入页面，只标记，不做任何事（由 useEffect 中控制请求）
      hasLoadedRef.current = true
    }
  })

  useEffect(() => {
    getDeliveryOrderList(false)
  }, [searchForm.type, searchForm.keyword])

  useEffect(() => {
    if (searchForm.current > 1) {
      getDeliveryOrderList(true)
    }
  }, [searchForm.current])


  // 上拉加载更多
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    setSearchForm(prev => ({...prev, current: prev.current + 1,}))
  }

  // 下拉刷新
  const handleRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    setSearchForm(prev => ({ ...prev, current: 1 }))
    getDeliveryOrderList(false)
  }

  // 确认收货
  const handleConfirmReceipt = (item: any) => {
    Router.navigateTo('teamLeader/receiptDetail', {
      orderId: item.id,
      vendorMemberId: item.vendorMemberId
    })
  }

  const handleConfirm = (outerStatusValue: number, innerStatusValue: number, date: any[]) => {
    console.log(outerStatusValue, innerStatusValue, date)
    // 毫秒
    const startTime = date.length > 0 ? date[0].getTime() : null
    const endTime = date.length > 0 ? date[1].getTime() : null
    setVisible(false)
    console.log(startTime, endTime)
  }

  const toDetails = item => {
    Router.navigateTo('teamLeader/receiptDetail', {
      orderId: item.id,
      vendorMemberId: item.vendorMemberId
    })
  }

  // 头部
  const renderHeader = () => (
    <View className={styles['receipt-top']}>
      <View className={styles['receipt-search']}>
        <Icons name="Search" size={17} color="#999999" />
        <Input
          className={styles['receipt-search-input']}
          placeholder={intl.formatMessage({
            id: 'teamLeader.shangpinmingchengkehudingdanbianhao',
            defaultMessage: '商品名称/客户/订单编号',
          })}
          placeholderClass={styles['receipt-search-placeholder']}
          value={inputKeyword}
          onChange={handleSearchKeyword}
          onConfirm={handleSearch}
        />
        <View className={styles['receipt-search-button']} onClick={handleSearch}>
          {intl.formatMessage({ id: 'teamLeader.sousuo', defaultMessage: '搜索' })}
        </View>
      </View>
      {/*<Image className={styles['receipt-icon']} src={choice} onClick={() => setVisible(!visible)} />*/}
    </View>
  )
  // tab
  const renderTab = () => (
    <View className={styles['tabs']}>
      {tabs.map(tab => (
        <View
          key={tab.status}
          className={cx(styles['tab'], {
            [styles['tab-active']]: tab.status === searchForm.type,
          })}
          onClick={() => handleActiveTab(tab.status)}
        >
          <Text>{tab.label}</Text>
        </View>
      ))}
    </View>
  )
  // 列表
  const renderItem = ({ item }: { item: any }) => {
    return (
      <View className={styles['box']} onClick={() => toDetails(item)}>
        <View className={styles['box-top']}>
          <View className={styles['box-top-left']}>
            <Image className={styles['box-top-left-img']} src={item.vendorLogo} />
            <Text className={styles['box-top-left-text']}>{item.vendorName}</Text>
            <Icons name={'ChevronRight'} size={12} color="#C8CACD" />
          </View>
          <Text
            className={cx(
              styles['box-top-right'],
              `${item.statusStr === "配送中" ? styles['box-top-right-color1'] : 'box-top-right-color2'}`,
            )}
          >
            {item.statusStr}
          </Text>
        </View>
        <View className={styles['box-content']}>
          <Text className={styles['box-content-text']}>
            {intl.formatMessage({ id: 'teamLeader.shouhuodanhao', defaultMessage: '收货单号：' })}
            {item.deliveryNo}
          </Text>
          <Text className={styles['box-content-text']}>
            {intl.formatMessage({ id: 'teamLeader.mingxi', defaultMessage: '明细：' })}
            {intl.formatMessage({ id: 'teamLeader.yingshou', defaultMessage: '应收' })}
            {item.num}
            {intl.formatMessage({ id: 'teamLeader.jian', defaultMessage: '件' })}
            {intl.formatMessage({ id: 'teamLeader.shangpin', defaultMessage: '商品' })}
          </Text>
        </View>
        {item.statusStr === "配送中" && (
          <View className={styles['box-bottom']}>
            {/*<View className={styles['box-button']} style={{marginRight: pxTransform(8)}}>*/}
            {/*  {intl.formatMessage({ id: 'teamLeader.chakanwuliu', defaultMessage: '查看物流' })}*/}
            {/*</View>*/}
            <View
              className={styles['box-button']}
              onClick={e => {
                e.stopPropagation()
                handleConfirmReceipt(item)
              }}
            >
              {intl.formatMessage({ id: 'teamLeader.querenshouhuo', defaultMessage: '确认收货' })}
            </View>
          </View>
        )}
      </View>
    )
  }

  return (
    <View className={styles['receipt']}>
      <FilterModal
        renderHeaderComponent={
          <View>
            {renderHeader()}
            {/* 不需要显示tab */}
            {/*{renderTab()}*/}
          </View>
        }
        visible={visible}
        // 不显示外部状态
        showOuterStatus={false}
        // 不显示内部状态
        showInnerStatus={false}
        // 传入时间选项数组
        dateOptions={dateOptions}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
      />
      {renderTab()}
      <View className={styles['receipt-box']}>
        <ScrollView
          scrollY
          data={deliveryOrderList}
          lowerThreshold={80}
          onScrollToLower={handleLoadMore}
          refresherEnabled={true}
          refreshing={refreshing}
          onRefresherRefresh={handleRefresh}
          className={styles['scroll-list']}
          renderItem={renderItem}
          listEmptyComponent={<Empty />}
          listFooterComponent={
            searchForm.current > 1 && deliveryOrderList.length > 0 ? (
              <Loading loading={loading} noMore={!hasMore && !loading} customStyle={{ marginTop: pxTransform(14) }} />
            ) : null
          }
        ></ScrollView>
      </View>
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderReceiptList))
