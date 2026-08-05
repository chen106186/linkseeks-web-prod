export type CategoryType = {
  /**
   * 层级
   */
  level: number
  /**
   * 品类id
   */
  categoryId: number
  /**
   * 品类名称
   */
  name: string
  /**
   * 子节点
   */
  children?: CategoryType[]
  /**
   * 父级id
   */
  parentId: number
  /**
   * 父级
   */
  parent?: CategoryType
}

export function getCategoryAllKeys(dataSource: CategoryType[]): string[][] {
  const ret: string[][] = []
  if (!Array.isArray(dataSource)) {
    return ret
  }
  function loops(list: CategoryType[], hash: string[]) {
    list.forEach((item) => {
      hash.push(`${item.categoryId}`)
      if (item.children && item.children.length) {
        loops(item.children, hash)
      }
    })
  }
  dataSource.forEach((item) => {
    const record: string[] = []
    loops([item], record)
    ret.push(record)
  })
  return ret
}

export function getCategoryAllNames(dataSource: CategoryType[]): string[][] {
  const ret: string[][] = []
  if (!Array.isArray(dataSource)) {
    return ret
  }
  function loops(list: CategoryType[], hash: string[]) {
    list.forEach((item) => {
      hash.push(item.name)
      if (item.children && item.children.length) {
        loops(item.children, hash)
      }
    })
  }
  dataSource.forEach((item) => {
    const record: string[] = []
    loops([item], record)
    ret.push(record)
  })
  return ret
}
