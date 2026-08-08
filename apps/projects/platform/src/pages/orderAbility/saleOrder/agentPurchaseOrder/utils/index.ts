import { COMMODITY_TYPE } from '@/constants'
import { GlobalConfig } from '@/global/config'
import { history } from '@linkseeks/router-manager'

/**
 * 对数组进行分组
 * @param array 数据源
 * @param count 每组的个数
 * @returns
 */
export const arrayGroupsByCount = (array: string | any[], count: number) => {
  let index = 0
  const newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += count)))
  }
  return newArray
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

export const openLink = (link: string, disabled = false, target = '_self') => {
  if (!disabled && link) {
    const el = document.createElement('a')
    el.href = link
    el.target = target
    el.click()
  }
}

/*
 * 乘法函数，用来得到精确的乘法结果
 * 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 * 调用：accMul(arg1,arg2)
 * 返回值：arg1乘以 arg2的精确结果
 */
export const accMul = (arg1: number, arg2: number) => {
  if (!arg1 || !arg2) {
    return 0
  }
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')[1] ? s1.split('.')[1].length : 0
  } catch (e) {
    console.log(e)
  }
  try {
    m += s2.split('.')[1] ? s2.split('.')[1].length : 0
  } catch (e) {
    console.log(e)
  }
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

/*
 * 加法函数，用来得到精确的加法结果
 * 说明：javascript的加法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 * accAdd(arg1,arg2)
 * 返回值：arg1加上 arg2的精确结果
 */
export const accAdd = (num1: number, num2: number) => {
  let sq1
  let sq2
  let multiple
  try {
    sq1 = num1.toString().split('.')[1].length
  } catch (e) {
    sq1 = 0
  }
  try {
    sq2 = num2.toString().split('.')[1].length
  } catch (e) {
    sq2 = 0
  }
  multiple = Math.pow(10, Math.max(sq1, sq2))
  return (num1 * multiple + num2 * multiple) / multiple
}

/**
 * 根据host获取当前一级域名
 * @param url 链接
 * @returns
 */
export const getTopDomainByHost = (url: string, isPort = false): string => {
  if (!url) return ''
  // 如果后缀带有端口号， 则把端口号也加上
  const splitUrl = url.replace(/(http|https)\:\/\//, '').split(':')
  if (splitUrl.length > 1 && isPort) {
    return `${splitUrl[0].split('.').slice(-2).join('.')}`
  }
  return url.split('.').slice(-2).join('.')
}

export const getIntegralMallId = () => {
  const integralMallInfo = GlobalConfig.web.shopInfo.filter((item) => item.environment === 1 && item.type === 2)[0]
  if (integralMallInfo) {
    return integralMallInfo.id
  }
  return 0
}

export const getIntegralMallInfo = (type: number = 2) => {
  const integralMallInfo = GlobalConfig.web.shopInfo.filter((item) => item.environment === 1 && item.type === type)[0]
  if (integralMallInfo) {
    return integralMallInfo
  }
  return undefined
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

/** 数组转对象 */
export function arrayToMap<T>(list: T[], primaryKey: keyof T) {
  const result: { [props: string]: T } = {}
  list.forEach((_item: T) => {
    const key = _item[primaryKey]
    if (key) {
      ;(result as any)[key] = _item
    }
  })
  return result
}
