export { defineConfig } from './defineConfig'

export { RouterProvider } from './RouterProvider'
export { RouterContext, useRouter, getCurrentRouter } from './context'

export {
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
  Route,
  Routes,
  Router,
  BrowserRouter,
  Link,
  NavLink,
  useMatch,
  useMatches,
  useOutlet,
  useSearchParams,
  unstable_usePrompt as usePrompt,
} from 'react-router-dom'

export { logoutLogin } from './utils'

export type { IRouteItem, RouteConfig } from './helper/RouteItem'

export { RouteItem } from './helper/RouteItem'
export { withRouter, type RouteComponentProps } from './withRouter'

export { default as useHistory } from './useHistory'
export { default as useQuery } from './useQuery'
export { default as useRouteActive } from './useRouteActive'

export * from './cacheRoute'
