import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import InfoCard from '@/components/InfoCard'
import InfoWrap from '@/components/InfoWrap'

export type PropsType = {
  source: any
  showEditRatio?: boolean
}

enum PAY_COUNT_TYPE {
  NO_PAY, // 无需支付
  ONE_PAY, // 一次性支付
  MANY_PAY, // 多次支付
}

/**
 * @description
 * case1：若工作流无需支付，则不显示支付方式和支付时间；
 *
 * case2：若工作流是一次性支付，则显示支付方式和支付时间；
 *
 * case3：若工作流是多次支付，则显示支付次数和支付信息字段
 * @returns
 */
const PayInfoCard = ({ source = {}, showEditRatio }: PropsType) => {
  const intl = useIntl()
  return (
    <InfoCard title={intl.formatMessage({ id: 'order.payInfo', defaultMessage: '支付信息' })}>
      {source.payTimes === PAY_COUNT_TYPE.NO_PAY && (
        <InfoWrap
          title={intl.formatMessage({ id: 'order.payType', defaultMessage: '支付方式' })}
          subtitle={intl.formatMessage({ id: 'order.noPaymentRequired', defaultMessage: '无需支付' })}
          last
        />
      )}
      {source.payTimes === PAY_COUNT_TYPE.ONE_PAY && (
        <>
          <InfoWrap
            title={intl.formatMessage({ id: 'order.payType', defaultMessage: '支付方式' })}
            subtitle={source.payChannelName}
          />
          <InfoWrap
            title={intl.formatMessage({ id: 'order.payTime', defaultMessage: '支付时间' })}
            subtitle={source.payTime}
            last
          />
        </>
      )}
      {source.payTimes >= PAY_COUNT_TYPE.MANY_PAY && (
        <>
          <InfoWrap
            title={intl.formatMessage({ id: 'order.payCount', defaultMessage: '支付次数' })}
            subtitle={`${intl.formatMessage({ id: 'order.fen', defaultMessage: '分' })} ${
              source.payTimes
            } ${intl.formatMessage({ id: 'order.count', defaultMessage: '次' })}${intl.formatMessage({
              id: 'order.pay',
              defaultMessage: '支付',
            })}`}
          />
          <InfoWrap
            title={intl.formatMessage({ id: 'order.payInfo', defaultMessage: '支付信息' })}
            subtitle={intl.formatMessage({ id: 'order.seeInfo', defaultMessage: '查看信息' })}
            subType="click"
            onSunTitleCallBack={() => {
              Router.navigateTo('root/order/payInfo', { showEditRatio, orderId: source.orderId })
            }}
            last
          />
        </>
      )}
    </InfoCard>
  )
}

export default PayInfoCard
