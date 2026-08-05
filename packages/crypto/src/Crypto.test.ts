import LK_Crypto, { decodeURLBase64, encodeURLBase64 } from './Crypto'

describe('Crypto', () => {
  const crypto = new LK_Crypto()
  it('LK_Crypto base64', () => {
    const str = 'linkseeks'

    expect(crypto.base64.encrypt(str)).toBe('bGlua3NlZWtz')

    expect(crypto.base64.decrypt('bGlua3NlZWtz')).toBe(str)
  })

  it('LK_Crypto aes', () => {
    const str = 'linkseeks'

    expect(crypto.aes.encrypt(str)).toBe('20TlfBKGRPtgwpvQtHYHRg==')

    expect(crypto.aes.decrypt('20TlfBKGRPtgwpvQtHYHRg==')).toBe(str)
  })

  it('decodeURLByBase64 encodeURLByBase64', () => {
    const str = '瓴犀'

    expect(encodeURLBase64(str)).toBe('JUU3JTkzJUI0JUU3JThBJTgw')

    expect(decodeURLBase64('JUU3JTkzJUI0JUU3JThBJTgw')).toBe(str)
  })
})
