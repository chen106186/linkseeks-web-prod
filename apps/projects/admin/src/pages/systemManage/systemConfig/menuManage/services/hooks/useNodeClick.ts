import { useMemoizedFn, useRequestApi } from '@linkseeks/hooks'
import { getMemberMenuConfigGetMenuConfigDetails } from '@apps/apis'
import { useMenuContext, useMenuList } from '../context'

const useNodeClick = () => {
  const contextValues = useMenuContext()
  const { runAsync } = useRequestApi(getMemberMenuConfigGetMenuConfigDetails, { manual: true })
  const handleClick = useMemoizedFn(async (node) => {
    const { data } = await runAsync({ id: node.id })
    data?.buttons && contextValues.setButtonList(data.buttons)
    // 只能通过点击按钮触发, 如果是点击菜单，则重置接口
    contextValues.setInterfaceList([])
    contextValues.setSelectButton(null)
  })

  return {
    handleClick,
  }
}

export default useNodeClick
