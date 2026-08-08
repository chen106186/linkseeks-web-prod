import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useState } from 'react'
import { View, Image, Icons, Text } from '@apps/mobile-ui'
import NavBar from '@/components/NavBar'
import Router from '@/utils/router'
import GoodsList from '../../components/GoodsList/index'
import cx from 'classnames'
import {
  pxTransform,
  useDidShow,
  useRouter,
  showToast,
  showLoading,
  hideLoading,
  getStorageSync,
} from '@apps/mobile-services/utils/taro'
import Search from '@/components/Search'
import { getOrderMobileSocialDistributionPage } from '@apps/apis'
import { formatMoney } from '../../utils/formatter'
import styles from './index.module.scss'
import { USER_INFO } from '@/constants/storage'
const rewardImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/reward.png'

interface QueryParams {
  keyword: string
  // 可选,commissionType为全部不传
  commissionType?: string
  current: string
  pageSize: string
}

const RewardPage = () => {
  const intl = useIntl()

  const {
    directDistributionSalesAmount,
    directPendingSettlementAmount,
    indirectDistributionSalesAmount,
    indirectPendingSettlementAmount,
  } = useRouter().params

  // 请求参数
  const [queryParams, setQueryParams] = useState<QueryParams>({
    keyword: '',
    commissionType: '99',
    current: '1',
    pageSize: '10',
  })
  // tab 状态 & tab 列表
  const [activeTab, setActiveTab] = useState('99')
  const tabs = [
    { type: '99', label: intl.formatMessage({ id: 'reward.quanbu', defaultMessage: '全部' }) },
    { type: '0', label: intl.formatMessage({ id: 'reward.zhijiefenxiao', defaultMessage: '直接分销' }) },
    { type: '1', label: intl.formatMessage({ id: 'reward.yaoqingfenxiao', defaultMessage: '邀请分销' }) },
  ]
  // 列表数据状态
  const [list, setList] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [curMemberId, setCurMemberId] = useState(0)

  // 页面显示时，首次加载
  // useDidShow(() => {
  //   getRewardDetails()
  // })

  // 切换 Tab
  const handleActiveTab = (type: string) => {
    setActiveTab(type)
    setList([])
    setQueryParams((prev) => {
      const baseParams = {
        keyword: prev.keyword,
        // 切换状态页码设置为1
        current: '1',
        pageSize: prev.pageSize,
      }
      if (type === '99') {
        // 不传 commissionType 字段
        return baseParams
      } else {
        // 传 commissionType 字段
        return {
          ...baseParams,
          commissionType: type,
        }
      }
    })
  }

  // 搜索查询
  const handleSearch = (value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      keyword: value,
      current: '1',
    }))
  }

  // 清空搜索内容
  // const handleClear = () => {
  //   setQueryParams(prev => ({
  //     ...prev,
  //     keyword: '',
  //     current: '1',
  //   }))
  // }

  // 获取列表
  const getRewardDetails = (isLoadMore = false) => {
    if (loading) {
      return
    }
    setLoading(true)
    const params = { ...queryParams }
    if (params.commissionType === '99') {
      delete params.commissionType
    }
    showLoading({
      title: intl.formatMessage({ id: 'distribution.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    getOrderMobileSocialDistributionPage(params)
      .then((res) => {
        if (res.code === 1000) {
          const rewardList = res.data.data || []
          const totalCount = res.data.totalCount || 0

          setList((prev) => (isLoadMore ? [...prev, ...rewardList] : rewardList))
          setTotal(totalCount)
          setHasMore(parseInt(params.current) * parseInt(params.pageSize) < totalCount)
        } else {
          showToast({
            title:
              res.message ||
              intl.formatMessage({
                id: 'distribution.huoqushujushibai',
                defaultMessage: '获取数据失败',
              }),
            icon: 'none',
          })
        }
      })
      .finally(() => {
        // 不管刷新还是加载，最后都清掉 loading 状态
        setLoading(false)
        hideLoading()
        setRefreshing(false)
      })
  }

  // 加载更多（分页）
  const handleLoadMore = () => {
    if (!hasMore || loading) return
    setQueryParams((prev) => ({
      ...prev,
      current: (parseInt(prev.current) + 1).toString(),
    }))
  }

  // 下拉刷新
  const handleRefresh = () => {
    setRefreshing(true)
    // 重置分页参数（current 设置为 1）
    setQueryParams((prev) => ({
      ...prev,
      current: '1',
    }))
  }

  // 每次 queryParams 变化都重新请求数据
  useEffect(() => {
    if (curMemberId === 0) {
      const userInfoStr = getStorageSync(USER_INFO)
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        setCurMemberId(userInfo.memberId)
      }
    }
    getRewardDetails(queryParams.current !== '1')
  }, [queryParams])

  return (
    <View className={styles['reward-content']}>
      <View className={styles['reward-content-top']}>
        <Image src={rewardImg} mode="aspectFill" className={styles['reward-content-top-imgbg']} />
      </View>

      <View className={styles['header-wrapper']}>
        <NavBar
          customRenderLeft={
            <View style={{ flex: 0.7 }}>
              <Icons name="ChevronLeft" size={24} color="#fff" onClick={() => Router.navigateBack()} />
            </View>
          }
          customClassName={styles['header-nav']}
          title={
            <Search
              onSearch={handleSearch}
              placeholder={intl.formatMessage({
                id: 'search.shangpinpinzhonghuiyuanfenxiaoyuan',
                defaultMessage: '商品/品种/会员/分销员',
              })}
              customLeftIcon={
                <Icons
                  name="Search"
                  size={18}
                  color="#ffffff"
                  customStyle={{ opacity: 0.7, marginRight: pxTransform(4) }}
                />
              }
              customClassName={styles['top-search']}
              customPlaceholderClass={styles['search-field-placeholder']}
              customSearchFieldClass={styles['search-field']}
              innerBackground="#00000033"
              shape="round"
              clearable
            />
          }
        />

        <View className={styles['reward-info']}>
          <View className={styles['reward-info-item']}>
            <Text className={styles['reward-info-item-title']}>
              {intl.formatMessage({ id: 'reward.zhijiefenxiaodaozhangyuan', defaultMessage: '直接分销返现到账(元)' })}
            </Text>
            <Text className={styles['reward-info-item-money']}>
              {formatMoney(Number(directDistributionSalesAmount))}
            </Text>
            <Text className={styles['reward-info-item-title']} style={{ marginTop: pxTransform(16) }}>
              {intl.formatMessage({ id: 'reward.daijiesuanweidaozhangyuan', defaultMessage: '待结算未到账(元)' })}
            </Text>
            <Text className={styles['reward-info-item-money1']}>
              {formatMoney(Number(directPendingSettlementAmount))}
            </Text>
          </View>
          <View className={styles['reward-info-item']}>
            <Text className={styles['reward-info-item-title']}>
              {intl.formatMessage({
                id: 'reward.yaoqingfenxiaofanxiandaozhangyuan',
                defaultMessage: '邀请分销返现到账(元)',
              })}
            </Text>
            <Text className={styles['reward-info-item-money']}>
              {formatMoney(Number(indirectDistributionSalesAmount))}
            </Text>
            <Text className={styles['reward-info-item-title']} style={{ marginTop: pxTransform(16) }}>
              {intl.formatMessage({ id: 'reward.daijiesuanweidaozhangyuan', defaultMessage: '待结算未到账(元)' })}
            </Text>
            <Text className={styles['reward-info-item-money1']}>
              {formatMoney(Number(indirectPendingSettlementAmount))}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles['reward-tabs']}>
        {tabs.map((tab) => (
          <View
            key={tab.type}
            className={cx(styles['reward-tabs-tab'], {
              [styles['tab-active']]: tab.type === activeTab,
            })}
            onClick={() => handleActiveTab(tab.type)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles['goods']}>
        <GoodsList
          type="2"
          curMemberId={curMemberId}
          list={list}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          enableLoadMore={true}
        />
      </View>
    </View>
  )
}

export default GlobalWrapper(RewardPage)
