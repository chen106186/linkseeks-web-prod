import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import SupplierForm, { OperateType } from '../customerForm'

const InvoiceDetail: React.FC = () => {
  const { validateId, id } = usePageStatus()
  const intl = useIntl()

  return (
    <SupplierForm
      title={intl.formatMessage({
        id: 'customerAbility.import.detail.page.title',
        defaultMessage: '客户注册资料详情',
      })}
      validateId={Number(validateId)}
      id={Number(id)}
      type={OperateType.detail}
    />
  )
}

export default InvoiceDetail
