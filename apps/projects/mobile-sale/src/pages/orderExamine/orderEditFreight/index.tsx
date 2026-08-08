import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import OrderInfoChange from '@/components/OrderComponents/OrderInfoChange'

const OrderEditFreight = () => {
  const intl = useIntl()
  useEffect(() => {
    setNavigationBarTitle({ title: intl.formatMessage({ id: 'order.modifyFreight', defaultMessage: '修改运费' }) })
  }, [])

  return (
    <OrderInfoChange
      pageType="FREIGHT"
      inputTitle={intl.formatMessage({ id: 'order.orderFreight', defaultMessage: '订单运费(元)' })}
    />
  )
}

export default OrderEditFreight
