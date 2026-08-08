import { getPayAllInPayGetMemberInfo, GetPayAllInPayGetMemberInfoResponse } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'

export const useGetAuthMember = () => {
  const { data } = useRequestApi<GetPayAllInPayGetMemberInfoResponse, any>(getPayAllInPayGetMemberInfo)
  return {
    authMemberInfo: data,
  }
}
