import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import SupplierForm, { OperateType } from '../supplierForm'

const InvoiceDetail: React.FC = () => {
  const { validateId, id } = usePageStatus()
  const intl = useIntl()

  return (
    <SupplierForm
      title={intl.formatMessage({
        id: 'supplier.import.detail.page.title',
        defaultMessage: '供应商注册资料详情',
      })}
      validateId={Number(validateId)}
      id={Number(id)}
      type={OperateType.detail}
    />
  )
}

export default InvoiceDetail
