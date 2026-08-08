import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import OrderInfoChange from '@/components/OrderComponents/OrderInfoChange'

const OrderEditPrice = () => {
  const intl = useIntl()
  useEffect(() => {
    setNavigationBarTitle({ title: intl.formatMessage({ id: 'order.editPrice', defaultMessage: '修改单价' }) })
  }, [])

  return (
    <OrderInfoChange
      pageType="PRICE"
      inputTitle={intl.formatMessage({ id: 'order:order.itemPricing', defaultMessage: '商品单价(元)' })}
    />
  )
}

export default OrderEditPrice
