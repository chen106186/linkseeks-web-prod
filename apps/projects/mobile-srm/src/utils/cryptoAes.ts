import CryptoJS from 'crypto-es'

const key = CryptoJS.enc.Utf8.parse('GzSsyLingxi2.0.0')
/**
 * @auth xjm
 * 加密方法
 */
export const encryptedByAES = (source: string) => {
  const password = CryptoJS.enc.Utf8.parse(source)
  // @ts-ignore
  const encrypted = CryptoJS.AES.encrypt(password, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }) // CryptoJS.pad.Pkcs7
  return encrypted.toString() // 加密后的base64
}

/**
 * @auth xjm
 * 解密方法
 */
export const decryptedByAES = (source: string) => {
  // @ts-ignore
  const decrypted = CryptoJS.AES.decrypt(source, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }) // CryptoJS.pad.Pkcs7
  return decrypted.toString(CryptoJS.enc.Utf8) // 解密后的原始字符串
}
