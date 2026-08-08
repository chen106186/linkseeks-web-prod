import { Toast } from '@apps/mobile-ui'

/**
 * omit 忽略对象某个key
 * @param { object } source,
 * @parm {string[]} ignore
 */
export function omit<T, P extends keyof T>(source: T, ignore: P[]): Omit<T, P> {
  const result: Omit<T, P> = {} as Omit<T, P>
  Object.keys(source).forEach((_item) => {
    if (!ignore.includes(_item as P)) {
      result[_item] = source[_item]
    }
  })
  return result
}

/** 数组转对象 */
export function arrayToMap<T, P extends keyof T>(list: T[], primaryKey: P) {
  const result: { [key in P]: T } = {} as { [key in P]: T }
  list.forEach((_item: T) => {
    const key = _item[primaryKey]
    ;(result as any)[key] = _item
  })
  return result
}
/*
 * 检查是否还有更多
 * @param {Number} curPage 当前页码
 * @param {Number} curSize 当前页数
 * @param {Number} dataLen 当前数据长度
 * @param {Number} dataTotal 数据总长度
 */
export const checkMore = (curPage: number, curSize: number, dataLen: number, dataTotal: number) => {
  let hasMore = true

  if (!dataLen || dataLen + (curPage - 1) * curSize >= +dataTotal) {
    hasMore = false
  }
  return hasMore
}

/**
 * 对数组进行分组
 * @param array 数组数据
 * @param count 每组的数量
 */
export const arrayGroupsByCount = (array: any, count: number) => {
  let index = 0
  const newArray: any[] = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += count)))
  }
  return newArray
}

/*
 * 在指定字符串中查找是否存在指定的字符
 * @param {String} source 需要查找的字符串
 * @param {String} str 被查找的字符
 */
export const searchRepeatStr = (source: string, str: string) => {
  const len = source.length
  const index = source.indexOf(str)
  if (index === -1) {
    return -1
  }
  for (let i = index + 1; i < len; i += 1) {
    if (source.charAt(i) === str) {
      return i
    }
  }
  return -1
}

/**
 * 防抖
 * @param func 需要包装的函数
 * @param delay 延迟时间，单位ms
 * @param immediate 是否默认执行一次(第一次不延迟)
 */
export class Debounced {
  public use = (func: Function, delay: number, immediate: boolean = false): Function => {
    // eslint-disable-next-line no-undef
    let timer: NodeJS.Timeout | null = null
    return (...args: any) => {
      if (immediate) {
        const callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, delay)
        if (callNow) {
          func.apply(this, args) // 确保引用函数的指向正确，并且函数的参数也不变
        }
        return
      }
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }
}

/**
 * 字符长度，包含汉字判断
 * @param {string} value 需要判断的字符串
 * @param {object} desc
 * @returns {string} message 消息
 */
export const limitByte = (
  value: string,
  desc: {
    /**
     * 是否需要转换中文
     */
    allowChineseTransform?: boolean
    /**
     * 字符长度
     */
    maxByte: number
  },
): string => {
  const { allowChineseTransform = true, maxByte } = desc
  let str = value
  let message = `不能超过${maxByte}个字符`
  if (allowChineseTransform) {
    str = str.replace(/[\u4E00-\u9FA5]/g, 'AA')
    message += `,或者${maxByte / 2}个汉字`
  }
  return str.length > maxByte ? message : ''
}

/**
 * input blur触发长度提示
 * @param {string} value 需要判断的字符串
 * @param {string} fix 前缀文字
 * @param {object} desc
 */
export const inputBlurMsg = (
  value: string,
  fix: string,
  desc: {
    /**
     * 是否需要转换中文
     */
    allowChineseTransform?: boolean
    /**
     * 字符长度
     */
    maxByte: number
  },
) => {
  const { allowChineseTransform = true, maxByte } = desc
  const mes = limitByte(value, { allowChineseTransform, maxByte })
  if (mes) {
    Toast.show({ title: `${fix}${mes}`, icon: 'none' })
  }
}

/**
 * 判断字符串是否是 Json 字符串，如果是则返回 Json，否则返回 null
 * @param {any} str 需要判断是否是 JSON字符串的 字符串
 */
export const isJSONStr = (str: any) => {
  if (typeof str === 'string') {
    try {
      const complete = JSON.parse(str)
      return complete
    } catch (e) {
      return null
    }
  }
  return str
}

/** 获取链接参数，用于app扫描二维码 */
export function getUrlParams<T>(link: string): T & { host: string } {
  const host = (link.includes('?') && link.split('?')?.[0]) || ''
  const pattern = new RegExp(/(\w+)=(\w+)/, 'gi')
  const res: T & { host: string } = {} as T & { host: string }
  link.replace(pattern, (match, p1, p2) => {
    ;(res as any)[p1] = p2
    return `${p1}=${p2}`
  })
  return {
    ...res,
    host,
  }
}

/**
 * 判断是否为微信环境
 */
export const isWeChat = () => {
  const ua = window.navigator.userAgent
  return /MicroMessenger/.test(ua)
}

/**
 * 限制小数位
 * @param value      数值
 * @param decimals   小数位
 * @param isAbs      是否返回绝对值
 * @returns
 */
export const limitDecimals = (value: string | number, decimals = 2, isAbs = true): string => {
  let i = 1,
    str = '\\d'
  if (decimals) {
    while (i < decimals) {
      str += '\\d'
      i++
    }
  }
  const reg = new RegExp('^(\\-)*(\\d+)\\.(' + str + ').*$')
  let result = ''
  if (typeof value === 'string') {
    result = !Number.isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
  } else if (typeof value === 'number') {
    result = !Number.isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  }
  return isAbs ? Math.abs(Number(result)) + '' : result
}
