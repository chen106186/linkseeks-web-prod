import { useEffect, useState } from 'react'
import { getProductShopEnterpriseGetCategoryTree } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'

interface CategoryOptionType {
  value: string
  title: string
  children: CategoryOptionType[]
}

export const initCategoryData = (list: any, parentKey?: string, parentName?: string) => {
  if (!list) {
    return []
  }
  const result: any = list.map((item: any) => {
    let cid = `c${item.id}`
    let treeName = item.name
    if (parentKey) {
      cid = `${parentKey}_${cid}`
      treeName = `${parentName} ${treeName}`
    }

    const newItem: CategoryOptionType = {
      title: item.name,
      value: cid,
      children: [],
    }
    if (item.children && item.children.length > 0) {
      newItem.children = initCategoryData(item.children, cid, treeName)
    }
    return newItem
  })
  return result
}

const useSelectOptions = () => {
  const [categoryOptions, setCategoryOptions] = useState<CategoryOptionType[]>([])
  const { shopId } = usePageStatus()

  const fetchCategoryOptions = () => {
    getProductShopEnterpriseGetCategoryTree(
      {},
      {
        headers: {
          shopId,
        },
      },
    ).then((res) => {
      if (res.code === 1000 && res.data) {
        setCategoryOptions(initCategoryData(res.data))
      }
    })
  }

  useEffect(() => {
    fetchCategoryOptions()
  }, [])

  return {
    categoryOptions,
  }
}

export default useSelectOptions
