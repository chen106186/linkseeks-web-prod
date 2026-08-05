import { useMemoizedFn, useRequestApi } from '@linkseeks/hooks'
import { getMemberMenuConfigGetMenuConfigDetails, getProductCustomerGetCustomerCategory } from '@apps/apis'
import { useCategoryContext } from '../context'

const useNodeClick = () => {
  const contextValues = useCategoryContext()

  const { runAsync } = useRequestApi(getProductCustomerGetCustomerCategory, { manual: true })

  const handleClick = useMemoizedFn(async (node) => {
    const { data } = await runAsync({ id: node.id })
    if (data) {
      contextValues.setOperateType('Edit')
      contextValues.categoryForm.setFieldsValue({
        ...data,
      })
      contextValues.setSelectCategoryInfo(data)
    }
  })

  return {
    handleClick,
  }
}

export default useNodeClick
