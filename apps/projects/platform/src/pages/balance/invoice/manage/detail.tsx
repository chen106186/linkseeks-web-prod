import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import InvoiceForm, { OperateType } from './invoiceForm'

const InvoiceDetail: React.FC = () => {
  const { reconciliationId, id } = usePageStatus()
  const intl = useIntl()

  return (
    <InvoiceForm
      title={intl.formatMessage({
        id: 'balance.invoice.detail.page.title',
        defaultMessage: '发票详情',
      })}
      reconciliationId={Number(reconciliationId)}
      id={Number(id)}
      type={OperateType.detail}
    />
  )
}

export default InvoiceDetail
