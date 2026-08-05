import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import SupplierForm, { OperateType } from '../customerForm'

const InvoiceEdit: React.FC = () => {
  const { validateId, id } = usePageStatus()
  const intl = useIntl()

  return (
    <SupplierForm
      title={intl.formatMessage({
        id: 'customerAbility.import.edit.page.title',
        defaultMessage: '编辑客户注册资料',
      })}
      validateId={Number(validateId)}
      id={Number(id)}
      type={OperateType.edit}
    />
  )
}

export default InvoiceEdit
