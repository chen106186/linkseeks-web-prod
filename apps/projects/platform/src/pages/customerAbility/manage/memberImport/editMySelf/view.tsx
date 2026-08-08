import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useIntl } from '@linkseeks/i18n'

import MemberForm, { OperateType } from '../../../customerImport/customerForm'

const EditMySelf: React.FC = () => {
  const { id, validateId } = usePageStatus()
  const intl = useIntl()

  return (
    <MemberForm
      title={intl.formatMessage({
        id: 'customerAbility.import.edit.page.title',
        defaultMessage: '编辑客户注册资料',
      })}
      id={+id}
      validateId={+validateId}
      type={OperateType.myself}
    />
  )
}

export default EditMySelf
