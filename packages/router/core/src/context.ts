import { createContext, useContext } from 'react'
import type { RouteItem, RouteHashMaps } from './helper/RouteItem'

export const LK_RouterContext = createContext({})

export const useLKRouter = () => useContext(LK_RouterContext)

export interface RouterInfo {
  routeHashMaps: RouteHashMaps
  routeMenuData: RouteItem[]
  indexRouter?: string
  routeMenuHashData: RouteHashMaps
}
export const RouterContext = createContext<RouterInfo>({} as RouterInfo)

export const useRouter = () => useContext(RouterContext)

export const getCurrentRouter = (pathname: string): RouteItem | undefined => {
  const { routeHashMaps } = useRouter()
  return routeHashMaps[pathname] || undefined
}
