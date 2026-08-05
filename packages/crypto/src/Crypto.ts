import { AesStrategy } from './strategy/Aes'
import { Base64Strategy } from './strategy/Base64'

export class LK_Crypto {
  base64 = new Base64Strategy()

  aes = new AesStrategy()
}

/**
 * 解密
 */
export const decodeURLBase64 = (data: any, decode: boolean = true) => {
  const crypto = new LK_Crypto()
  return decode ? decodeURIComponent(crypto.base64.decrypt(data)) : crypto.base64.decrypt(data)
}

/**
 * 加密
 */
export const encodeURLBase64 = (data: any, encode: boolean = true) => {
  const crypto = new LK_Crypto()
  return crypto.base64.encrypt(encode ? encodeURIComponent(data) : data)
}

const customTrim = (str: string) => {
  const specialChars = ['\x0F', '\x01', '\x05']
  let start = 0
  let end = str.length
  while (start < end && (str[start].trim() === '' || specialChars.includes(str[start]))) {
    start++
  }
  while (end > start && (str[end - 1].trim() === '' || specialChars.includes(str[end - 1]))) {
    end--
  }
  return str.slice(start, end)
}

/**
 * 解密
 */
export const decryptedByAES = (data: any, decode: boolean = true) => {
  const crypto = new LK_Crypto()
  // 解密需要先通过base64转化
  const encryptedWordArray = crypto.base64.decrypt(data, false)
  return decode
    ? customTrim(decodeURIComponent(crypto.aes.decrypt(encryptedWordArray)).trim())
    : crypto.aes.decrypt(data)
}

/**
 * 加密
 */
export const encryptedByAES = (data: any, encode: boolean = false) => {
  const crypto = new LK_Crypto()
  return crypto.aes.encrypt(encode ? encodeURIComponent(data) : `${data}`)
}

export default LK_Crypto
