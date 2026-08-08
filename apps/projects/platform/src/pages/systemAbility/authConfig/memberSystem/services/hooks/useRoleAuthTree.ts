import { getMemberRoleAuthTree } from '@apps/apis'
import useTreeCheck from '@apps/services/menuTree/hooks/useTreeCheck'
import { useRoleAuthTreeContext } from '../contexts'

const useRoleMenuTree = ({ id }) => {
  const { setIds, setMenuData } = useRoleAuthTreeContext()
  const { refreshData, treeRef } = useTreeCheck({
    request: async () => {
      const { data } = await getMemberRoleAuthTree({ roleId: id })
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

export default useRoleMenuTree
