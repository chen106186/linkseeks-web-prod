import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import SupplierForm, { OperateType } from '../supplierForm'

const InvoiceEdit: React.FC = () => {
  const { validateId, id } = usePageStatus()
  const intl = useIntl()

  return (
    <SupplierForm
      title={intl.formatMessage({
        id: 'supplier.import.edit.page.title',
        defaultMessage: '编辑供应商注册资料',
      })}
      validateId={Number(validateId)}
      id={Number(id)}
      type={OperateType.edit}
    />
  )
}

export default InvoiceEdit
