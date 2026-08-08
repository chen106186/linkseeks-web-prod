import { Suspense, ReactNode, ComponentType, ReactElement } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { withRouter } from '../withRouter'
import { lazy } from './reactLazyWithReload'
/**
 * 取路由路径中的第一段作为布局中的大模块名称
 */
export const parseRoutePathTitle = (routePaths: string[]) => {
  return routePaths.map((r) => r.split('/')[1])
}

/**
 * 异步组件需要进行包裹
 */
export const wrapSuspense = (importer: () => Promise<{ default: ComponentType }>, fallback?: any) => {
  if (!importer) {
    return undefined
  }
  // 使用 React.lazy 包裹 () => import() 语法
  const Component = withRouter(lazy(importer))
  // 结合 Suspense ，这里可以自定义 loading 组件
  return (
    <Suspense fallback={fallback || null}>
      <Component />
    </Suspense>
  )
}

export const logoutLogin = () => {
  const navigate = useNavigate()
  navigate('/user/login', { replace: true })
}
