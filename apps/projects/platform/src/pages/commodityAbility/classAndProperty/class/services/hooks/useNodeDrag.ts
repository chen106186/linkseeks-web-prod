import { postProductCustomerCategorySort } from '@apps/apis'
import { useCategoryContext } from '../context'

const useNodeDrag = () => {
  const contextValues = useCategoryContext()
  /**
   * 是否可允许拖拽, 由外部传入
   */
  const onAllowDrop = (info: any) => {
    const { dragNode, node: targetNode, dropToGap } = info
    const targetParentId = dropToGap ? targetNode.parentId : targetNode.id
    return dragNode.parentId === targetParentId
  }

  const onDragDrop = async (info: any) => {
    const menuUtil = contextValues.treeRef.current.menuUtil

    if (!menuUtil) {
      throw '未传入menuUtil'
    }
    const { node: targetNode, dropToGap } = info
    const targetParentId = dropToGap ? targetNode.parentId : targetNode.id

    let childList: any[] = []
    if (Number(targetParentId) === 0) {
      // 根节点
      childList = menuUtil.getDataKeys(menuUtil.treeData)
    } else {
      menuUtil.loopTreeData(menuUtil.treeData, targetParentId, (node) => {
        if (node.children) {
          childList = menuUtil.getDataKeys(node.children)
        }
      })
    }
    console.log(childList, 'childList')
    return await postProductCustomerCategorySort({
      idList: childList,
    })
  }

  return {
    onAllowDrop,
    onDragDrop,
  }
}

export default useNodeDrag
