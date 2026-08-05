import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { ScrollView, View, Text } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import Loading from '@/components/Loading'
import Empty from '@/components/Empty'
import styles from './index.module.scss'
import { formatMoney, formatDateTime } from '../../utils/formatter'

interface GoodsItemCradProps {
  curMemberId: number
  type: string
  list: any[]
  loading: boolean
  hasMore?: boolean
  // 上拉加载更多
  onLoadMore?: () => void
  refreshing: boolean
  // 刷新回调
  onRefresh: () => void
  // 是否上拉加载更多
  enableLoadMore?: boolean
}

const GoodsItemCrad: React.FC<GoodsItemCradProps> = (props: GoodsItemCradProps) => {
  const { curMemberId, type, list, loading, hasMore, onLoadMore, refreshing, onRefresh, enableLoadMore } = props
  const intl = useIntl()

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View className={styles['item']} key={index}>
        {type === '2' && (
          <View className={styles['buy-info']}>
            <Text className={styles['buy-name']}>
              {intl.formatMessage({ id: 'reward.xiadanhuiyuan', defaultMessage: '下单会员：' })}
              {item.buyerMemberName}
            </Text>
            <Text>
              {item.directMemberId === curMemberId
                ? intl.formatMessage({ id: 'reward.zhijiefenxiaofanxian', defaultMessage: '直接分销返现' })
                : intl.formatMessage({ id: 'reward.yaoqingfenxiaofanxian', defaultMessage: '邀请分销返现' })}
            </Text>
          </View>
        )}
        <View className={styles['item-box']}>
          <View className={styles['top']}>
            <Text className={styles['name']}>{item.productName}</Text>
            {type === '2' && (
              // 分销明细页-如果为直接分销取directCommission，邀请分销取indirectCommission
              <Text className={styles['price']}>
                +
                {item.directMemberId === curMemberId
                  ? formatMoney(Number(item.directCommission))
                  : formatMoney(Number(item.indirectCommission))}
              </Text>
            )}
            {type === '1' && (
              // 邀请的分销员-明细
              <Text className={styles['price']}>+{formatMoney(Number(item.indirectCommission))}</Text>
            )}
          </View>
          <View className={styles['mt10']}>
            <Text>
              {intl.formatMessage({ id: 'reward.pinlei', defaultMessage: '品类：' })}
              {item.category}
            </Text>
          </View>
          <View className={styles['mt10']}>
            <Text>
              {intl.formatMessage({ id: 'reward.guanliandingdanhao', defaultMessage: '关联订单号：' })}
              {item.orderNo}
            </Text>
          </View>
          {item.commissionArrivalTime && (
            <View className={styles['mt10']}>
              <Text>
                {intl.formatMessage({ id: 'reward.fanxiandaozhangshijian', defaultMessage: '返现到账时间：' })}
                {formatDateTime(item.commissionArrivalTime)}
              </Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <View className={styles.list}>
      <ScrollView
        scrollY
        data={list}
        lowerThreshold={80}
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={onRefresh}
        onScrollToLower={enableLoadMore ? onLoadMore : undefined}
        className={styles['scroll-list']}
        renderItem={renderItem}
        listEmptyComponent={<Empty />}
        listFooterComponent={
          list.length > 0 ? (
            <Loading loading={loading} noMore={!hasMore} customStyle={{ marginTop: pxTransform(12) }} />
          ) : null
        }
      />
    </View>
  )
}

export default GoodsItemCrad
