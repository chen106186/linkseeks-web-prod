/**
 * 客户考评 > 待新建考评单 > 新增/编辑/查看 考评单
 */
import React, { useEffect, useMemo, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useWebIntl } from '@apps/locales'
import { message } from 'antd'
import MemberEvaluationCreationForm, { SubmitCallValueType } from './components/MemberEvaluationCreationForm'

import {
  getMemberCustomerAppraisalWaitPublishGet,
  postMemberCustomerAppraisalWaitPublishAdd,
  postMemberCustomerAppraisalWaitPublishUpdate,
} from '@apps/apis'

const MemberEvaluationCreation: React.FC<{}> = () => {
  const { id, preview } = usePageStatus()
  const isEditMode = useMemo(() => preview !== '1', [preview])
  const intl = useIntl()
  const translate = useWebIntl()
  const [formValue, setFormValue] = useState<SubmitCallValueType>()

  const titleRender = () => {
    return isEditMode
      ? id
        ? `${intl.formatMessage({ id: 'member.memberEvaluate.createEvaluate.add.modifyEvaluateInvoice' })}`
        : `${intl.formatMessage({ id: 'member.memberEvaluate.createEvaluate.add.addEvaluateInvoice' })}`
      : `${intl.formatMessage({ id: 'member.memberEvaluate.createEvaluate.add.viewEvaluateInvoice' })}`
  }

  const getMemberEvaluationDetail = async () => {
    const res = await getMemberCustomerAppraisalWaitPublishGet({ id })
    if (res.code === 1000) {
      setFormValue(res.data)
    }
  }

  const onMemberEvaluationCreationFormSubmit = (value: SubmitCallValueType): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: translate('web.common.saving_wating'),
        duration: 0,
      })
      const requestFunction = id
        ? () => postMemberCustomerAppraisalWaitPublishUpdate({ id: +id, ...value })
        : () => postMemberCustomerAppraisalWaitPublishAdd(value)
      requestFunction()
        .then((res) => {
          if (res.code === 1000) {
            resolve()
            setTimeout(() => {
              history.goBack()
            }, 800)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          msg()
        })
    })

  useEffect(() => {
    id && getMemberEvaluationDetail()
  }, [])

  return (
    <MemberEvaluationCreationForm
      value={formValue}
      title={titleRender()}
      mode={isEditMode ? (id ? 'edition' : 'creation') : 'preview'}
      onSubmit={onMemberEvaluationCreationFormSubmit}
    />
  )
}

export default MemberEvaluationCreation
