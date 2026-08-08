import { getMemberMemberRoleConfigGetMemberRoleById, postMemberMemberRoleConfigSetRoleAuth } from '@apps/apis'
import { BUSINESS_SOURCE_ENUMS } from '@apps/domains'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemberAuthContext } from '../contexts'
import { usePageStatus } from '@/hooks/usePageStatus'
import { splitButtonMenu } from '@apps/services/menuTree'

const useMemberAuth = () => {
  const { run, loading } = useRequestApi(postMemberMemberRoleConfigSetRoleAuth, { manual: true })
  const { id } = usePageStatus()
  const { data: authInfo } = useRequestApi(getMemberMemberRoleConfigGetMemberRoleById, { defaultParams: [{ id }] })
  const { menuDataRef, idRef } = useMemberAuthContext()
  const rebuildMemberAuth = (roleId: number, source: BUSINESS_SOURCE_ENUMS) => {
    const hashTreeData = menuDataRef.current

    run({
      ...splitButtonMenu(idRef.current, hashTreeData),
      roleId,
    })
  }

  return {
    rebuildMemberAuth,
    loading,
    authInfo,
  }
}

export default useMemberAuth
