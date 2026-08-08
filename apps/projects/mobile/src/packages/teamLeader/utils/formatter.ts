/**
 * 千分位格式化，保留两位小数（不四舍五入）
 */
export const formatMoney = (value: number = 0): string => {
  if (value == null || isNaN(value)) return '0.00'
  const floored = Math.floor(value * 100) / 100
  const [intPart, decimalPart = ''] = floored.toString().split('.')
  const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const paddedDecimal = (decimalPart + '00').slice(0, 2)
  return `${withComma}.${paddedDecimal}`
}

/**
 * 千分位格式化（不保留小数）
 */
export const formatMoneyInt = (value: number = 0): string => {
  if (value == null || isNaN(value)) return '0'
  const intPart = Math.floor(value).toString()
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 时间戳转日期时间字符串
 * number或纯数字字符串，格式：yyyy-MM-dd HH:mm:ss
 */
export const formatDateFromTimestamp = (timestamp: number | string, type: number): string => {
  if (!timestamp) return ''

  const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  const date = new Date(ts)
  if (isNaN(date.getTime())) return ''

  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  if (type === 1) {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } else {
    return `${year}-${month}-${day}`
  }
}

/**
 * 格式化整数部分和不四舍五入的两位小数部分
 * 输入的数值（number 或 string）
 * [intPart, decimalPart] - 整数部分 + 小数部分（保留2位，不四舍五入）
 */
export const formatPriceParts = (value: number | string): [string, string] => {
  const num = Number(value) || 0
  // 拆分整数和小数部分
  const [intRaw, decimalRaw = ''] = num.toString().split('.')
  // 整数部分
  const intPart = intRaw
  // 小数部分截取前两位，不足补0，不四舍五入
  const decimalPart = (decimalRaw + '00').slice(0, 2)
  return [intPart, decimalPart]
}


