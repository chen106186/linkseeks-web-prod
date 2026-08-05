import { ReactNode, ReactElement } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider as BrowserProvider,
  Navigate,
} from 'react-router-dom'
import { wrapSuspense } from './utils'
import Loading from './Loading'
import { RouterContext, RouterInfo } from './context'
import { parseRouteMenu, parseLayout } from './helper/parser'
import type { RouteItem } from './helper/RouteItem'
import RouterGuard from './RouterGuard'
import { Router, RouterManager } from '@linkseeks/router-manager'
import RouterInit from './RouterInit'

export interface LKRoute {
  path: string
  name?: string
  component?: ReactNode | string
  layout?: ReactNode
  children?: LKRoute[]
  redirect?: string
  microApp?: string
}

export interface RouterProviderProps {
  /**
   * 全局统一路由前缀
   */
  baseRoutePrefix?: string

  isVite?: boolean
  options?: {
    loading?: ReactNode
  }
}

/**
 * 约定式路由
 */
export const RouterProvider = (props: RouterProviderProps) => {
  const { options = {}, baseRoutePrefix = '' } = props
  const { routeMenuData, routeHashMaps, globalConfig, routeMenuHashData } = parseRouteMenu()
  const Layout = parseLayout()

  // 默认使用库自带的loading动画
  const renderLoading = (options) => {
    return options.loading || <Loading />
  }

  const renderIndex = () => {
    const Index = <Navigate to={globalConfig.indexRouter || ''} replace />
    return <Route path="/" element={Index} />
  }

  const renderNotFound = () => {
    const NotFound = globalConfig.notFoundRouter ? (
      <Navigate to={globalConfig.notFoundRouter} replace />
    ) : (
      <div>not found</div>
    )
    return <Route path="*" element={NotFound} />
  }

  const render = (routes: RouteItem[]) => {
    return routes.map((service) => {
      // 如果是view，作为默认引入
      return (
        <Route
          path={`${service.code.replace(/^view$/, '')}`}
          key={service.routeKey}
          element={wrapSuspense(service.element, renderLoading(options))}
        >
          {service.children && render(service.children)}
        </Route>
      )
    })
  }

  const routerInfo: RouterInfo = {
    routeMenuData,
    routeHashMaps,
    indexRouter: globalConfig.indexRouter,
    routeMenuHashData,
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<RouterInit {...globalConfig} loading={renderLoading(options)} />}>
        <Route element={<RouterGuard {...globalConfig} />}>
          <Route element={wrapSuspense(Layout, renderLoading(options))}>
            {render(routeMenuData)}
            {renderNotFound()}
          </Route>
        </Route>
      </Route>,
    ),
    { basename: globalConfig.baseRoutePrefix || '/' },
  )
  Router.init(router, globalConfig.baseRoutePrefix)

  return (
    <RouterContext.Provider value={routerInfo}>
      <BrowserProvider router={router} />
    </RouterContext.Provider>
  )
}
