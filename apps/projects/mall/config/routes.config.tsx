import { RouteObject } from 'react-router-dom'
import initLoader from '@/loaders/initLoader'
import NotFound from '@/pages/error/notFound'
import PortalSearchResult from '@/pages/portalSearchResult'
import PortalAbout from '@/pages/portalAbout'

import HomeLayout from '@/layouts/homeLayout'
import HomeLayoutLoader from '@/loaders/homeLayoutLoader'
import ThemeLayout from '../src/layouts/themeLayout'
import b2bRouteConfig from './joint.route.config'
import ownRouterConfig from './own.router.config'
import srmRoutesConfig from './srm.route.config'

/** 使用二级目录部署 */
export const secondaryDir = `` // /mall

/** 使用自定义二级域名 */
const customSubDomain = `` // /:subDomain

export const commonPrefix = `${secondaryDir}${customSubDomain}`

export const routes: RouteObject[] = [
  {
    element: <ThemeLayout />,
    loader: initLoader,
    children: [
      {
        // 商城或门户首页
        path: `${commonPrefix}/`,
        loader: HomeLayoutLoader,
        element: <HomeLayout />,
      },
      {
        // 门户搜索
        path: `${commonPrefix}/portal/search`,
        element: <PortalSearchResult />,
      },
      {
        // 门户-详情
        path: `${commonPrefix}/portal/about/:id`,
        element: <PortalAbout />,
      },
      ...b2bRouteConfig(commonPrefix),
      ...ownRouterConfig(commonPrefix),
      ...srmRoutesConfig(commonPrefix),
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]
