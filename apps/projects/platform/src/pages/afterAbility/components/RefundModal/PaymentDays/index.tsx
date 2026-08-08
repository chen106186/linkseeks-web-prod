import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Descriptions, Divider } from 'antd'
import { priceFormat } from '@/utils/numberFomat'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
interface MonthlyStatementProps {
  /**
   * 弹窗需要的数据值
   */
  value: {
    /**
     * 退款金额
     */
    refundAmount: number
    /**
     * 支付方式
     */
    payWay: string
    /**
     * 支付渠道
     */
    payChannel: string
  }
}

const MonthlyStatement: React.FC<MonthlyStatementProps> = ({ value }) => {
  const intl = useIntl()

  return (
    <div className={styles['payment-days']}>
      <Descriptions column={1}>
        <Descriptions.Item
          label={`${intl.formatMessage({
            id: 'afterService.components.RefundModal.refundAmount',
            defaultMessage: '当前退款金额',
          })}(${translate('web.common.currencySymbol')})`}
        >
          <span className={styles['amount-plus']}>{`${intl.formatMessage({
            id: 'common.money',
            defaultMessage: '￥',
          })}${priceFormat(value.refundAmount)}`}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'afterService.components.COD.payType', defaultMessage: '支付方式' })}
          style={{
            paddingBottom: 0,
          }}
        >
          {value.payWay}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'afterService.components.MonthlyStatement.payChannel',
            defaultMessage: '支付渠道',
          })}
          style={{
            paddingBottom: 0,
          }}
        >
          {value.payChannel}
        </Descriptions.Item>
      </Descriptions>
      <Divider dashed />
      <p className={styles.tip}>
        {intl.formatMessage({
          id: 'afterService.components.PaymentDays.tip',
          defaultMessage:
            '支付方式为账期的订单，用户确认退款方式与退款金额后，系统会按照支付流程来完成退款动作，实际资金的退款由交易双方通过结算流程处理。',
        })}
      </p>
    </div>
  )
}

export default MonthlyStatement
