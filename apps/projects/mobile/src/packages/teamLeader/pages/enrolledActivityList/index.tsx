import React, { useEffect, useRef, useState } from 'react'
import GlobalWrapper from '@/components/GlobalWrapper'
import { observer } from 'mobx-react-lite'
import { ScrollView, Text, View } from '@apps/mobile-ui'
import { useRouter, showToast } from '@apps/mobile-services/utils/taro'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import Router from '@/utils/router'
import styles from './index.module.scss'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import {
  getOrderMobileCbgTeamLeaderSignupList,
  postMarketingMobileCbgTeamLeaderSignUpActivity,
  postMarketingMobileCbgTeamLeaderCancelSignUpActivity,
} from '@apps/apis'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { numFormat, priceFormat } from '@/utils/numberFormat'
import { checkMore } from '@/utils'

type BaseRouteParams = {
  status: string
}

const TeamLeaderEnrolledActivityList: React.FC<{}> = () => {
  const router = useRouter<BaseRouteParams>()
  const {
    params: { status },
  } = router
  const intl = useIntl()
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef<number>(1)

  // tabs栏
  const tabs = [
    { status: 0, label: intl.formatMessage({ id: 'teamLeader.quanbu', defaultMessage: '全部' }) },
    { status: 1, label: intl.formatMessage({ id: 'teamLeader.weikaishi', defaultMessage: '未开始' }) },
    { status: 2, label: intl.formatMessage({ id: 'teamLeader.jinxingzhong', defaultMessage: '进行中' }) },
    { status: 3, label: intl.formatMessage({ id: 'teamLeader.yijieshu', defaultMessage: '已结束' }) },
  ]
  const [activeTab, setActiveTab] = useState<number>(isNaN(+status) || +status < 0 || +status > 3 ? 0 : +status)
  // 切换tabs栏
  const handleActiveTab = (status: number) => {
    setActiveTab(status)
    setList([])
    pageRef.current = 1
    setRefreshing(true)
    getList(status)
  }

  useEffect(() => {
    getList(activeTab)
  }, [])

  const handleRefresh = () => {
    if (refreshing) {
      return
    }
    pageRef.current = 1
    setRefreshing(true)
    getList(activeTab)
  }
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getList(activeTab)
  }

  // 数据集合
  const [list, setList] = useState<any>([])

  const getList = (type) => {
    setLoading(true)
    const postData = {
      type,
      current: pageRef.current,
      pageSize: 10,
    }
    getOrderMobileCbgTeamLeaderSignupList(postData)
      .then((res: any) => {
        if (res.code === 1000) {
          if (postData.current === 1) {
            setList(res.data.data)
          } else {
            setList([...list, ...res.data.data])
          }
          setHasMore(checkMore(postData.current, postData.pageSize, res.data.data.length, res.data.totalCount))
        }
      })
      .catch(() => {})
      .finally(() => {
        if (postData.current === 1) {
          setRefreshing(false)
        }
        setLoading(false)
      })
  }

  const handleEnrolled = (item: any, index: number) => {
    FullScreenLoading.show()
    const fn =
      item.signupStatus === 1
        ? postMarketingMobileCbgTeamLeaderCancelSignUpActivity
        : postMarketingMobileCbgTeamLeaderSignUpActivity
    fn({ activityId: item.id })
      .then((res: any) => {
        if (res.code === 1000) {
          showToast({
            title: res.message,
            icon: 'none',
          })
          let _list = [...list]
          _list[index].signupStatus = item.signupStatus === 1 ? 2 : 1
          setList(_list)
        } else {
          showToast({
            title:
              res.message ||
              intl.formatMessage({
                id: 'teamLeader.tijiaoshibai',
                defaultMessage: '提交失败',
              }),
            icon: 'none',
          })
        }
      })
      .catch(() => {
        showToast({
          title: intl.formatMessage({
            id: 'teamLeader.tijiaoshibai',
            defaultMessage: '提交失败',
          }),
          icon: 'none',
        })
      })
      .finally(() => {
        FullScreenLoading.hide()
      })
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        className={styles['box']}
        onClick={() => {
          Router.navigateTo('teamLeader/groupBuyDetail', {
            activityId: item.id,
            enterType: 1
          })
        }}
      >
        <View className={styles['box-top']}>
          <Text className={styles['box-top-title']}>{item.activityName}</Text>
          <Text className={styles['box-top-text']} style={{ color: item.status !== 2 ? '#979797' : '#FA8C16' }}>
            {item.statusStr}
          </Text>
        </View>
        <View className={styles['box-date']}>
          {intl.formatMessage({ id: 'teamLeader.huodongshijian', defaultMessage: '活动时间：' })}
          {item.startDate} ～ {item.endDate}
        </View>
        <View className={styles['box-info']}>
          <View className={styles['box-info-item']}>
            <Text className={styles['box-info-item-text1']}>
              {intl.formatMessage({ id: 'teamLeader.dingdanshuliang', defaultMessage: '订单数量' })}
            </Text>
            <Text className={styles['box-info-item-text2']}> {numFormat(item.orderNum)}</Text>
          </View>
          <View className={styles['box-info-item']}>
            <Text className={styles['box-info-item-text1']}>
              {intl.formatMessage({ id: 'teamLeader.dingdanjineyuan', defaultMessage: '订单金额（元）' })}
            </Text>
            <Text className={styles['box-info-item-text2']}>{priceFormat(item.orderAmount)}</Text>
          </View>
          <View className={styles['box-info-item']}>
            <Text className={styles['box-info-item-text1']}>
              {intl.formatMessage({ id: 'teamLeader.fanliyongjinyuan', defaultMessage: '返利佣金（元）' })}
            </Text>
            <Text className={styles['box-info-item-text2']}>{priceFormat(item.commissionAmount)}</Text>
          </View>
        </View>
        <View className={styles['box-bottom']}>
          <View className={styles['box-bottom-left']}>
            <View className={styles['box-bottom-left-view1']}>
              {intl.formatMessage({ id: 'teamLeader.fanli', defaultMessage: '返利' })}
            </View>
            <View className={styles['box-bottom-left-view2']}>
              <View className={styles['box-bottom-left-view2-line1']}>
                {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {priceFormat(item.minCommissionAmount)}~{intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {priceFormat(item.maxCommissionAmount)}
              </View>
              <View className={styles['box-bottom-left-view2-line2']}>
                {(item.minCommissionRate * 100).toFixed(0)}%~{(item.maxCommissionRate * 100).toFixed(0)}%
              </View>
            </View>
          </View>
          {item.status !== 3 && (
            <View
              className={styles['box-bottom-right']}
              onClick={(e) => {
                e.stopPropagation()
                handleEnrolled(item, index)
              }}
            >
              {item.signupStatus === 1
                ? intl.formatMessage({ id: 'teamLeader.chexiaobaoming', defaultMessage: '撤销报名' })
                : intl.formatMessage({ id: 'teamLeader.chongxinbaoming', defaultMessage: '重新报名' })}
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <View className={styles['activity']}>
      {/* tabs */}
      <View className={styles['tabs']}>
        {tabs.map((tab) => (
          <View
            key={tab.status}
            className={cx(styles['tab'], {
              [styles['tab-active']]: tab.status === activeTab,
            })}
            onClick={() => handleActiveTab(tab.status)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles['list']}>
        <ScrollView
          scrollY
          data={list}
          refresherEnabled
          lowerThreshold={1}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onScrollToLower={handleLoadMore}
          className={styles['scroll-list']}
          renderItem={renderItem}
          listEmptyComponent={<Empty />}
          listFooterComponent={
            list.length ? (
              <Loading loading={loading} noMore={hasMore} customStyle={{ marginTop: pxTransform(14) }} />
            ) : null
          }
        ></ScrollView>
      </View>

      <FullScreenLoading />

    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderEnrolledActivityList))
