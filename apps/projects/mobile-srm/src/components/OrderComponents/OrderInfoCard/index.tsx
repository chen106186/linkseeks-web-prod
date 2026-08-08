import React, { useState, useCallback } from 'react'
import InfoCard from '@/components/InfoCard'
import InfoWrap from '@/components/InfoWrap'
import { useIntl } from '@linkseeks/i18n'
import InvoicePopup from '../InvoicePopup'

export type PropsType = {
  source: any
}

const OrderInfoCard = ({ source = {} }: PropsType) => {
  const intl = useIntl()
  const [visible, setVisible] = useState<boolean>(false)

  const onClose = useCallback(() => setVisible(false), [])

  return (
    <>
      <InfoCard title={intl.formatMessage({ id: 'order.orderInfo', defaultMessage: '订单信息' })}>
        <InfoWrap
          title={intl.formatMessage({ id: 'order.orderCode', defaultMessage: '订单编号' })}
          subtitle={source.orderNo}
          subType="copy"
        />
        {source.quoteNo && (
          <InfoWrap
            title={intl.formatMessage({ id: 'order.correspondingQuotationNo', defaultMessage: '对应报价单号' })}
            subtitle={source.quoteNo}
            subType="copy"
          />
        )}
        <InfoWrap
          title={intl.formatMessage({ id: 'order.orderSummary', defaultMessage: '订单摘要' })}
          subtitle={source.digest}
        />
        {source.deliverTime && (
          <InfoWrap
            title={intl.formatMessage({ id: 'order.deliveryTime', defaultMessage: '送货时间' })}
            subtitle={source.deliverTime}
          />
        )}
        <InfoWrap
          title={intl.formatMessage({ id: 'order.orderRemarks', defaultMessage: '订单备注' })}
          subtitle={source.requirement?.remark}
        />
        {source.invoice?.title && (
          <InfoWrap
            title={intl.formatMessage({ id: 'order.invoice', defaultMessage: '发票' })}
            subtitle={source.invoice.title}
            subType="click"
            onSunTitleCallBack={() => setVisible(true)}
          />
        )}
        {source.contractFileName && (
          <InfoWrap
            title={intl.formatMessage({ id: 'order.electronicContract', defaultMessage: '电子合同' })}
            subtitle={source.contractFileName}
            subType="click"
            onSunTitleCallBack={() => {}}
          />
        )}
        <InfoWrap
          title={intl.formatMessage({ id: 'order.orderTime', defaultMessage: '下单时间' })}
          subtitle={source.createTime}
        />
        <InfoWrap
          title={intl.formatMessage({ id: 'order.sourceMall', defaultMessage: '来源商城' })}
          subtitle={source.shopName}
          last
        />
      </InfoCard>

      <InvoicePopup visible={visible} onClose={onClose} invoiceData={source.invoice || {}} />
    </>
  )
}

export default OrderInfoCard
