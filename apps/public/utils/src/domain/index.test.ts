import { getTopDomain } from './index'

describe('domain', () => {
  it('getTopDomainByHost', () => {
    // 测试环境通常会带有端口号
    expect(getTopDomain(location.host)).toBe('localhost:3000')

    expect(getTopDomain('http://www.baidu.com')).toBe('baidu.com')

    //@ts-ignore
    process.env.NODE_ENV = 'development'

    expect(getTopDomain('http://www.baidu.com')).toBeUndefined()

    // 当开发环境 + 传入了默认顶级域名， 则自动返回默认顶级域名
    process.env.DEFAULT_TOP_DOMAIN = 'lingxidev.com'
    expect(getTopDomain('http://www.baidu.com')).toBe('lingxidev.com')

    // @ts-ignore
    process.env.NODE_ENV = 'production'
    expect(getTopDomain('http://www.baidu.com')).toBe('baidu.com')
  })
})
