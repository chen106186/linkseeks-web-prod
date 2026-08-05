import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import InvoiceForm, { OperateType } from './invoiceForm'

const InvoiceEdit: React.FC = () => {
  const { reconciliationId, id } = usePageStatus()
  const intl = useIntl()

  return (
    <InvoiceForm
      title={intl.formatMessage({
        id: 'balance.invoice.edit.page.title',
        defaultMessage: '编辑发票',
      })}
      reconciliationId={Number(reconciliationId)}
      id={Number(id)}
      type={OperateType.edit}
    />
  )
}

export default InvoiceEdit
