import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text } from '@apps/mobile-ui'
import InfoCard from '@/components/InfoCard'
import Router from '@/utils/router'
import TextIcon from '@/components/TextIcon'
import styles from './index.module.scss'

export type PropsType = {
  itemData: any
  countTime: string
}

const MemberItemCard = ({ itemData, countTime }: PropsType) => {
  const intl = useIntl()
  return (
    <InfoCard
      title={itemData.memberName}
      subtitle={
        <View
          onClick={() => {
            Router.navigateTo('root/order/orderList', {
              keyword: itemData.memberName,
              memberId: itemData.memberId,
              memberRoleId: itemData.memberRoleId,
              month: countTime,
            })
          }}
        >
          <TextIcon text={intl.formatMessage({ id: 'achievement.viewOrder', defaultMessage: '查看订单' })} />
        </View>
      }
    >
      <View className={styles['main']}>
        <View className={styles['pay-wrap']}>
          <View>
            <View>{intl.formatMessage({ id: 'achievement.amountPayable', defaultMessage: '订单应付金额(元)' })}</View>
            <View className={styles['money']}>{itemData.amountPayable}</View>
          </View>
          <View>
            <View>{intl.formatMessage({ id: 'achievement.amountPaid', defaultMessage: '订单已付金额(元)' })}</View>
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
          <View>{intl.formatMessage({ id: 'member:member.numberRole', defaultMessage: '会员角色' })}</View>
          <View className={styles['times']}>{itemData.roleName}</View>
        </View>
        <View>
          <View>{intl.formatMessage({ id: 'member:member.numberOfOrders', defaultMessage: '下单次数' })}</View>
          <View className={styles['times']}>{itemData.orderCount}</View>
        </View>
      </View>
    </InfoCard>
  )
}

MemberItemCard.defaultProps = {
  itemData: {},
}

export default MemberItemCard
