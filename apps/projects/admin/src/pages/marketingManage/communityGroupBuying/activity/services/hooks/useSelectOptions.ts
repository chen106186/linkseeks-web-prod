import { getProductSelectGetSelectPlatformBrand, getProductPlatformGetCategoryTree } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const dealTreeData = (treeData) => {
  const data = treeData?.map((item) => ({
    ...item,
    // label字段处理
    label: item.name || item.title,
    value: item.id,
    // 如果children为空数组，则置为null
    children: item.children && item.children.length ? dealTreeData(item.children) : null,
  }))
  return data
}

const useSelectOptions = () => {
  const { data } = useRequestApi(getProductSelectGetSelectPlatformBrand)
  const { data: categoryTreeData } = useRequestApi(getProductPlatformGetCategoryTree)

  const selectData = useMemo(
    () => ({
      brandId: data?.map((item) => ({ label: item.name, value: item.id })),
      categoryId: dealTreeData(categoryTreeData),
    }),
    [data, categoryTreeData],
  )

  return selectData
}

export default useSelectOptions
