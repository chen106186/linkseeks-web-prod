export const numFormat = (num: number) => {
  if (num) {
    let result = String(num)
    return result.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } else {
    return 0
  }
}

/**
 * 价格格式化
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 */
export const priceFormat = (number: string | number, decimals = 2, dec_point = '.', thousands_sep = ',') => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  let s: string[] = []
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
    dec = typeof dec_point === 'undefined' ? '.' : dec_point,
    toFixedFix = function (n: number, prec: number) {
      var k = Math.pow(10, prec)
      return '' + Math.round(n * k) / k
    }

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  let re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if (s[1] && s[1].length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}

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
