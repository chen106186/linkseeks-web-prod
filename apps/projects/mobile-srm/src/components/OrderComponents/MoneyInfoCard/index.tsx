import React, { useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Icons } from '@apps/mobile-ui'
import InfoCard from '@/components/InfoCard'
import InfoWrap from '@/components/InfoWrap'
import PriceWrap from '@/components/PriceWrap'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

export type PropsType = {
  source: any
  showEditFreight?: boolean
}

const MoneyInfoCard = ({ source = {}, showEditFreight }: PropsType) => {
  const intl = useIntl()
  const [showMore, setShowMore] = useState<boolean>(true)

  return (
    <InfoCard
      title={intl.formatMessage({ id: 'order.paymentInfo', defaultMessage: '付款信息' })}
      subtitle={
        <View onClick={() => setShowMore((value) => !value)}>
          {showMore
            ? intl.formatMessage({ id: 'order.putAway', defaultMessage: '收起' })
            : intl.formatMessage({ id: 'order.seeMore', defaultMessage: '查看更多' })}
          <Icons
            name={showMore ? 'ChevronUp' : 'ChevronDown'}
            size={12}
            color="#91959B"
            customStyle={{ marginLeft: pxTransform(4) }}
          />
        </View>
      }
    >
      <InfoWrap
        title={intl.formatMessage({ id: 'order.paidInAmount', defaultMessage: '实付金额' })}
        subtitle={<PriceWrap money={source.totalAmount || '--'} />}
        last={!showMore}
      />
      {showMore && (
        <>
          <InfoWrap
            title={intl.formatMessage({ id: 'order.commodityAmount', defaultMessage: '商品金额' })}
            subtitle={`¥${source.productAmount || '--'}`}
          />
          <InfoWrap
            title={intl.formatMessage({ id: 'order.taxation', defaultMessage: '税费' })}
            subtitle={`¥${source.taxes || '--'}`}
          />
          <InfoWrap
            title={intl.formatMessage({ id: 'order.freight', defaultMessage: '运费' })}
            subtitle={
              // 配置了展示修改运费且数据显示可修改
              showEditFreight && source.showModifyFreight ? (
                <View
                  className={styles['edit-freight']}
                  onClick={() => Router.navigateTo('orderExamine/orderEditFreight', { orderId: source.orderId })}
                >
                  <View>¥{source.freight || '--'}</View>
                  <Icons name="Edit" size={12} color="#00A98F" customStyle={{ marginLeft: pxTransform(2) }} />
                  <View className={styles['text']}>{intl.formatMessage('common:common.edit', '修改')}</View>
                </View>
              ) : (
                `¥${source.freight || '--'}`
              )
            }
          />
          <InfoWrap
            title={intl.formatMessage({ id: 'order.salesPromotion', defaultMessage: '促销活动' })}
            subtitle={`-¥${source.promotionAmount || '--'}`}
          />
          <InfoWrap
            title={intl.formatMessage({ id: 'order.coupon', defaultMessage: '优惠券' })}
            subtitle={`-¥${source.couponAmount || '--'}`}
          />
          <InfoWrap
            title={intl.formatMessage({ id: 'order.commodityAmount', defaultMessage: '积分抵扣' })}
            subtitle={`-¥${source.deductionAmount || '--'}`}
            last
          />
        </>
      )}
    </InfoCard>
  )
}

MoneyInfoCard.defaultProps = {
  showEditFreight: false,
}

export default MoneyInfoCard
