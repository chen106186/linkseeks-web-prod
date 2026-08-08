import { usePageStatus } from '@/hooks/usePageStatus'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo, useRef } from 'react'
import { useMemberInfo } from '../contexts/memberContext'
import { MEMBER_STATUS_FROZEN, MEMBER_STATUS_NORMAL } from '@/constants/const/member'
import { postMemberMaintenanceStatus } from '@apps/apis'
import { useHistory } from '@linkseeks/router-core'

const useFreeze = () => {
  const { id, validateId } = usePageStatus()
  const { memberMaintainInfo } = useMemberInfo()
  const history = useHistory()
  const isFreeze = useMemo(() => {
    if (memberMaintainInfo?.status) {
      return memberMaintainInfo.status === MEMBER_STATUS_FROZEN
    }

    // 说明状态出现问题了
    return null
  }, [memberMaintainInfo])

  const isNormal = useMemo(() => {
    if (memberMaintainInfo?.status) {
      return memberMaintainInfo.status === MEMBER_STATUS_NORMAL
    }

    // 说明状态出现问题了
    return null
  }, [memberMaintainInfo])
  const { run, loading } = useRequestApi(postMemberMaintenanceStatus, {
    manual: true,
    onSuccess() {
      history.goBack()
    },
  })

  const handleSubmit = (values) => {
    if (isFreeze !== null) {
      run({
        memberId: id,
        validateId,
        status: isFreeze ? MEMBER_STATUS_NORMAL : MEMBER_STATUS_FROZEN,
        ...values,
      })
    } else {
      throw '提交异常, 当前返回会员信息中没有状态字段'
    }
  }
  return {
    // 当前状态是否冻结
    isFreeze,
    isNormal,
    handleSubmit,
    loading,
  }
}

export default useFreeze
