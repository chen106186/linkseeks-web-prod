import React from 'react'
import { View, Text, Image, Icons } from '@apps/mobile-ui'
import styles from './index.module.scss'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'

interface Item {
	type: string;
	icon?: string;
	number?: number;
	orderNumber?: number;
	text: string;
}

interface MinePieceProps {
	title: string;
	pieceType?: string;
	showMore?: boolean;
	items: Item[];
}

const MinePiece = ({ title, pieceType = "", showMore = true, items }: MinePieceProps) => {

  const intl = useIntl()

  const handleViewAll = (pieceType: string) => {
    switch (pieceType) {
    case 'khdd':
      // 客户订单
      Router.navigateTo('teamLeader/groupPurchaseOrders', {statusValue: 0})
      break
    case 'tzshd':
      // 团长收货单
      Router.navigateTo('teamLeader/receiptList', {statusValue: 0})
      break
    case 'wdbmhd':
      // 我的报名活动
      Router.navigateTo('teamLeader/enrolledActivityList', {statusValue: 0})
      break
    default:
    }
  }

  const handleClick = (item: Item) => {
    switch (item.type) {
    case 'pending':
      // 客户订单-跳转待发货
      Router.navigateTo('teamLeader/groupPurchaseOrders', {statusValue: 1})
      break
    case 'shipping':
      // 客户订单-跳转待收货
      Router.navigateTo('teamLeader/groupPurchaseOrders', {statusValue: 2})
      break
    case 'finished':
      // 客户订单-跳转已完成
      Router.navigateTo('teamLeader/groupPurchaseOrders', {statusValue: 3})
      break
    case 'preparing':
      // 团长收货单-跳转备货中
      Router.navigateTo('teamLeader/receiptList', {statusValue: 1})
      break
    case 'delivering':
      // 团长收货单-跳转送货中
      Router.navigateTo('teamLeader/receiptList', {statusValue: 2})
      break
    case 'delivered':
      // 团长收货单-跳转已送达
      Router.navigateTo('teamLeader/receiptList', {statusValue: 3})
      break
    case 'notStarted':
      // 我的报名活动-跳转未开始
      Router.navigateTo('teamLeader/enrolledActivityList', {status: 1})
      break
    case 'ongoing':
      // 我的报名活动-跳转进行中
      Router.navigateTo('teamLeader/enrolledActivityList', {status: 2})
      break
    case 'over':
      // 我的报名活动-跳转已结束
      Router.navigateTo('teamLeader/enrolledActivityList', {status: 3})
      break
      // 其他类型
    default:
      console.log('点击了', item)
    }
  }

  return (
    <View className={styles['mine-piece']}>
      <View className={styles['mine-piece-top']}>
        <Text className={styles['mine-piece-top-title']}>{title}</Text>
        {showMore && (
          <View className={styles['mine-piece-top-right']} onClick={() => handleViewAll(pieceType)}>
            <Text className={styles['mine-piece-top-text']}>
              {intl.formatMessage({ id: 'teamLeader.quanbu', defaultMessage: '全部' })}
            </Text>
            <Icons name="ChevronRight" size={12} color="#C8CACD" />
          </View>
        )}
      </View>

      <View className={styles['mine-piece-row']}>
        {items.map((item, index) => (
          <View className={styles['mine-piece-row-view']} key={index}
            onClick={() => handleClick(item)}>
            {item.icon ? (
              <>
                <Image className={styles['mine-piece-row-icon']} src={item.icon} />
                <Text className={styles['mine-piece-row-text']}>{item.text}</Text>
                {(Number(item.orderNumber) > 0) ? (
                  <View className={styles['mine-piece-row-box']}>{item.orderNumber}</View>
                ) : null}
              </>
            ) : (
              <>
                <Text className={styles['mine-piece-row-text2']}>{item.number}</Text>
                <Text className={styles['mine-piece-row-text']}>{item.text}</Text>
              </>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

export default MinePiece
