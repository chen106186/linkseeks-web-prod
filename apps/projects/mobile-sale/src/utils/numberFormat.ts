/**
 * 对数字进行格式化 eg: 1000 -> 1,000
 * @param num
 */
export const numFormat = (num: number) => {
  if (num) {
    const result = String(num)
    return result.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return 0
}

export const toFixedFix = (num: number, numPrec: number) => {
  const k = 10 ** numPrec
  // 精度有问题，Math.ceil(8.8 * 10 ** 2)，输出 881，而不是 880
  // return (Math.ceil(num * k) / k).toString();
  return (num * k) / k
}

/**
 * 价格格式化
 * 参数说明：
 * number：要格式化的数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 */
export const priceFormat = (number: any, decimals: number = 2, DecPoint: string = '.', ThousandsSep: string = ',') => {
  if (!number) return 0
  const newNum = number.toString().replace(/[^0-9+-Ee.]/g, '')
  let s: string[] = []
  const n = !Number.isFinite(+newNum) ? 0 : +newNum
  const prec = !Number.isFinite(+decimals) ? 0 : Math.abs(decimals)
  const sep = typeof ThousandsSep === 'undefined' ? ',' : ThousandsSep
  const dec = typeof DecPoint === 'undefined' ? '.' : DecPoint

  s = (prec ? toFixedFix(n, prec).toString() : Math.round(n)).toString().split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, `$1${sep}$2`)
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  } else {
    s[1] = s[1].slice(0, prec)
  }
  return s.join(dec)
}
