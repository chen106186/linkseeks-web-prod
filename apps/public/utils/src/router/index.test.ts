import { loaderRoute } from './index'

describe('router', () => {
  it('测试路由是否正常', () => {
    const RouteMaps = {
      demo: {
        element: 'MOCK_ELEMENT',
        path: '/',
      },
    }

    const routes = [
      {
        path: '/',
        element: 'demo',
      },
    ]

    expect(loaderRoute(RouteMaps, routes)).toEqual([
      {
        path: '/',
        element: 'MOCK_ELEMENT',
      },
    ])
  })

  it('测试嵌套路由是否正常', () => {
    const RouteMaps = {
      demo: {
        element: 'MOCK_ELEMENT',
        path: '/',
      },
      demo2: {
        element: 'MOCK_ELEMENT2',
        path: '/demo',
      },
      user: {
        element: 'MOCK_USER_ELEMENT',
        path: '/user',
      },
    }

    const routes = [
      {
        path: '/',
        element: 'demo',
        children: [
          {
            path: '/demo',
            element: 'demo2',
          },
        ],
      },
      {
        path: '/user',
        element: 'user',
      },
    ]

    expect(loaderRoute(RouteMaps, routes)).toEqual([
      {
        path: '/',
        element: 'MOCK_ELEMENT',
        children: [
          {
            path: '/demo',
            element: 'MOCK_ELEMENT2',
          },
        ],
      },
      {
        path: '/user',
        element: 'MOCK_USER_ELEMENT',
      },
    ])
  })

  it('当找不到对应的element时，返回NOT_FOUND', () => {
    const RouteMaps = {
      demo: {
        element: 'MOCK_ELEMENT',
        path: '/',
      },
    }

    const routes = [
      {
        path: '/',
        element: 'user',
      },
    ]

    expect(loaderRoute(RouteMaps, routes)).toEqual([
      {
        path: '/',
        element: 'NOT_FOUND',
      },
    ])
  })
})
