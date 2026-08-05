import { StorageProps } from '../storageModules/types'

export interface CookieGetOptions {
  type?: 'json' | 'string' | 'crypto'
}

export default class LocalStorage implements StorageProps {
  setItem<T>(key: string, value: T) {
    if (typeof value === 'string') {
      localStorage.setItem(key, value)
    } else {
      throw new Error('value只能是字符串类型')
    }
  }

  getItem(key: string) {
    const result = localStorage.getItem(key)
    if (!result) return ''
    return result
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}
