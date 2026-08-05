/**
 * @Deprecated 发货周期组件
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import Bookshelf from '../Bookshelf'
import './index.scss'

interface DeliveryCycleProps {
  /**
   * 周期
   */
  days: number
}

const DeliveryCycle: React.FC<DeliveryCycleProps> = (props: DeliveryCycleProps) => {
  const { days } = props

  const intl = useIntl()

  if (!days) {
    return null
  }

  return (
    <Bookshelf.Item
      label={intl.formatMessage({ id: 'commodityMerge.components.stock.deliveryCycle', defaultMessage: '发货地' })}
      labelWidth={64}
      content={intl.formatMessage({ id: 'commodityMerge.components.stock.deliveryCycle.content', days })}
    />
  )
}

export default DeliveryCycle
