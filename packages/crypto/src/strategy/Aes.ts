import CryptoJS from 'crypto-js'
import { EncryptStrategy } from './base.strategy'

export class AesStrategy implements EncryptStrategy {
  private key = 'LingxiVersion3.0'
  private Aes_key = CryptoJS.enc.Utf8.parse(this.key)

  encrypt(source: string, isHex: boolean = false): string {
    try {
      // 生成一个随机的16字节 IV
      const iv = CryptoJS.lib.WordArray.random(16)

      // 使用 AES-CBC 模式进行加密
      const encrypted = CryptoJS.AES.encrypt(source, this.Aes_key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7, // 使用 PKCS7 填充
      })

      // 拼接 IV 和密文，将 IV 作为密文的前16字节
      const encryptedTextWithIv = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64)
      return encryptedTextWithIv
    } catch (error) {
      console.error('Encryption failed:', error)
      return ''
    }
  }

  decrypt(source: CryptoJS.lib.WordArray, isHex: boolean = false): string {
    const iv = CryptoJS.lib.WordArray.create(source.words.slice(0, 4), 16)
    const ciphertext = CryptoJS.lib.WordArray.create(source.words.slice(4), source.sigBytes - 16)
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext } as any, this.Aes_key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return decrypted.toString(CryptoJS.enc.Utf8).trim() // 解密后的原始字符串
  }
}
