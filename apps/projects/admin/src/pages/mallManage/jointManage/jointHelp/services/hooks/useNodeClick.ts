import { useMemoizedFn, useRequestApi } from '@linkseeks/hooks'
import { getCommodityShopHelpInfoDetail } from '@apps/apis'
import { useHelpfulContext } from '../context'
import { message } from '@linkseeks/ui'
import { BraftEditor } from '@apps/components'

const useNodeClick = () => {
  const contextValues = useHelpfulContext()

  const { runAsync } = useRequestApi(getCommodityShopHelpInfoDetail, { manual: true })

  const handleClick = useMemoizedFn(async (node) => {
    if (!contextValues.treeRef.current.selectNode || contextValues.treeRef.current.selectNode.id !== node.id) {
      const { data, code, message: msg } = await runAsync({ id: node.id })
      if (code === 1000 && data) {
        contextValues.setOperateType('Edit')
        contextValues.setSelectHelpfulInfo(undefined)
        contextValues.helpfulForm.setFieldsValue({
          ...data,
          helpContent: BraftEditor.createEditorState(data.helpContent),
        })
        contextValues.setSelectHelpfulInfo(data)
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
