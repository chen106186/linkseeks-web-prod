import { useMemo } from 'react'
import { authService } from '@apps/services'
import { IDataListProps } from '../components/Centers/layout'

type LinkItem = {
  name: string
  link: string
  count: number
}

const useCovert = () => {
  const authUrlList = useMemo(() => authService.getAuthUrlList(authService.getAuthList()), [])

  /**
   * 对转化后的链接进行权限判断
   * @param list
   * @param linkMap
   * @param key
   * @returns
   */
  const getAuthLinkList = (list: LinkItem[], linkMap: Record<string, string | Record<string, string>>, key: string) => {
    const newList: LinkItem[] = []
    for (const _item of list) {
      const link = linkMap[key] && typeof linkMap[key] === 'object' ? linkMap[key][_item.name] : linkMap[_item.name]
      if (authUrlList.includes(link)) {
        newList.push({
          ..._item,
          link,
        })
      }
    }
    return newList
  }

  const convertUrl = (
    data: IDataListProps['dataSource'],
    linkMap: Record<string, string | Record<string, string>>,
    filterKeys?: string[],
  ): IDataListProps['dataSource'] => {
    const result: IDataListProps['dataSource'] = {}
    if (data && Object.keys(data).length > 0) {
      Object.keys(data).forEach((key) => {
        const current = data[key]
        if (current && current.length > 0) {
          if (filterKeys && filterKeys.length > 0) {
            if (!filterKeys.includes(key)) {
              result[key] = getAuthLinkList(current, linkMap, key)
            }
          } else {
            result[key] = result[key] = getAuthLinkList(current, linkMap, key)
          }
        } else {
          result[key] = []
        }
      })
    }

    return result
  }

  return {
    convertUrl,
  }
}

export default useCovert
