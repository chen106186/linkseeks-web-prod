import { getCurrentPages } from '@apps/mobile-services/utils/taro'
import { useCallback } from 'react'

type addListType = {
  name: string
  params: any
}

function useResetRoute() {
  /**
   * @param blackList 去除的路由
   * @param addList 添加的路由
   */
  let routes = getCurrentPages()
  const resetRoute = useCallback(
    (options: { blackList?: string[]; addList?: addListType[]; defaultRoute?: { name: string; params: any } }) => {
      const { blackList = [], addList = [], defaultRoute = { name: 'BottomNavigation', params: {} } } = options || {}
      const _route = routes.filter((r) => !blackList.includes(r.name))
      let newRoutes = _route.concat(addList as any)
      if (newRoutes.length === 0) {
        newRoutes = newRoutes.concat(defaultRoute as any)
      }
      routes = newRoutes
    },
    [],
  )

  return { resetRoute }
}

export default useResetRoute
