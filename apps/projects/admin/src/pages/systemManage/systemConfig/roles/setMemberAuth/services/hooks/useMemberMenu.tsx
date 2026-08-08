import { getMemberMemberRoleConfigAuthTree } from '@apps/apis'
import useTreeCheck from '@apps/services/menuTree/hooks/useTreeCheck'
import { useMemberAuthContext } from '../contexts'

const useMemberMenu = ({ id, source }) => {
  const { setIds, setMenuData } = useMemberAuthContext()
  const { refreshData, treeRef } = useTreeCheck({
    request: async () => {
      const { data } = await getMemberMemberRoleConfigAuthTree({ id, source })
      const hashTreeData = treeRef.current.menuUtil.createHashTreeData(data.authTreeNodeList as any)

      setIds(data.checkIds)
      setMenuData(hashTreeData)
      return data
    },
  })

  return {
    refreshData,
    treeRef,
  }
}

export default useMemberMenu
