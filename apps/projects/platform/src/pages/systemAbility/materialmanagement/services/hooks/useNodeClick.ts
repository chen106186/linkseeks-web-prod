import { useMemoizedFn, useRequestApi } from '@linkseeks/hooks'
import { getManageMaterialLibraryPage } from '@apps/apis'
import { message } from '@linkseeks/ui'
import { useMaterialContext } from '../context'

const useNodeClick = () => {
  const contextValues = useMaterialContext()

  const { runAsync } = useRequestApi(getManageMaterialLibraryPage, { manual: true })

  const handleClick = useMemoizedFn(async (node) => {
    if (!contextValues.treeRef.current.selectNode || contextValues.treeRef.current.selectNode.id !== node.id) {
      const { data, code, message: msg } = await runAsync({ parentId: node.id })
      if (code === 1000 && data) {
        contextValues.setOperateType('Edit')
        contextValues.setSelectMaterialList(data)
      } else {
        message.destroy()
        message.error(msg)
      }
    }
  })

  return {
    handleClick,
  }
}

export default useNodeClick
