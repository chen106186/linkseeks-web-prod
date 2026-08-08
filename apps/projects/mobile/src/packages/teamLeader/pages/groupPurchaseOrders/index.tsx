import React, { useRef, useState, useEffect } from 'react'
import GlobalWrapper from '@/components/GlobalWrapper'
import { observer } from 'mobx-react-lite'
import { Icons, Image, Input, ScrollView, Text, View } from '@apps/mobile-ui'
import styles from './index.module.scss'
import { useIntl } from '@linkseeks/i18n'
import FilterModal from '@/packages/teamLeader/components/filterModal'
import {
  getDateOptions,
  getDateOptionsGroup,
  getInnerStatus,
  getOuterStatus,
} from '@/packages/teamLeader/components/filterModal/commonlyFn/filterOptions'
import cx from 'classnames'
import {
  pxTransform,
  useRouter,
  showToast,
  showLoading,
  hideLoading,
  useDidShow,
  showModal,
} from '@apps/mobile-services/utils/taro'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { formatDateFromTimestamp, formatPriceParts } from '../../utils/formatter'

import { postOrderMobileCbgTeamLeaderBuyerOrderList, getOrderMobileCbgTeamLeaderOrderNotice } from '@apps/apis'
import Router from '@/utils/router'

const choice = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/choice.png'

