import { getPayAllInPayGetMemberInfo, GetPayAllInPayGetMemberInfoResponse } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo, useEffect } from 'react'

// 获取当前用户e账户的账户信息
export const useEAccountMemberInfo = (options?: { isRefresh: boolean }) => {
  const { isRefresh } = options || {}
  const {
    data: memberInfo,
    loading: payMemberInfoLoading,
    run,
    runAsync,
    refresh: refreshPayMemberInfo,
  } = useRequestApi<GetPayAllInPayGetMemberInfoResponse, any>(getPayAllInPayGetMemberInfo, { manual: true })

  useEffect(() => {
    if (isRefresh) {
      refreshPayMemberInfo()
    }
  }, [isRefresh])

  const isFinishProcess = useMemo(() => {
    // 等于3是完成了整个签署
    return memberInfo?.step === 3
  }, [memberInfo])

  const isFinishMoneyProcess = useMemo(() => {
    // 等于2是代表可以使用通联支付了，但不能提现，如果要提现需要签署最后一步的协议
    return memberInfo?.step ? memberInfo?.step >= 2 : false
  }, [memberInfo])

  const isExpiredProcess = useMemo(() => {
    // 是否已经过期
    return !!memberInfo?.regInviteLinkExpired
  }, [memberInfo])

  const isExistProcess = useMemo(() => {
    // 是否已经开始发起认证
    return memberInfo && memberInfo?.step >= 1
  }, [memberInfo])
  return {
    memberInfo,
    payMemberInfoLoading,
    refreshPayMemberInfo: run,
    initPayMemberInfo: runAsync,
    isFinishProcess,
    isSelf: memberInfo?.memberType === 2,
    isEnterprise: memberInfo?.memberType === 1,
    isFinishMoneyProcess,
    isExpiredProcess,
    isExistProcess,
  }
}
