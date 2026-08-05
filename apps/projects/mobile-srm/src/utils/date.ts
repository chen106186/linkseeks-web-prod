import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
// 如果时间格式为2020/07/09 21:43:19.000  需要去掉.000 不然ios和firefox会有问题
const getDateTimeStamp = (dateStr: string) => Date.parse(dateStr.replace(/-/gi, '/'))

/**
 * 时间格式化
 * @param date 时间
 * @param fmt 时间格式，默认YYYY-MM-DD HH:mm:ss
 */
export const dateFormat = (date: Date, fmt: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  let ret
  const opt: { [key: string]: string } = {
    'Y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  let newfmt = fmt
  Object.keys(opt).forEach((k) => {
    ret = new RegExp(`(${k})`).exec(fmt)
    if (ret) {
      newfmt = newfmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  })
  return newfmt
}

/**
 * 时间格式化
 * @param date 时间
 * @param fmt 时间格式，默认YYYY-MM-DD
 */
export const dateFmt = (date: Date, fmt: string = 'YYYY-MM-DD'): string => {
  let ret
  const opt: { [key: string]: string } = {
    'Y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  let newfmt = fmt
  Object.keys(opt).forEach((k) => {
    ret = new RegExp(`(${k})`).exec(fmt)
    if (ret) {
      newfmt = newfmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  })
  return newfmt
}

/**
 * 把时间转化成对应的时间描述
 * @param dateStr
 */
export const getDateDiff = (dateStr: string): string => {
  if (!dateStr) return ''
  const publishTime = getDateTimeStamp(dateStr) / 1000
  const timeNow = parseInt(String(new Date().getTime() / 1000), 10)
  const date = new Date(publishTime * 1000)
  const Y = date.getFullYear()
  let M: number | string = date.getMonth() + 1
  let D: number | string = date.getDate()
  let H: number | string = date.getHours()
  let m: number | string = date.getMinutes()
  let s: number | string = date.getSeconds()
  // 小于10的在前面补0
  if (M < 10) {
    M = `0${M}`
  }
  if (D < 10) {
    D = `0${D}`
  }
  if (H < 10) {
    H = `0${H}`
  }
  if (m < 10) {
    m = `0${m}`
  }
  if (s < 10) {
    s = `0${s}`
  }

  const d = timeNow - publishTime
  const months = parseInt(String(d / 2592000), 10)
  const days = parseInt(String(d / 86400), 10)
  const hours = parseInt(String(d / 3600), 10)
  const minutes = parseInt(String(d / 60), 10)
  const seconds = parseInt(String(d), 10)
  if (days <= 0 && hours > 0) {
    return intl.formatMessage({ id: 'utils.data.hours.ago', defaultMessage: '{{hours}}小时前', hours })
  }
  if (hours <= 0 && minutes > 0) {
    return intl.formatMessage({ id: 'utils.data.minutes.ago', defaultMessage: '{{minutes}}分钟前', minutes })
  }
  if (seconds < 60) {
    if (seconds <= 0) {
      return intl.formatMessage({ id: 'utils.data.just', defaultMessage: '刚刚' })
    }
    return intl.formatMessage({ id: 'utils.data.seconds.ago', defaultMessage: '{{seconds}}秒前', seconds })
  }

  if (days === 1) {
    return intl.formatMessage({ id: 'utils.data.yestoday', defaultMessage: '昨天' })
  }

  if (days === 2) {
    return intl.formatMessage({ id: 'utils.data.before.yestoday', defaultMessage: '前天' })
  }

  if (days > 2 && days < 7) {
    return intl.formatMessage({ id: 'utils.data.days.ago', defaultMessage: '{{days}}天前', days })
  }

  if (days >= 7 && days < 14) {
    return intl.formatMessage({ id: 'utils.data.week.ago', defaultMessage: '{{week}}周前', week: 1 })
  }
  if (days >= 14 && days < 21) {
    return intl.formatMessage({ id: 'utils.data.week.ago', defaultMessage: '{{week}}周前', week: 2 })
  }
  if (days >= 21 && days < 30) {
    return intl.formatMessage({ id: 'utils.data.week.ago', defaultMessage: '{{week}}周前', week: 3 })
  }

  if (months > 0 && months < 12) {
    return intl.formatMessage({ id: 'utils.data.months.ago', defaultMessage: '{{months}}个月前', months })
  }

  // if (days >= 3 && days < 30) {
  //   return `${M}-${D} ${H}:${m}`;
  // }
  if (days >= 360) {
    return `${Y}-${M}-${D}`
  }
  return dateStr
}

/**
 * 计算剩余的时间
 * @param completeTime 截止时间
 */
export const interval = (completeTime: string | number | Date) => {
  const faultDate = new Date().getTime()
  const stime = Date.parse(String(new Date(faultDate)))
  const etime = Date.parse(String(new Date(completeTime)))
  const usedTime = etime - stime // 两个时间戳相差的毫秒数
  const days = Math.floor(usedTime / (24 * 3600 * 1000)) > 0 ? Math.floor(usedTime / (24 * 3600 * 1000)) : 0
  // 计算出小时数
  const leave1 = usedTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000)) > 0 ? Math.floor(leave1 / (3600 * 1000)) : 0
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000)) > 0 ? Math.floor(leave2 / (60 * 1000)) : 0
  const time = `${days.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes
    .toString()
    .padStart(2, '0')}`
  return time
}

/**
 * 计算剩余的时间
 * @param endTime 截止时间
 */
export const getRemainingDays = (endTime: string | number | Date) => {
  // 现在时间
  const now: any = new Date()
  // 截止时间
  const until: any = new Date(endTime || now)
  // 计算时会发生隐式转换，调用valueOf()方法，转化成时间戳的形式
  const days = (until - now) / 1000 / 3600 / 24
  // 下面都是简单的数学计算
  const day = Math.floor(days)
  return day
}

/**
 * 获取年月
 */
export const getYearMonth = () => {
  const myDate = new Date()
  let year = myDate.getFullYear()
  let month = myDate.getMonth() + 1 + ''
  if (Number(month) < 10) month = '0' + month
  return `${year}-${month}`
}

/**
 * 获取年月日
 */
export const getToday = () => {
  const myDate = new Date()
  let year = myDate.getFullYear()
  let month = myDate.getMonth() + 1 + ''
  let day = myDate.getDate() + ''
  if (Number(month) < 10) month = '0' + month
  if (Number(day) < 10) day = '0' + day
  return `${year}-${month}-${day}`
}

/**
 * 2020-01-01 -> 2020年01月01日
 * @param date
 * @param type
 * @returns
 */
export const changeYearMonth = (date: string, type: 'month' | 'day' = 'month') => {
  if (date) {
    const dateArr = date.split('-')
    const yearMonth = `${dateArr[0]}年${dateArr[1]}月`
    if (type === 'day' && dateArr[2]) return yearMonth + `${dateArr[2]}日`
    return yearMonth
  }
}
