import { encryptedByAES, encodeURLBase64, decodeURLBase64, decryptedByAES } from '@linkseeks/crypto'
import { LocalStorage } from '../adapter'
import { StorageModuleProps, StorageProps } from './types'

export class LocalStorageModule implements StorageModuleProps {
  /**
   * 储存key的前缀，通常为应用名
   */
  servicePrefix?: string

  /**
   * 储存key的分隔符
   */
  storageSplit?: string

  /**
   * 储存的key，应保持应用内全局唯一
   */
  storageKey: string

  /**
   * 储存的具体实例，可通过adapter设置，目前默认支持cookie
   */
  storageInstance: StorageProps

  cryptoType?: 'base64' | 'aes' | 'none'
  constructor(options: StorageModuleProps) {
    const { servicePrefix = '', storageKey, storageSplit = '_', cryptoType = 'none', storageInstance } = options

    this.servicePrefix = servicePrefix
    this.storageSplit = storageSplit
    this.storageKey = this.getServiceKey(storageKey)
    this.storageInstance = storageInstance || new LocalStorage()
    this.cryptoType = cryptoType
  }

  setItem<T extends any>(value: T) {
    let dispatchValue = this.setDispatchValue(this.formatValue(value))
    this.storageInstance.setItem(this.storageKey, dispatchValue)
  }

  getItem() {
    const result = this.storageInstance.getItem(this.storageKey)
    let dispatchValue = this.formatValue(this.getDispatchValue(result), true)
    return dispatchValue
  }

  removeItem() {
    this.storageInstance.removeItem(this.storageKey)
  }

  /**
   * 若传入的值为对象，则会尝试转化返回成对象字符串
   * 若传入值为字符串，并且isParse为true， 则会尝试将字符串转化为对象返回
   * 若传入值为字符串，并且isParse为true， 若转化后的结果不是对象，则将结果转成字符串返回
   * 否则将直接原样返回
   *
   */
  private formatValue(value: any, isParse = false) {
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value)
      } catch (err) {
        console.error(err)
        console.log(`format value error is -> ${value}`)
        return ''
      }
    } else if (typeof value === 'string') {
      // 需要解析返回
      if (isParse) {
        try {
          const result = JSON.parse(value)
          if (result instanceof Object) {
            return result
          } else {
            return result.toString()
          }
        } catch (err) {
          // 解析失败则不做处理
        }
      }
    }

    return value
  }

  private setDispatchValue(value: string) {
    switch (this.cryptoType) {
      case 'aes': {
        return encryptedByAES(value)
      }

      case 'base64': {
        return encodeURLBase64(value)
      }

      case 'none': {
        return value
      }
    }
  }

  private getDispatchValue(value: string | undefined) {
    if (!value) {
      return value
    }
    switch (this.cryptoType) {
      case 'aes': {
        return decryptedByAES(value)
      }

      case 'base64': {
        return decodeURLBase64(value)
      }

      case 'none': {
        return value
      }
    }
  }

  private getServiceKey(key: string) {
    return key.startsWith(this.servicePrefix as string) ? key : `${this.servicePrefix}${this.storageSplit}${key}`
  }
}