const TeamLeaderGroupPurchaseOrders: React.FC<{}> = () => {
  const intl = useIntl()
  const router = useRouter()
  const statusValue = Number(router.params?.statusValue ?? 0)
  const outerStatusMap: Record<number, number> = {
    1: 11,
    2: 13,
    3: 100,
  }
  const [outerStatus, setOuterStatus] = useState<number | null>(outerStatusMap[statusValue] ?? null)
  const [searchForm, setSearchForm] = useState<any>({
    keyword: '',
    current: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    innerStatus: null,
    ...(outerStatus !== null ? { outerStatus: outerStatus } : { outerStatus: null }),
  })
  // tabs栏
  const tabs = [
    { status: 0, label: intl.formatMessage({ id: 'teamLeader.quanbu', defaultMessage: '全部' }) },
    { status: 1, label: intl.formatMessage({ id: 'teamLeader.daifahuo', defaultMessage: '待发货' }) },
    { status: 2, label: intl.formatMessage({ id: 'teamLeader.daishouhuodaiquhuo', defaultMessage: '待收货/待取货' }) },
    { status: 3, label: intl.formatMessage({ id: 'teamLeader.yiwancheng', defaultMessage: '已完成' }) },
  ]
  const [activeTab, setActiveTab] = useState(statusValue)

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  // 显示模态框
  const [visible, setVisible] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const hasLoadedRef = useRef(false)

  useDidShow(() => {
    if (hasLoadedRef.current) {
      // 非首次进入页面，才进行刷新
      setSearchForm((prev) => ({
        ...prev,
        current: 1,
      }))
      getOrderList(false)
    } else {
      // 首次进入页面，只标记，不做任何事（由 useEffect 中控制请求）
      hasLoadedRef.current = true
    }
  })

  useEffect(() => {
    getOrderList(false)
  }, [searchForm.outerStatus, searchForm.keyword, searchForm.startDate, searchForm.endDate])

  // 切换tabs栏
  const handleActiveTab = (status: number) => {
    setActiveTab(status)
    const mappedStatus = outerStatusMap[status] ?? null
    setOuterStatus(mappedStatus)
    setSearchForm((prev) => ({
      ...prev,
      ...(mappedStatus !== null ? { outerStatus: mappedStatus } : { outerStatus: null }),
      current: 1,
    }))
  }

  // 查询
  const [searchKeyword, setSearchKeyword] = useState('')
  const handleSearchKeyword = (val: string) => {
    setSearchKeyword(val)
  }
  // 点击触发查询
  const handleSearch = () => {
    setSearchForm((prev) => ({
      ...prev,
      keyword: searchKeyword,
      current: 1,
    }))
  }

  // const outerStatus = getOuterStatus(intl)
  // const innerStatus = getInnerStatus(intl)
  const dateOptions = getDateOptions(intl)
  const dateOptionsGroup = getDateOptionsGroup(intl)
  // 右侧抽屉选择
  const handleFilterModalConfirm = (outerStatusValue: number, innerStatusValue: number, date: any[]) => {
    console.log(outerStatusValue, innerStatusValue, date)
    // 毫秒
    const startTime = date.length > 0 ? date[0].getTime() : null
    const endTime = date.length > 0 ? date[1].getTime() : null
    setVisible(false)
    setSearchForm((prev) => ({
      ...prev,
      startDate: formatDateFromTimestamp(startTime, 2),
      endDate: formatDateFromTimestamp(endTime, 2),
      current: 1,
    }))
  }

  const getOrderList = async (loadMore = false) => {
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
      const res = await postOrderMobileCbgTeamLeaderBuyerOrderList(searchForm)
      if (res.code === 1000) {
        const orderList = res.data?.data || []
        // 总条数
        const total = res.data?.totalCount || 0
        const newList = loadMore ? [...list, ...orderList] : orderList
        setList(newList)
        console.log('newList', newList.length)
        console.log('total', total)
        setHasMore(newList.length < total)
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
      hideLoading()
    }
  }

  // 上拉加载更多
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    setSearchForm((prev) => ({ ...prev, current: prev.current + 1 }))
  }

  useEffect(() => {
    if (searchForm.current > 1) {
      getOrderList(true)
    }
  }, [searchForm.current])

  // 下拉刷新
  const handleRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    setSearchForm((prev) => ({ ...prev, current: 1 }))
    getOrderList(false)
  }

  const splitPrice = (price: number | string): { intPart: string; decimalPart: string } => {
    if (price == null || price === '') {
      return { intPart: '0', decimalPart: '.00' }
    }
    const num = Number(price)
    if (isNaN(num)) return { intPart: String(price), decimalPart: '' }
    const str = String(price)
    const [rawInt, rawDec = ''] = str.split('.')
    // 截断小数点后两位，不四舍五入
    const truncatedDecimal = rawDec.slice(0, 2).padEnd(2, '0')
    // 整数部分加千分位
    const formattedInt = Number(rawInt).toLocaleString()
    return {
      intPart: formattedInt,
      decimalPart: `.${truncatedDecimal}`,
    }
  }

  // 代客取货
  const handleTake = (orderId) => {
    Router.navigateTo('teamLeader/agentPickup', { orderId: orderId, enterType: 2 })
  }

  // 到货通知
  const handleNotice = (orderId) => {
    showModal({
      title: '',
      confirmText: intl.formatMessage({
        id: 'confirm',
        defaultMessage: '确认',
      }),
      cancelText: intl.formatMessage({
        id: 'cancel',
        defaultMessage: '取消',
      }),
      content: intl.formatMessage({
        id: 'teamLeader.shifouquerentongzhi',
        defaultMessage: '是否确认通知？',
      }),
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          getOrderMobileCbgTeamLeaderOrderNotice({ orderId }).then((res) => {
            if (res.code === 1000) {
              showToast({
                title: res.message,
                icon: 'none',
              })
              setTimeout(() => {
                setSearchForm((prev) => ({ ...prev, current: 1 }))
                getOrderList(false)
              }, 1000)
            } else {
              showToast({
                title: res.message,
                icon: 'none',
              })
            }
          })
        }
      },
    })
  }

  const toSelfPickup = (item) => {
    const orderId: string = item.orderId
    Router.navigateTo('teamLeader/selfPickup', { orderId })
  }

  const getTotalQuantity = (products: { quantity: number }[]) => {
    return products.reduce((total, item) => {
      return total + (Number(item.quantity) || 0)
    }, 0)
  }

  // 头部
  const renderHeader = () => (
    <View className={styles['top']}>
      <View className={styles['search']}>
        <Icons name="Search" size={17} color="#999999" />
        <Input
          className={styles['search-input']}
          placeholder={intl.formatMessage({
            id: 'teamLeader.shangpinmingchengkehudingdanbianhao',
            defaultMessage: '商品名称/客户/订单编号',
          })}
          placeholderClass={styles['search-placeholder']}
          value={searchKeyword}
          onChange={handleSearchKeyword}
          onConfirm={handleSearch}
        />
        <View className={styles['search-button']} onClick={handleSearch}>
          {intl.formatMessage({ id: 'teamLeader.sousuo', defaultMessage: '搜索' })}
        </View>
      </View>
      <Image className={styles['search-icon']} src={choice} onClick={() => setVisible(!visible)} />
    </View>
  )

  // tab
  const renderTab = () => (
    <View className={styles['tabs']}>
      {tabs.map((tab, index) => (
        <View
          key={tab.status}
          className={cx(styles['tab'], styles[`tab-width-${index + 1}`], {
            [styles['tab-active']]: tab.status === activeTab,
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
      <View className={styles['commodity']} onClick={() => toSelfPickup(item)}>
        <View className={styles['commodity-top']}>
          <View className={styles['commodity-top-left']}>
            <Image className={styles['commodity-top-img']} src={item.receiveImage} />
            <Text className={styles['commodity-top-text']}>{item.receiveName}</Text>
            <Text className={styles['commodity-top-text']}>{item.receivePhone}</Text>
          </View>
          <Text
            className={styles['commodity-top-right']}
            style={{ color: item.statusStr === '已完成' ? '#979797' : '#F77900' }}
          >
            {item.statusStr}
          </Text>
        </View>

        <View className={styles['commodity-box']}>
          {item?.products.map((sub: any) => (
            <View className={styles['box-row']} key={sub.orderProductId}>
              <View className={styles['box-row-left']}>
                <Image className={styles['box-row-img']} src={sub.logo} />
              </View>
              <View className={styles['box-row-info']}>
                <Text className={styles['row-info-text']}>{sub.name}</Text>
                <Text className={styles['row-info-text2']}>{sub.spec}</Text>
                <View className={styles['row-info-btm']}>
                  <View className={styles['info-btm-number']}>
                    <Text style={{ color: '#ef3346', fontSize: pxTransform(12) }}>
                      {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                    </Text>
                    <Text style={{ color: '#ef3346', fontSize: pxTransform(16) }}>
                      {splitPrice(sub.refPrice).intPart}
                    </Text>
                    <Text style={{ color: '#ef3346', fontSize: pxTransform(12) }}>
                      {/*小数点后两位*/}
                      {splitPrice(sub.refPrice).decimalPart}
                    </Text>
                    <Text style={{ color: '#91959b', fontSize: pxTransform(10), fontWeight: 400 }}>/ {sub.unit}</Text>
                  </View>
                  <Text className={styles['info-btm-text']}>x{sub.quantity}</Text>
                </View>
              </View>
            </View>
          ))}

          <View className={styles['box-btm']}>
            <View className={styles['box-btm-left']}>
              <Text style={{ marginRight: pxTransform(10) }} className={styles['box-btm-text']}>
                {intl.formatMessage({ id: 'teamLeader.yuguyongjin', defaultMessage: '预估佣金:' })}
              </Text>
              <Text>
                {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {item.commissionAmount}
              </Text>
            </View>
            <View className={styles['box-btm-right']}>
              <Text className={styles['box-btm-right-text']} style={{ marginRight: pxTransform(8) }}>
                {intl.formatMessage({ id: 'teamLeader.gong', defaultMessage: '共' })}
                <Text style={{ marginLeft: pxTransform(2), marginRight: pxTransform(2) }}>
                  {getTotalQuantity(item.products)}
                </Text>
                {intl.formatMessage({ id: 'teamLeader.jian', defaultMessage: '件' })}
              </Text>
              <Text className={styles['box-btm-right-text']}>
                {intl.formatMessage({ id: 'teamLeader.shifu', defaultMessage: '实付：' })}
              </Text>
              <Text className={styles['box-btm-right-text2']}>
                {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {item.totalAmount}
              </Text>
            </View>
          </View>

          {item.statusStr === '待取货' && (
            <View className={styles['box-operation']}>
              <View
                className={styles['box-operation-btn1']}
                onClick={(e) => {
                  e.stopPropagation()
                  handleTake(item.orderId)
                }}
              >
                {intl.formatMessage({ id: 'teamLeader.daikequhuo', defaultMessage: '代客取货' })}
              </View>
              <View
                className={styles['box-operation-btn2']}
                onClick={(e) => {
                  e.stopPropagation()
                  handleNotice(item.orderId)
                }}
              >
                {intl.formatMessage({ id: 'teamLeader.daohuotongzhi', defaultMessage: '到货通知' })}
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <View className={styles['order']}>
      <FilterModal
        renderHeaderComponent={
          <View>
            {renderHeader()}
            {/* 不需要显示tab */}
            {/*{renderTab()}*/}
          </View>
        }
        visible={visible}
        // 显示时间筛选
        showDateGroup={true}
        // 显示外部状态
        // showOuterStatus={true}
        // 显示内部状态
        // showInnerStatus={true}
        // 传入时间选项数组
        dateOptions={dateOptions}
        // 传入外部状态数组
        // outerStatus={outerStatus}
        // 传入内部状态数组
        // innerStatus={innerStatus}
        onClose={() => setVisible(false)}
        onConfirm={handleFilterModalConfirm}
      />
      {renderTab()}
      <View className={styles['list']}>
        <ScrollView
          scrollY
          data={list}
          lowerThreshold={80}
          onScrollToLower={handleLoadMore}
          refresherEnabled={true}
          refreshing={refreshing}
          onRefresherRefresh={handleRefresh}
          className={styles['scroll-list']}
          renderItem={renderItem}
          listEmptyComponent={<Empty />}
          listFooterComponent={
            searchForm.current > 1 && list.length > 0 ? (
              <Loading loading={loading} noMore={!hasMore && !loading} customStyle={{ marginTop: pxTransform(14) }} />
            ) : null
          }
        ></ScrollView>
      </View>
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderGroupPurchaseOrders))
