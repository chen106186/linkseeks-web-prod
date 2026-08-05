import { act, screen } from '@testing-library/react'
import {
  getMemberMobileSecurityGet,
  postMemberMobileSecurityPhoneUpdate,
  GetMemberMobileSecurityGetResponse,
} from '../src'
import { ResponseDataInstance } from '@linkseeks/request'
import { server } from './mock/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('测试api', () => {
  it('get 正常请求', async () => {
    // 异步操作均需要通过act包裹， 同时每一个异步操作都在一个act中
    await act(async () => {
      const { code, data, message } = await getMemberMobileSecurityGet({ test: 1 }, { ctlType: 'message' })
      expect(code).toEqual(1000)
      expect(data).toEqual({ userId: 1, userInfo: { name: 'Bob' } })
      expect(message).toEqual('请求成功')
    })

    await act(async () => {
      const successMessage = await screen.findByText('请求成功')
      expect(successMessage).toBeInTheDocument()
    })
  })

  it('get 异常请求', async () => {
    await act(async () => {
      try {
        await getMemberMobileSecurityGet({ test: 2 }, { ctlType: 'message' })
      } catch (error) {
        const { code, data } = error as ResponseDataInstance<GetMemberMobileSecurityGetResponse>
        expect(code).toEqual(9999)
        expect(data).toBeNull()
      }
    })

    await act(async () => {
      const successMessage = await screen.findByText('业务异常')
      expect(successMessage).toBeInTheDocument()
    })
  })

  it('业务异常时透传信息', async () => {
    await act(async () => {
      const { code, data } = await getMemberMobileSecurityGet({ test: 2 }, { penetrateError: true })
      expect(code).toEqual(9999)
      expect(data).toBeNull()
    })
  })

  it('post 正常请求', async () => {
    await act(async () => {
      const { code, data } = await postMemberMobileSecurityPhoneUpdate({ test: 1, data: 'Bob' } as any)

      expect(code).toEqual(1000)
      expect(data).toEqual({ username: 'Bob' })
    })
  })
})
