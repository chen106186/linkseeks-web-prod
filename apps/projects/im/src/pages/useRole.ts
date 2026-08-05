import { authService } from '@apps/services'
import { useQuery } from '@linkseeks/router-core'

export const useRole = () => {
  const auth = authService.getAuth()
  const { admin } = useQuery()
  const roleType = auth.roleTag
  return {
    // 采购商
    isConsumer: roleType === 1,
    // 供应商
    isSupplier: roleType === 2,
    // 平台
    isAdmin: admin == 1,

    memberId: auth.memberId,
  }
}
