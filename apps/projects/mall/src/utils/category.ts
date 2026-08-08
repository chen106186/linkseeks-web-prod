import { CategoryItemType } from '@/types/commodity'

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

    const newItem: CategoryItemType = {
      title: item.name,
      name: item.name,
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
