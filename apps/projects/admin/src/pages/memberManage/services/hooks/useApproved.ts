import { usePageStatus } from '@/hooks/usePageStatus'
import {
  postMemberMaintenanceCancellationAuth,
  postMemberValidateCommitSubmit,
  postMemberValidateConfirmSubmit,
  postMemberValidateStep1Submit,
  postMemberValidateStep2Submit,
} from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useHistory } from '@linkseeks/router-core'
import { useMemo, useRef } from 'react'

export enum ApprovedType {
  // 待审核1级
  oneStep = 1,
  // 待审核2级
  twoStep,
  // 待确认审核
  confirm,
  // 待提交审核
  submit,
}

interface ApprovedProps {
  type: ApprovedType
}
const useApproved = ({ type }: ApprovedProps) => {
  const { id, validateId } = usePageStatus()
  const modalRef = useRef<any>({})
  const history = useHistory()
  const api = useMemo(() => {
    switch (type) {
      case ApprovedType.oneStep:
        return postMemberValidateStep1Submit
      case ApprovedType.twoStep:
        return postMemberValidateStep2Submit
      case ApprovedType.confirm:
        return postMemberValidateConfirmSubmit
      case ApprovedType.submit:
        return postMemberValidateCommitSubmit
    }
  }, [type])

  const { run, loading } = useRequestApi(api, {
    manual: true,
    onSuccess() {
      modalRef.current.toggle(false)
      history.goBack()
    },
  })

  const handleSubmit = (values) => {
    run({
      memberId: id,
      validateId,
      ...values,
    })
  }

  return {
    loading,
    handleSubmit,
    modalRef,
  }
}

export default useApproved
