import jsCookie, { CookieAttributes } from 'js-cookie'
import { StorageProps } from '../storageModules/types'

const { set, get, remove } = jsCookie

export interface CookieGetOptions {
  type?: 'json' | 'string' | 'crypto'
}

export default class CookieStorage implements StorageProps {
  setItem<T>(key: string, value: T, options: CookieAttributes) {
    if (typeof value === 'string') {
      set(key, value, options)
    } else {
      throw new Error('value只能是字符串类型')
    }
  }

  getItem(key: string) {
    const result = get(key)
    if (!result) return ''
    return result
  }

  removeItem(key: string, options?: CookieGetOptions): void {
    remove(key, options)
  }
}
