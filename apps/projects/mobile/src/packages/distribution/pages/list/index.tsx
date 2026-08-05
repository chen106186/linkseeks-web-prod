import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useState, useEffect } from 'react'
import { View, Text, Icons, Image, ScrollView } from '@apps/mobile-ui'
import Router from '@/utils/router'
import Empty from '@/components/Empty'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import { showToast, showLoading, hideLoading, useDidShow, pxTransform } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'
import { getOrderMobileSocialDistributionDownline } from '@apps/apis'
import { formatMoney, formatDateFromTimestamp } from '../../utils/formatter'
import Loading from '@/components/Loading'
import { THEME_COLORS } from '@/constants/theme'
const logoIcon = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/default_logo.png'

const DistributorListPage = () => {
  const intl = useIntl()
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // 页面显示时，首次加载
  // useDidShow(() => {
  //   getInviteList()
  // })

  useEffect(() => {
    getInviteList(keyword)
  }, [])

  // 获取邀请的分销员列表
  const getInviteList = async (keyword: string) => {
    if (loading) {
      return
    }
    setLoading(true)
    showLoading({
      title: intl.formatMessage({ id: 'distribution.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    const res = await getOrderMobileSocialDistributionDownline({ keyword })
    hideLoading()
    setLoading(false)
    if (res.code === 1000) {
      const list = res.data || []
      setList(list)
    } else {
      showToast({
        title: res.message || intl.formatMessage({
          id: 'distribution.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
    }
  }

  // 计算累计返现总和
  const getTotalCommission = (): number => {
    return list.reduce((total, item) => {
      const value = Number(item.commission)
      return total + (isNaN(value) ? 0 : value)
    }, 0)
  }

  // 搜索
  const handleSearch = (value: string) => {
    console.log("value", value)
    setKeyword(value)
    getInviteList(value)
  }

  // 下拉刷新回调
  const handleRefresh = async () => {
    if (refreshing) return
    setRefreshing(true)
    try {
      await getInviteList(keyword)
    } catch (error) {
      console.error('刷新失败:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // 查看详情
  const toDetail = (item: any) => {
    const params = {
      memberId: item.memberId,
      memberName: item.memberName,
      joinTime: item.joinTime,
      logo: item.logo,
    }
    Router.navigateTo('distribution/detail', params)
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View className={styles['item']}>
        <View className={styles['user-box']}>
          <Image src={item.logo || logoIcon} className={styles['avatar']}></Image>
          <View className={styles['user-info']}>
            <View className={styles['name-info']}>
              <Text className={styles['name']}>{item.memberName}</Text>
              <Text onClick={() => toDetail(item)}>
                {intl.formatMessage({id:'distribution.chakanxiangqing', defaultMessage: '查看详情'})}
                <Icons name="ChevronRight" size={12} color="#979797"></Icons>
              </Text>
            </View>
            <Text>
              {intl.formatMessage({id:'distribution.yaoqingyu', defaultMessage: '邀请于 '})}
              {formatDateFromTimestamp(item.joinTime, 2)}
            </Text>
          </View>
        </View>

        <View className={styles['settlement-box']}>
          <View className={styles['settlement-box-item']}>
            <Text className={styles['settlement-box-item-money']}>{item.commission}</Text>
            <Text>{intl.formatMessage({id:'distribution.leijigongxianfanxian', defaultMessage: '累计贡献返现'})}</Text>
          </View>
          <View className={styles['settlement-box-item']}>
            <Text className={styles['settlement-box-item-money']}>{item.amount}</Text>
            <Text>{intl.formatMessage({id:'distribution.leijifenxiaodingdanzonge', defaultMessage: '累计分销订单总额'})}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <NavBar
        customRenderLeft={
          <View style={{ flex: 0.7, }}>
            <Icons name="ChevronLeft" size={24} color="#000000" onClick={() => Router.navigateBack()} />
          </View>
        }
        customClassName={styles['header-nav']}
        title={
          <Search
            onSearch={handleSearch}
            placeholder={intl.formatMessage({
              id: 'search.xiajifenxiaoyuan',
              defaultMessage: '下级分销员',
            })}
            customLeftIcon={<Icons name="Search" size={18} color="#91959B" />}
            customClassName={styles['top-search']}
            customPlaceholderClass={styles['search-field-placeholder']}
            // customSearchFieldClass={styles['search-field']}
            innerBackground={THEME_COLORS.surface}
            shape="round"
            clearable
          />
        }
      />

      <View className={styles['header']}>
        <Text>
          {intl.formatMessage({id:'distribution.gong', defaultMessage: '共'})}
          { list.length }
          {intl.formatMessage({id:'distribution.ren', defaultMessage: '人'})}
        </Text>
        <Text>
          {intl.formatMessage({id:'distribution.leijifanxian', defaultMessage: '累计返现'})}
          <Text className={styles['money']}>
            {intl.formatMessage({id: 'currency', defaultMessage: '￥',})}
            {getTotalCommission()}
          </Text>
        </Text>
      </View>

      <View className={styles['list']}>
        <ScrollView
          scrollY
          data={list}
          refresherEnabled // 开启下拉刷新
          refresherTriggered={refreshing} // 刷新状态变量
          onRefresherRefresh={handleRefresh} // 下拉刷新的回调
          className={styles['scroll-list']}
          renderItem={renderItem}
          listEmptyComponent={<Empty />}
          listFooterComponent={
            list.length ? (
              <Loading loading={false} noMore={true} customStyle={{ marginTop: pxTransform(12) }} />
            ) : null
          }
        ></ScrollView>
      </View>
    </View>
  )
}

export default GlobalWrapper(DistributorListPage)
