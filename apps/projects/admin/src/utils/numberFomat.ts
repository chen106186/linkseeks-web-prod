export const numFormat = (num: number) => {
  if (num) {
    const result = String(num)
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
export const priceFormat = (number, decimals = 2, dec_point = '.', thousands_sep = ',') => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  let s: string[] = []
  const n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
    dec = typeof dec_point === 'undefined' ? '.' : dec_point,
    toFixedFix = function (n, prec) {
      const k = Math.pow(10, prec)
      return '' + Math.ceil(n * k) / k
    }

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}
