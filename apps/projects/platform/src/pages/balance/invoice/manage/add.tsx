import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import InvoiceForm, { OperateType } from './invoiceForm'

const InvoiceAdd: React.FC = () => {
  const { reconciliationId, id } = usePageStatus()
  const intl = useIntl()

  return (
    <InvoiceForm
      title={intl.formatMessage({
        id: 'balance.invoice.add.page.title',
        defaultMessage: '新增开票',
      })}
      reconciliationId={Number(reconciliationId)}
      id={Number(id)}
      type={OperateType.add}
    />
  )
}

export default InvoiceAdd
