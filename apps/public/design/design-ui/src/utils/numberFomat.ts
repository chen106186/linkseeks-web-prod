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
 * decPoint：小数点符号
 * thousandsSep：千分位符号
 */
export const priceFormat = (
  number: any,
  decimals = 2,
  decPoint = '.',
  thousandsSep = ',',
) => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  let s: string[] = []
  const n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep,
    dec = typeof decPoint === 'undefined' ? '.' : decPoint,
    toFixedFix = function (n: number, prec: number) {
      const k = Math.pow(10, prec)
      return '' + Math.ceil(n * k) / k
    }

  s = toFixedFix(n, prec).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }

  if (s[1] === '00') {
    return s[0]
  }

  return s.join(dec)
}
