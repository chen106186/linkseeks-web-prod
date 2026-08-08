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
