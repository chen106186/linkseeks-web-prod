import type { TreeContextProps } from '@apps/components'
import { useRef } from 'react'

/**
 * 当使用StandardTree时， 有check场景 可使用该辅助hook
 */
const useTreeCheck = ({ request }) => {
  const treeRef = useRef<TreeContextProps>({} as any)
  const refreshData = async () => {
    const { authTreeNodeList: menuList, checkIds } = await request()
    treeRef.current.checkAction.setSelected(checkIds)
    // 告知外部数据已经有的数据集合

    return {
      data: menuList || [],
    }
  }

  return {
    refreshData,
    treeRef,
  }
}

export default useTreeCheck
