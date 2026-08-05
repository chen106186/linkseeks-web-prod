import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import Router from '@/utils/router'
import InfoCard from '@/components/InfoCard'
import TextIcon from '@/components/TextIcon'
import { changeYearMonth } from '@/utils/date'
import styles from './index.module.scss'

export type PropsType = {
  itemData: any
}

const AchievementItemCard = ({ itemData }: PropsType) => {
  const intl = useIntl()
  return (
    <InfoCard
      title={changeYearMonth(itemData.monthStatistical)}
      subtitle={
        <TextIcon
          text={intl.formatMessage({ id: 'achievement.viewOrder', defaultMessage: '查看订单' })}
          onClick={() =>
            Router.navigateTo('root/order/orderList', { month: itemData.monthStatistical?.substring(0, 7) })
          }
        />
      }
    >
      <View className={styles['main']}>
        <View className={styles['pay-wrap']}>
          <View>
            <View>{intl.formatMessage({ id: 'achievement.amountPayable', defaultMessage: '订单应付金额(元)' })}</View>
            <View className={styles['money']}>{itemData.amountPayable}</View>
          </View>
          <View>
            <View>{intl.formatMessage({ id: 'achievement.amountReceived', defaultMessage: '已收款金额(元)' })}</View>
            <View className={styles['money']}>{itemData.amountPaid}</View>
          </View>
        </View>
        <View>
          {intl.formatMessage({ id: 'achievement.afterSalesRefund', defaultMessage: '售后退款(元)' })}{' '}
          {itemData.refundAmount}
        </View>
      </View>
      <View className={styles['footer']}>
        <View>
          <View>{intl.formatMessage({ id: 'achievement.orderMember', defaultMessage: '下单会员' })}</View>
          <View className={styles['number']}>{itemData.memberCount}</View>
        </View>
        <View>
          <View>{intl.formatMessage({ id: 'achievement.orderQuantity', defaultMessage: '订单数量' })}</View>
          <View className={styles['number']}>{itemData.orderCount}</View>
        </View>
        <View>
          <View>{intl.formatMessage({ id: 'achievement.quantityOfGoods', defaultMessage: '商品数量' })}</View>
          <View className={styles['number']}>{itemData.commodityCount}</View>
        </View>
        <View>
          <View>{intl.formatMessage({ id: 'achievement.categoryQuantity', defaultMessage: '品类数量' })}</View>
          <View className={styles['number']}>{itemData.categoryCount}</View>
        </View>
      </View>
    </InfoCard>
  )
}

AchievementItemCard.defaultProps = {
  itemData: {},
}

export default AchievementItemCard
