import { set, get, remove, CookieAttributes } from 'js-cookie'
import { Base64 } from './cryptoAes'

export const setCookie = (key: string, value: string, options: CookieAttributes = {}) => {
  if (typeof value === 'string') {
    set(key, Base64.encode(value), options)
  } else {
    throw new Error('value只能是字符串类型')
  }
}

export const getCookie = (key: string, type: 'json' | 'string' = 'json'): Record<string, any> | string | undefined => {
  if (get(key)) {
    switch(type) {
      case 'json':
        return JSON.parse(Base64.decode(get(key)))
      default:
        return Base64.decode(get(key))
    }
  }
  return undefined
}

export const removeCookie = (key: string, options: CookieAttributes = {}) => {
  remove(key, options)
}
