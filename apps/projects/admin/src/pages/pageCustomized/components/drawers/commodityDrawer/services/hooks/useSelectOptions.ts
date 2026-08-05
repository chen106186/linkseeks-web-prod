import {
  getProductCommodityTemplateGetBrandList,
  getProductCommodityTemplateGetFirstCategoryListByMemberId,
} from '@apps/apis'
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

const useSelectOptions = ({ shopId }) => {
  const { data } = useRequestApi(getProductCommodityTemplateGetBrandList, {
    defaultParams: [
      {
        shopId,
        current: '1',
        pageSize: '100',
      },
    ],
  })
  const { data: categoryTreeData } = useRequestApi(getProductCommodityTemplateGetFirstCategoryListByMemberId, {
    defaultParams: [{ shopId }],
  })

  const selectData = useMemo(
    () => ({
      brandId: data?.data?.map((item) => ({ label: item.name, value: item.id })),
      categoryId: dealTreeData(categoryTreeData),
    }),
    [data, categoryTreeData],
  )

  return selectData
}

export default useSelectOptions
