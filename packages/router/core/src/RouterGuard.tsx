import { FC, useEffect, useState } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider as BrowserProvider,
  Navigate,
  useLocation,
  useOutlet,
} from 'react-router-dom'

import { getCurrentRouter } from './context'
import LRUCache from './utils/lru'
import { DefineOptions } from './defineConfig'
import useHistory from './useHistory'
import Loading from './Loading'

const recent = new LRUCache(6)
recent.init()

// 路由权限守卫
const RouterGuard: FC<any> = (props: any) => {
  const location = useLocation()
  const currentRouter = getCurrentRouter(location.pathname)
  const history = useHistory()
  const outlet = useOutlet()
  const [routerElement, setRouterElement] = useState<any>(null)
  const whiteList = [
    '/user',
    '/user/login',
    '/user/register',
    '/user/forget',
    '/user/agreement',
    '/editMySelf',
    '/h5/download',
    '/h5/infoDetail',
    '/h5/pt',
    '/404',
  ]

  useEffect(() => {
    if (!whiteList.includes(location.pathname)) {
      recent.put(currentRouter?.title || '', location.pathname + location.search)
    }
    const basename = props.baseRoutePrefix || ''
    setRouterElement(
      props.beforeRouterNavigate({ path: location.pathname, history, baseRoutePrefix: basename }, currentRouter),
    )
  }, [location, currentRouter, props.baseRoutePrefix])

  if (typeof routerElement === 'boolean') {
    return routerElement ? outlet : props.noPermissionPage
  } else if (typeof routerElement === 'object') {
    return routerElement
  } else if (typeof routerElement === null) {
    return <Loading />
  } else {
    return outlet
  }
}

export default RouterGuard
