import { COMMODITY_TYPE } from '@/constants'
import { NavItemType } from '@/types/global'

/**
 * 链接跳转
 * @param path 跳转url
 * @param type 跳转类型
 */
export const LinkTo = (path: string, type: 'href' | 'replace' | 'open' = 'href') => {
  if (!path) return
  if (!import.meta.env.SSR) {
    switch (type) {
      case 'href':
        window.location.href = path
        break
      case 'replace':
        window.location.replace(path)
        break
      case 'open':
        window.open(path)
        break
      default:
        break
    }
  }
}

export const openLink = (link: string, disabled = false, target = '_self') => {
  if (!disabled && link) {
    const el = document.createElement('a')
    el.href = link
    el.target = target
    el.click()
  }
}

/**
 * 获取导航排序值
 * @param type
 * @param list
 * @param defaultSort
 * @returns
 */
export const getSortByType = (type: number, list: NavItemType[] | undefined, defaultSort: number) => {
  if (!list) return defaultSort
  const current = list.filter((item) => item.type === type)[0]
  if (current) {
    return current.sort || defaultSort
  }
  return defaultSort
}

/**
 * 根据导航类型获取导航状态
 * @param type
 * @param list
 * @returns
 */
export const getStatusByType = (type: number, list: NavItemType[] | undefined) => {
  if (!list) return true
  const current = list.filter((item) => item.type === type)[0]
  if (current) {
    return current.status
  }
  return true
}

export const getUrlMemberId = (url: string) => {
  const tempParam = url.match(/\d{1,}/)
  if (tempParam) {
    const param = tempParam[0] as unknown as string
    if (param) {
      return Number(param)
    }
  }
  return undefined
}

export const sleep = (time: number) => {
  return new Promise((resolve) => {
    // 延时200ms获取
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

/**
 * 对数组进行分组
 * @param array 数据源
 * @param count 每组的个数
 * @returns
 */
export const arrayGroupsByCount = (array: string | any[], count: number) => {
  let index = 0
  const newArray: any[] = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += count)))
  }
  return newArray
}

export const getNameByPriceType = (type: COMMODITY_TYPE) => {
  switch (type) {
    case COMMODITY_TYPE.prompt:
      return 'commodity'
    case COMMODITY_TYPE.inquiry:
      return 'inquiry'
    case COMMODITY_TYPE.integral:
      return 'integral'
    default:
      return 'commodity'
  }
}

export const replaceNameString = (str: string | undefined) => {
  if (null !== str && str !== undefined) {
    if (str.length === 2) {
      return str.substring(0, 1) + '*'
    } else if (str.length > 2) {
      let char = ''
      for (let i = 0; i < str.length - 2; i++) {
        char += '*'
      }
      return str.substring(0, 1) + char + str.substring(str.length - 1)
    } else {
      return str
    }
  } else {
    return ''
  }
}

const timestampToTime = (timestamp: any, type: string) => {
  var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate()
  var h = date.getHours() + ':'
  var m = date.getMinutes()
  // var s = date.getSeconds();
  if (type == 'MD') {
    return M + D
  } else if (type == 'YMD') {
    return Y + M + D
  } else if (type == 'YMDMS') {
    return Y + M + D + ' ' + h + m
  }
  return M + D
}

/**
 * 整合时间戳
 * @param time 需要整合的时间戳
 */
export const integrationTime = (time: string, type: string) => {
  if (!time) {
    return '-'
  }
  const timeNew = timestampToTime(time, type)
  return timeNew
}

/**
 * 返回时间戳
 * @param time 需要整合的时间戳
 */
export const integrationBlackTime = (time: string) => {
  if (!time) {
    return '-'
  }
  const timeNew = new Date(time).getTime()
  if (!timeNew) {
    return ''
  }
  return timeNew
}

export const processText = (text: string) => {
  return text.replace(/<span[^>]*>(.*?)<\/span>/g, (match, p1) => {
    return p1
  })
}
