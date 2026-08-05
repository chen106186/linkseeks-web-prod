import React, { memo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import InfoWrap from '@/components/InfoWrap'

export type PropsType = {
  visible: boolean
  onClose: Function
  invoiceData: any
}

const customStyle = {
  fontSize: pxTransform(14),
  marginBottom: pxTransform(28),
}

const getInvoiceDetail = ({ invoiceKindName, invoiceTypeName, title, taxNo, bank, account, address, phone }) => {
  const intl = useIntl()
  return [
    { title: intl.formatMessage({ id: 'order.issuingType', defaultMessage: '开具类型' }), subtitle: invoiceKindName },
    { title: intl.formatMessage({ id: 'order.invoiceType', defaultMessage: '发票种类' }), subtitle: invoiceTypeName },
    { title: intl.formatMessage({ id: 'order.invoiceHeader', defaultMessage: '发票抬头' }), subtitle: title },
    { title: intl.formatMessage({ id: 'order.taxNumber', defaultMessage: '纳税号' }), subtitle: taxNo },
    { title: intl.formatMessage({ id: 'order.bankOfDeposit', defaultMessage: '开户行' }), subtitle: bank },
    { title: intl.formatMessage({ id: 'order.account', defaultMessage: '账号' }), subtitle: account },
    { title: intl.formatMessage({ id: 'order.address', defaultMessage: '地址' }), subtitle: address },
    { title: intl.formatMessage({ id: 'order.phone', defaultMessage: '电话' }), subtitle: phone },
  ]
}

const InvoicePopup = ({ visible, onClose, invoiceData }: PropsType) => {
  const intl = useIntl()
  return (
    <Popup
      title={intl.formatMessage({ id: 'order.invoiceInfo', defaultMessage: '发票信息' })}
      closeable
      visible={visible}
      onClose={() => onClose?.()}
      customStyle={{ height: '70vh' }}
    >
      <View style={{ padding: pxTransform(12) }}>
        {getInvoiceDetail(invoiceData).map((item) => (
          <InfoWrap key={item.title} title={item.title} subtitle={item.subtitle} customStyle={customStyle} />
        ))}
      </View>
    </Popup>
  )
}

InvoicePopup.defaultProps = {
  visible: false,
  invoiceData: {},
}

export default memo(InvoicePopup)
