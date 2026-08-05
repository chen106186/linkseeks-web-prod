import { useMemo } from 'react'
import { useEAccountMemberInfo } from './useEAccountMemberInfo'

// 校验当前用户在通联下是否有绑定过手机
export const useValidateBindPhone = () => {
  const { memberInfo } = useEAccountMemberInfo()

  const isCheckBindPhone = useMemo(() => {
    return !!memberInfo?.isPhoneChecked
  }, [memberInfo])

  return {
    isCheckBindPhone,
    memberInfo,
  }
}
