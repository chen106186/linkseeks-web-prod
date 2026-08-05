import CryptoJS from 'crypto-js'
import { EncryptStrategy } from './base.strategy'

export class Base64Strategy implements EncryptStrategy {
  encrypt(data: string): string {
    const word = CryptoJS.enc.Utf8.parse(data)

    const base64 = CryptoJS.enc.Base64.stringify(word)
    return base64
  }

  decrypt(base64: string, isString = true): any {
    const parsedWordArray = CryptoJS.enc.Base64.parse(base64)
    const parseData = isString ? parsedWordArray.toString(CryptoJS.enc.Utf8) : parsedWordArray
    return parseData
  }
}
