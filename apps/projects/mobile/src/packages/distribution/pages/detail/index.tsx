import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React, { useEffect, useState } from 'react'
import { View, Image, Icons, Text } from '@apps/mobile-ui'
import NavBar from '@/components/NavBar'
import Router from '@/utils/router'
import { hideLoading, showLoading, showToast, useRouter } from '@apps/mobile-services/utils/taro'
import GoodsList from '../../components/GoodsList/index'
import { getOrderMobileSocialDistributionDownlineDetails } from '@apps/apis'
import styles from './index.module.scss'
import { formatDateFromTimestamp, formatMoney } from '../../utils/formatter'
const hearTopImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/fx-detail-img.png'
const logoIcon = 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/default_logo.png'

const DetailPage = () => {
  const intl = useIntl()

  const { memberId, memberName, joinTime, logo } = useRouter().params
  const decodedLogo = logo ? decodeURIComponent(logo) : ''
  const [detailList, setDetailList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    getDetailsInfo()
  }, [])

  const getDetailsInfo = async () => {
    if (loading) return
    setLoading(true)
    showLoading({
      title: intl.formatMessage({ id: 'distribution.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    const res = await getOrderMobileSocialDistributionDownlineDetails({ memberId })
    hideLoading()
    if (res.code === 1000) {
      const list = res.data || []
      setDetailList(list)
      setLoading(false)
    } else {
      showToast({
        title: res.message || intl.formatMessage({
          id: 'distribution.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
      setLoading(false)
    }
  }

  // 计算累计返现总和
  const getTotalCommission = (): number => {
    return detailList.reduce((total, item) => {
      const value = Number(item.indirectCommission)
      return total + (isNaN(value) ? 0 : value)
    }, 0)
  }

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true)
    if (refreshing) return
    setRefreshing(true)
    try {
      await getDetailsInfo()
    } catch (error) {
      console.error('刷新失败:', error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.headImgBox}>
        <Image src={hearTopImg} mode="aspectFit" className={styles.img}></Image>
      </View>
      <View className={styles.contains}>
        <NavBar
          customRenderLeft={
            <View style={{ flex: 2 }}>
              <Icons name="ChevronLeft" size={24} color="#fff" onClick={() => Router.navigateBack()} />
            </View>
          }
          customClassName={styles['header-nav']}
        />
        <View className={styles['user-info']}>
          <Image src={decodedLogo || logoIcon} className={styles['avatar']}></Image>
          <View className={styles['user']}>
            <Text className={styles['name']}>{memberName}</Text>
            <Text className={styles['op8']}>
              {intl.formatMessage({ id: 'distribution.yaoqingyu', defaultMessage: '邀请于 ' })}
              {formatDateFromTimestamp(Number(joinTime), 2)}
            </Text>
            <View className={styles['mt8']}>
              <Text className={styles['op8']}>
                {intl.formatMessage({ id: 'distribution。leijigongxianfanxian', defaultMessage: '累计贡献返现 ' })}
              </Text>
              <Text className={styles['bold']}>
                {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {formatMoney(getTotalCommission())}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles['goods']}>
          <GoodsList
            type="1"
            list={detailList}
            loading={loading}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            enableLoadMore={false}
          />
        </View>
      </View>
    </View>
  )
}

export default GlobalWrapper(DetailPage)
