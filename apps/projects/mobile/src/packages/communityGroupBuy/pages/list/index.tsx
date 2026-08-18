import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Icons, Input, ScrollView } from '@apps/mobile-ui'
import { showLoading, hideLoading, setStorageSync, getStorageSync } from '@apps/mobile-services/utils/taro'
import {
  getMarketingMobileCbgActivityDefaultPickupPoint,
  getCommodityMobileCategoryMobileEnterpriseCategory,
  postMarketingMobileCbgActivityListByPickupPointId,
} from '@apps/apis'
import useStores from '@/store/useStores'
import ActivityModule from './components/ActivityModule'
import EmptyLayout from '@/components/Empty/index'
import FilterPopup from './components/FilterPopup'
import cs from 'classnames'
import styles from './index.module.scss'
import { useStatusBarHeight } from '@apps/mobile-services'
import { observer } from 'mobx-react-lite'
import { checkMore } from '@/utils'
import { useRouter } from '@apps/mobile-services/utils/taro'

const CommunityGroupBuyList: React.FC<{}> = () => {
  const intl = useIntl()
  const {
    groupBuyStore: { pickupPointInfo, setPickupPointInfo },
  } = useStores()

  const [currentTimestamp, setCurrentTimestamp] = useState<number>(new Date().getTime())
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(() => new Date().getTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [currentTimestamp])

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef<number>(1)

  const [searchWord, setSearchWord] = useState('') // 搜索词
  const statusList = [
    { value: 1, label: intl.formatMessage({ id: 'communityGroupBuy.list.jijiangkaishi', defaultMessage: '即将开始' }) },
    { value: 2, label: intl.formatMessage({ id: 'communityGroupBuy.list.jinxingzhong', defaultMessage: '进行中' }) },
    { value: 3, label: intl.formatMessage({ id: 'communityGroupBuy.list.yijiesu', defaultMessage: '已结束' }) },
  ]
  const [searchForm, setSearchForm] = useState<any>({
    id: 0,
    status: statusList[1].value,
    categoryId: 0,
    productName: '',
    pickupPointId: '',
  }) // 搜索参数
  const [visibleFilterPopup, setVisibleFilterPopup] = useState(false) // 分类列表弹窗
  const [categoryList, setCategoryList] = useState<any>([]) // 分类列表
  const [activityList, setActivityList] = useState<any>([]) // 活动列表
  const { statusBarHeight } = useStatusBarHeight()
  const {
    params: { goodsId },
  } = useRouter()
  const getPickupPoint = () => {
    if (!pickupPointInfo?.teamLeaderId || goodsId) {
      getMarketingMobileCbgActivityDefaultPickupPoint({ goodsId }).then((res) => {
        if (res.code === 1000) {
          setPickupPointInfo(res.data)
          if (!goodsId && getStorageSync('first2') != 2) {
            setStorageSync('first2', 1)
            Router.navigateTo('communityGroupBuy/changeSelfPickupAddress')
          }
        }
      })
    } else {
      getActivityList()
    }
  }

  const getCategoryList = () => {
    let list = []
    getCommodityMobileCategoryMobileEnterpriseCategory({ adornId: '1' })
      .then((res) => {
        if (res.code === 1000) {
          list = res.data
        }
        setCategoryList(list)
      })
      .catch(() => {
        setCategoryList(list)
      })
  }

  const updateSearchForm = (key, value) => {
    if (searchForm[key] == value) return
    setSearchForm(Object.assign({}, searchForm, { [key]: value }))
  }

  const handleSearchWordChange = (value) => {
    setSearchWord(value)
  }
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getActivityList()
  }

  const getActivityList = () => {
    if (!searchForm.pickupPointId || loading) return
    setLoading(true)
    showLoading()
    let postData = Object.assign({}, searchForm, {
      current: pageRef.current,
      pageSize: 10,
    })
    postMarketingMobileCbgActivityListByPickupPointId(postData)
      .then((res) => {
        if (res.code === 1000) {
          setHasMore(checkMore(postData.current, postData.pageSize, res.data.data.length, res.data.totalCount))
          if (postData.current === 1) {
            setActivityList(res.data.data)
          } else {
            setActivityList(activityList.concat(res.data.data))
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
        hideLoading()
      })
  }

  useEffect(() => {
    getPickupPoint()
    getCategoryList()
  }, [])

  useEffect(() => {
    setSearchForm(Object.assign({}, searchForm, { pickupPointId: pickupPointInfo?.teamLeaderId || 0 }))
  }, [pickupPointInfo])

  useEffect(() => {
    getActivityList()
  }, [searchForm])

  return (
    <View className={styles['container']}>
      <View className={styles['top']}>
        <View className={styles['nav']} style={`padding-top: ${statusBarHeight + 'PX'};`}>
          <View
            className="nav-bar-left-arrow"
            hoverClass="nav-bar-left-arrow__hover"
            onClick={() => Router.navigateBack()}
          >
            <Icons name="ChevronLeft" size={24} color="#5A2A12" />
          </View>
          <View className={styles['search-box']}>
            <Icons name="Search" size={22.6} color="#8F7564" />
            <Input
              className={styles['input']}
              value={searchWord}
              placeholder={intl.formatMessage({ id: 'communityGroupBuy.list.shuiguo', defaultMessage: '水果' })}
              placeholderStyle="color: #BFAFA3;"
              onChange={handleSearchWordChange}
              onConfirm={() => {
                updateSearchForm('productName', searchWord)
              }}
            />
            {/* <View
              className={styles['button']}
              onClick={() => {
                updateSearchForm('productName', searchWord)
              }}
            >
              {intl.formatMessage({ id: 'communityGroupBuy.list.sousuo', defaultMessage: '搜索' })}
            </View> */}
          </View>
          <View></View>
        </View>
        <View className={styles['address']}>
          <View
            className={styles['address-left']}
            onClick={() => Router.navigateTo('communityGroupBuy/changeSelfPickupAddress')}
          >
            <Icons name="Address" size={16} color="#7A5743" />
            <View className={styles['address-name']}>{pickupPointInfo?.pickupPointName || '请选择自提点'}</View>
          </View>
          <View
            className={styles['address-right']}
            onClick={() => Router.navigateTo('communityGroupBuy/changeSelfPickupAddress')}
          >
            <Text className={styles['switch-text']}>自提点切换</Text>
            <Icons name="ChevronDown" size={12} color="#C45124" />
          </View>
        </View>
        <View className={styles['status-tabs']}>
          {statusList.map((item) => (
            <View
              key={item.value}
              className={cs(styles.item, searchForm.status == item.value && styles.selected)}
              onClick={() => {
                updateSearchForm('status', item.value)
              }}
            >
              {item.label}
            </View>
          ))}
        </View>
        <View className={styles['category-tabs']}>
          <ScrollView scrollX className={styles['scroll-view']}>
            <View className={styles['tabs']}>
              <View
                className={cs(styles.item, searchForm.categoryId === 0 && styles.selected)}
                onClick={() => {
                  updateSearchForm('categoryId', 0)
                }}
              >
                {intl.formatMessage({
                  id: 'communityGroupBuy.list.quanbu',
                  defaultMessage: '全部',
                })}
              </View>
              {categoryList.map((item) => (
                <View
                  className={cs(styles.item, searchForm.categoryId === item.id && styles.selected)}
                  key={item.id.toString()}
                  onClick={() => {
                    updateSearchForm('categoryId', item.id)
                  }}
                >
                  {item.name}
                </View>
              ))}
            </View>
          </ScrollView>
          <Icons
            name="Specific"
            size={24}
            color="#8F7564"
            onClick={() => {
              setVisibleFilterPopup(true)
            }}
          />
        </View>
      </View>
      <ScrollView
        className={styles['activity-list']}
        scrollY
        refresherEnabled
        onEndReached={() => handleLoadMore()}
        onEndReachedThreshold={0.05}
        onScrollToLower={handleLoadMore}
        refreshing={loading}
        onRefresh={() => {
          pageRef.current = 1
          getActivityList()
        }}
      >
        {activityList.length > 0 ? (
          activityList.map((it, index) => (
            <ActivityModule
              key={index.toString()}
              data={it}
              currentTime={currentTimestamp}
              onClick={(data) => {
                Router.navigateTo('communityGroupBuy/activityDetail', {
                  activityId: data.id,
                  pickupPointId: searchForm.pickupPointId,
                })
              }}
            />
          ))
        ) : (
          <View className={styles['empty']}>
            <EmptyLayout />
          </View>
        )}
      </ScrollView>

      <FilterPopup
        visible={visibleFilterPopup}
        categoryList={categoryList}
        onReset={() => {
          handleSearchWordChange('')
          setSearchForm(
            Object.assign({}, searchForm, {
              categoryId: 0,
              productName: '',
            }),
          )
        }}
        onConfirm={(data) => {
          handleSearchWordChange(data.productName)
          setSearchForm(Object.assign({}, searchForm, data))
        }}
        onClose={() => {
          setVisibleFilterPopup(false)
        }}
      />
    </View>
  )
}

export default GlobalWrapper(observer(CommunityGroupBuyList))
