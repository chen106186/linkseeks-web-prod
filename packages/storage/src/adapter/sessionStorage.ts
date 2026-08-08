import { StorageProps } from '../storageModules/types'

export interface CookieGetOptions {
  type?: 'json' | 'string' | 'crypto'
}

export default class SessionStorage implements StorageProps {
  setItem<T>(key: string, value: T) {
    if (typeof value === 'string') {
      sessionStorage.setItem(key, value)
    } else {
      throw new Error('value只能是字符串类型')
    }
  }

  getItem(key: string): string {
    const result = sessionStorage.getItem(key)
    if (!result) return ''
    return result
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key)
  }
}
