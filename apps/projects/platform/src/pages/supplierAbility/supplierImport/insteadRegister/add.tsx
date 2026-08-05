import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import InvoiceForm, { OperateType } from '../supplierForm'

const InvoiceAdd: React.FC = () => {
  const { validateId, id } = usePageStatus()
  const intl = useIntl()

  return (
    <InvoiceForm
      title={intl.formatMessage({
        id: 'supplier.import.add.page.title',
        defaultMessage: '新增供应商注册资料',
      })}
      validateId={Number(validateId)}
      id={Number(id)}
      type={OperateType.add}
    />
  )
}

export default InvoiceAdd
