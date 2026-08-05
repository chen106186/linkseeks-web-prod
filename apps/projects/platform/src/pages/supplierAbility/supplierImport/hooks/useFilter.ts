import { useEffect, useState } from 'react'
import { getProductCustomerGetCustomerCategoryTree } from '@apps/apis'
import { CategoryItemType } from '../components/CommonFilter/Category'
import { FILTER_TYPE } from '../components/CommonFilter/types'

interface UseFilterProps {
  filterTypeList: FILTER_TYPE[]
}

export const initCategoryData = (list: any, parentKey?: string, parentName?: string) => {
  if (!list) {
    return []
  }
  const result: any = list.map((item: any) => {
    let cid = `c${item.id}`
    let treeName = item.title
    if (parentKey) {
      cid = `${parentKey}_${cid}`
      treeName = `${parentName} ${treeName}`
    }

    const newItem: CategoryItemType = {
      title: item.title,
      name: item.title,
      treeName: treeName,
      key: cid,
      id: item.id,
      brandList: item.brandList,
      categoryId: item?.categoryId,
    }
    if (item.children && item.children.length > 0) {
      newItem.children = initCategoryData(item.children, cid, treeName)
    }
    return newItem
  })
  return result
}

const useFilter = (props: UseFilterProps) => {
  const { filterTypeList = [] } = props
  const [categoryList, setCategoryList] = useState<CategoryItemType[]>([])
  const [filterLoading, setFilterLoading] = useState<boolean>(true)
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true)

  /**
   * 获取品类数据
   */
  const fetchCategoryList = async () => {
    const res = await getProductCustomerGetCustomerCategoryTree()
    if (res.code === 1000 && res.data) {
      const list = initCategoryData(res.data)
      setCategoryList(list)
    }
    setCategoryLoading(false)
  }

  useEffect(() => {
    if (filterTypeList.includes(FILTER_TYPE.category)) {
      fetchCategoryList()
    }
  }, [])

  useEffect(() => {
    if (!categoryLoading) {
      setFilterLoading(false)
    }
  }, [categoryLoading])

  return {
    categoryList,
    filterLoading,
  }
}

export default useFilter
