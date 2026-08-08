import { loaderRoute } from '@apps/utils'

// 模拟一下后端返回的路由

const routeApis = [
  {
    path: '/',
    children: [
      {
        element: 'redirectHome',
        index: true,
      },
      {
        path: '/user/login',
        element: 'userLogin',
      },
    ],
  },
  {
    path: '*',
    element: 'redirectHome',
  },
]

const mockRoute = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(routeApis)
    }, 1000)
  })
}
export const presetRoute: any = async (RouteMaps: any, Routes: any) => {
  const routes: any = await mockRoute()

  return Routes({ children: () => loaderRoute(RouteMaps, routes) })
}

export default presetRoute
