import React, { useEffect, useState } from 'react'
import GlobalWrapper from '@/components/GlobalWrapper'
import { observer } from 'mobx-react-lite'
import { Icons, ScrollView, Text, View } from '@apps/mobile-ui'
import styles from './index.module.scss'
import cs from 'classnames'
import ActivityModule from '@/packages/teamLeader/components/activityModule'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import {
  getCommodityMobileCategoryMobileEnterpriseCategory,
  postMarketingMobileCbgTeamLeaderActivityList,
  postMarketingMobileCbgTeamLeaderCancelSignUpActivity,
  postMarketingMobileCbgTeamLeaderSignUpActivity,
} from '@apps/apis'
import CategoryFilterDrawer from '@/packages/teamLeader/components/categoryDrawer'
import Router from '@/utils/router'
import { pxTransform, showToast, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import useStores from '@/store/useStores'

const TeamLeaderGroupBuyList: React.FC<{}> = () => {
  // 全局获取store中的adornId，分类列表请求使用
  const {
    templateStore: { adornId },
  } = useStores()
  const intl = useIntl()
  // 分页-是否还有更多
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  // 下拉刷新
  const [refreshing, setRefreshing] = useState(false)
  // 状态列表
  const statusList = [
    { status: 0, label: intl.formatMessage({ id: 'teamLeader.quanbu', defaultMessage: '全部' }) },
    { status: 1, label: intl.formatMessage({ id: 'teamLeader.weikaishi', defaultMessage: '未开始' }) },
    { status: 2, label: intl.formatMessage({ id: 'teamLeader.jinxingzhong', defaultMessage: '进行中' }) },
    { status: 3, label: intl.formatMessage({ id: 'teamLeader.yijieshu', defaultMessage: '已结束' }) },
  ]
  // 分类列表
  const [categoryList, setCategoryList] = useState<any>([])
  // 活动列表
  const [activityList, setActivityList] = useState<any>([])
  // 右侧分类选择抽屉
  const [visibleFilterDrawer, setVisibleFilterDrawer] = useState(false)

  const getCategoryList = () => {
    let list = [{ id: 0, name: '全部' }]
    const params: any = { adornId: adornId }
    getCommodityMobileCategoryMobileEnterpriseCategory(params).then(res => {
      if (res.code === 1000) {
        list = list.concat(res.data)
      }
      setCategoryList(list)
    }).catch(() => {
      setCategoryList(list)
    })
  }

  // 搜索参数
  const [searchForm, setSearchForm] = useState<any>({
    status: 0,
    categoryId: 0,
    current: 1,
    pageSize: 10
  })

  useEffect(() => {
    getCategoryList()
  }, [])

  useEffect(() => {
    // loadMore = false，刷新数据
    getActivityList(false)
  }, [searchForm.status, searchForm.categoryId])

  useEffect(() => {
    if (searchForm.current > 1) {
      getActivityList(true)
    }
  }, [searchForm.current])

  // 获取团购活动列表
  const getActivityList = async (loadMore = false) => {
    if (loading) return
    setLoading(true)
    showLoading({
      title: intl.formatMessage({id: 'teamLeader.jiazaizhong',defaultMessage: '加载中',}),
      mask: true,
    })
    try {
      const res = await postMarketingMobileCbgTeamLeaderActivityList(searchForm)
      if (res.code === 1000) {
        const list = res.data?.data || []
        // 总条数
        const total = res.data?.totalCount || 0
        const newList = loadMore ? [...activityList, ...list] : list
        setActivityList(newList)
        setHasMore(newList.length < total)
      } else {
        showToast({
          title: res?.message || intl.formatMessage({
            id: 'teamLeader.huoqutuangouhuodongliebiaoshibai',
            defaultMessage: '获取团购活动列表失败',
          }),
          icon: 'none',
        })
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.huoqutuangouhuodongliebiaoshibai',
          defaultMessage: '获取团购活动列表失败',
        }),
        icon: 'none',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
      hideLoading()
    }
  }

  // 选择修改搜索参数
  const updateSearchForm = (key: string, value: number) => {
    if (searchForm[key] == value) return
    setSearchForm(prev => ({
      ...prev,
      [key]: value,
      current: 1,
    }))
  }
  // 分类抽屉选择
  const handleFilterChange = (id: number) => {
    if (searchForm['categoryId'] == id) return
    setSearchForm(prev => ({
      ...prev,
      categoryId: id,
      current: 1,
    }))
  }

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
    getActivityList(false)
  }

  // 团购活动点击-跳转活动详情
  const handleActivityDetail = (activityId: number) => {
    Router.navigateTo('teamLeader/groupBuyDetail', {activityId})
  }
  // 团购活动点击报名或撤销
  const handleActivityAction = async (id: number,status: number) => {
    FullScreenLoading.show()
    try {
      // 报名活动状态（1：已报名）
      if (status !== 1) {
        // 报名
        const res = await postMarketingMobileCbgTeamLeaderSignUpActivity({ activityId: id })
        if (res.code === 1000) {
          showToast({
            title: res.message || intl.formatMessage({id:'teamLeader.baomingchenggong',defaultMessage: '报名成功'}),
            icon: 'none',
          })
          // 报名成功-手动更新activityList中对应项状态
          setActivityList(
            prev => prev.map(item => item.id === id
              ? { ...item,
                signupStatus: 1,
              }
              : item
            )
          )
        } else {
          showToast({
            title: res.message || intl.formatMessage({id:'teamLeader.baomingshibai', defaultMessage: '报名失败'}),
            icon: 'none',
          })
        }
      } else {
        // 撤销报名
        const res = await postMarketingMobileCbgTeamLeaderCancelSignUpActivity({ activityId: id })
        if (res.code === 1000) {
          showToast({
            title: res.message || intl.formatMessage({id:'teamLeader.chexiaobaomingchenggong',defaultMessage: '撤销报名成功'}),
            icon: 'success',
          })
          // 撤销成功-手动更新activityList中对应项状态
          setActivityList(
            prev => prev.map(item => item.id === id
              ? { ...item,
                signupStatus: 0,
              }
              : item
            )
          )
        } else {
          showToast({
            title: res.message || intl.formatMessage({id:'teamLeader.chexiaoshibai',defaultMessage: '撤销失败'}),
            icon: 'none',
          })
        }
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({id: 'teamLeader.qingqiuyichangqingshaohouzaishi', defaultMessage: '请求异常，请稍后再试'}),
        icon: 'none',
      })
    } finally {
      FullScreenLoading.hide()
    }
  }

  return (
    <View className={styles['container']}>
      <View className={styles['top']}>
        <View className={styles['tabs']}>
          {statusList.map(item => (
            <View key={item.status}
              className={cx(styles['tab'], {[styles['tab-active']]: item.status === searchForm.status})}
              onClick={() => {updateSearchForm('status', item.status)}}
            >
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>
        <View className={styles['category-tabs']}>
          <ScrollView scrollX horizontal={true} className={styles['scroll-view']} scrollIntoView={`category-item-${searchForm.categoryId}`} >
            <View className={styles['tabs']}>
              {categoryList.map(item => (
                <View
                  id={`category-item-${item.id}`}
                  className={cs(styles.item, searchForm.categoryId == item.id && styles.selected)}
                  key={item.id}
                  onClick={() => {updateSearchForm('categoryId', item.id)}}
                >
                  {item.name}
                </View>
              ))}
            </View>
          </ScrollView>
          <Icons name="Specific" size={24} color="#91959B" onClick={() => {setVisibleFilterDrawer(!visibleFilterDrawer)}} />
        </View>
      </View>
      <ScrollView
        scrollY
        data={activityList}
        lowerThreshold={80}
        onScrollToLower={handleLoadMore}
        refresherEnabled={true}
        refreshing={refreshing}
        onRefresherRefresh={handleRefresh}
        className={styles['activity-list']}
        renderItem={({ item }) => (
          <ActivityModule
            item={item}
            onClickDetail={id => handleActivityDetail(id)}
            onClickAction={(id, status) => handleActivityAction(id, status)}
          />
        )}
        listEmptyComponent={<Empty />}
        listFooterComponent={
          searchForm.current > 1 && activityList.length > 0 ? (
            <Loading
              loading={loading}
              noMore={!hasMore && !loading}
              customStyle={{ marginTop: pxTransform(14) }}
            />
          ) : null
        }
      />

      {/*<ScrollView scrollY className={styles['activity-list']}>*/}
      {/*  {activityList.map(item => (*/}
      {/*    <ActivityModule*/}
      {/*      key={item.id}*/}
      {/*      item={item}*/}
      {/*      onClickDetail={id => handleActivityDetail(id)}*/}
      {/*      onClickAction={(id,status) => handleActivityAction(id,status)}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</ScrollView>*/}

      {/* 右侧category选择抽屉 */}
      <CategoryFilterDrawer
        visible={visibleFilterDrawer}
        options={categoryList}
        multiple={false}
        defaultValue={searchForm.categoryId}
        onClose={() => { setVisibleFilterDrawer(false) }}
        onChange={handleFilterChange}
      />

      <FullScreenLoading />
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderGroupBuyList))
