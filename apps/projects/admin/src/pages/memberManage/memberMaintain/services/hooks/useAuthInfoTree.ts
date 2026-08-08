import {
  getMemberMaintenanceDetailAuthTree,
  getMemberManageRoleAuthTree,
  getMemberMemberRoleConfigAuthTree,
  postMemberMaintenanceDetailSetRelationAuth,
} from '@apps/apis'
import { splitButtonMenu } from '@apps/services/menuTree'
import useTreeCheck from '@apps/services/menuTree/hooks/useTreeCheck'
import { useRequestApi } from '@linkseeks/hooks'

const useAuthInfoTree = ({ id, validateId, setIds, setMenuData, idRef, menuDataRef }) => {
  const { refreshData, treeRef } = useTreeCheck({
    request: async () => {
      const { data } = await getMemberMaintenanceDetailAuthTree({ memberId: id, validateId })
      const hashTreeData = treeRef.current.menuUtil.createHashTreeData(data.authTreeNodeList as any)

      setIds(data.checkIds)
      setMenuData(hashTreeData)
      return data
    },
  })

  const { run, loading } = useRequestApi(postMemberMaintenanceDetailSetRelationAuth, { manual: true })

  const handleSubmit = () => {
    run({
      memberId: id,
      validateId,
      ...splitButtonMenu(idRef.current, menuDataRef.current),
    })
  }
  return {
    refreshData,
    treeRef,
    handleSubmit,
    loading,
  }
}

export default useAuthInfoTree
