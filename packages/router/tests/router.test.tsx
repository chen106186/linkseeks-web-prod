import React from 'react'
import { RouteObject } from 'react-router-dom'
import { screen, render, waitFor } from '@testing-library/react'
import { RouterManager } from '../src'
import { LK_RouterProvider } from '../src/react'

const Error = () => {
  return <div>error</div>
}
describe('路由模块测试', () => {
  let fooDefer = createDeferred()
  const demoRouterConfig: RouteObject[] = [
    {
      path: '/',
      lazy: async () => {
        return {
          Component: () => <div>hello</div>,
        }
      },
    },
    {
      path: '*',
      element: <Error />,
    },
  ]

  it('测试lazy功能是否正常, 以及是否可以渲染loading状态', async () => {
    const routeInstance = RouterManager.init(demoRouterConfig)

    render(<LK_RouterProvider routes={routeInstance.routes} />)

    const homeElement = screen.getByText('Loading...')

    expect(homeElement).toBeInTheDocument()

    fooDefer.resolve()

    await waitFor(() => screen.getByText('hello'))

    expect(screen.getByText('hello')).toBeInTheDocument()
  })
})

function createDeferred() {
  let resolve: (val?: any) => Promise<void>
  let reject: (error?: Error) => Promise<void>
  let promise = new Promise((res, rej) => {
    resolve = async (val: any) => {
      res(val)
      try {
        await promise
      } catch (e) {}
    }
    reject = async (error?: Error) => {
      rej(error)
      try {
        await promise
      } catch (e) {}
    }
  })
  return {
    promise,
    //@ts-ignore
    resolve,
    //@ts-ignore
    reject,
  }
}
