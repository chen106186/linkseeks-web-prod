import { Mock } from 'vitest'
import { Api } from '../src'
import { server } from './mock/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Request', () => {
  const api = new Api()
  it('测试get请求是否正常', async () => {
    const response = await api.fetch('/list')
    expect(response.code).toEqual(1000)
    expect(response.data).toEqual({ userId: 2, username: 'Bob' })
  })

  it('测试post请求是否正常', async () => {
    const response = await api.fetch('/login', {
      method: 'POST',
      data: { username: 'Bob', paasword: '123456' },
    })

    expect(response.data).toEqual({ username: 'Bob' })
  })

  it('测试请求404', async () => {
    try {
      await api.fetch('/')
    } catch (err: any) {
      expect(err.code).toEqual('ERR_NETWORK')
    }
  })
})
