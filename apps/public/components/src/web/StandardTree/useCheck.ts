import { useSelections } from '@linkseeks/hooks'
import { ITreeDataItem, TreeId } from './MenuUtil'
import { useTree } from './context'
import { useRef } from 'react'

const useCheck = (menuUtil) => {
  const selfCheckData = useRef<any[]>([])
  const { setSelected, selected, allSelected, toggleAll, isSelected } = useSelections<number | string>(
    menuUtil.getTreeDataKeys(menuUtil.treeData),
  )

  /**
   * 点击选择触发
   */
  const handleChecked = (node: ITreeDataItem) => {
    // 多节点操作逻辑
    if (node.children) {
      // 命中的节点key
      const selectKeys = [node.id, ...menuUtil.getTreeDataKeys(node.children)]
      // 命中的节点是已选中节点的子集，则说明需反选对应节点
      if (selectKeys.every((v) => selected.includes(v))) {
        selfCheckData.current = selected.filter((v) => !selectKeys.includes(v))
      } else {
        // 若不是全部命中，则应该选中该节点下的所有节点
        selfCheckData.current = [...selected, ...selectKeys]
      }
    } else {
      // 单节点操作
      if (isSelected(node.key)) {
        selfCheckData.current = selected.filter((v) => v !== node.key)
      } else {
        selfCheckData.current = [...selected, node.key]
      }
    }
    setSelected(selfCheckData.current)

    return selfCheckData.current
  }

  return {
    handleChecked,
    setSelected,
    allSelected,
    selected,
    toggleAll,
    selfCheckData: selfCheckData.current,
  }
}

export default useCheck
