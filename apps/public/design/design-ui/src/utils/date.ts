// 如果时间格式为2020/07/09 21:43:19.000  需要去掉.000 不然ios和firefox会有问题
const getDateTimeStamp = (dateStr: string) =>
  Date.parse(dateStr.replace(/-/gi, '/'))

/**
 * 时间格式化
 * @param date 时间
 * @param fmt 时间格式，默认YYYY-MM-DD HH:mm:ss
 */
export const dateFormat = (date: Date, fmt = 'YYYY-MM-DD HH:mm:ss'): string => {
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
      newfmt = newfmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'),
      )
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
  const days = parseInt(String(d / 86400), 10)
  const hours = parseInt(String(d / 3600), 10)
  const minutes = parseInt(String(d / 60), 10)
  const seconds = parseInt(String(d), 10)

  if (days > 0 && days < 3) {
    return `${days}天前`
  }
  if (days <= 0 && hours > 0) {
    return `${hours}小时前`
  }
  if (hours <= 0 && minutes > 0) {
    return `${minutes}分钟前`
  }
  if (seconds < 60) {
    if (seconds <= 0) {
      return '刚刚'
    }
    return `${seconds}秒前`
  }
  if (days >= 3 && days < 30) {
    return `${M}-${D} ${H}:${m}`
  }
  if (days >= 30) {
    return `${Y}-${M}-${D} ${H}:${m}`
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
  const days =
    Math.floor(usedTime / (24 * 3600 * 1000)) > 0
      ? Math.floor(usedTime / (24 * 3600 * 1000))
      : 0
  // 计算出小时数
  const leave1 = usedTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours =
    Math.floor(leave1 / (3600 * 1000)) > 0
      ? Math.floor(leave1 / (3600 * 1000))
      : 0
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes =
    Math.floor(leave2 / (60 * 1000)) > 0 ? Math.floor(leave2 / (60 * 1000)) : 0
  const time = `${days}天${hours}时${minutes}分`
  return time
}

export const isCurrentTimeInRange = (
  startTimestamp: number,
  endTimestamp: number,
) => {
  // 获取当前时间的时间戳
  const nowTimestamp = Date.now()

  // 比较当前时间戳和开始、结束时间戳
  return nowTimestamp >= startTimestamp && nowTimestamp <= endTimestamp
}
