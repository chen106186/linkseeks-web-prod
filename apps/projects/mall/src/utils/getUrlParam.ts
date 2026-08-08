/**
 * 获取url中的参数
 * @param field
 * @param url
 * @returns
 */
export const getQueryString = (field: string, url: string) => {
  if (!url) {
    return null
  }
  var href = url
  var reg = new RegExp('[?&]' + field + '=([^&]*)', 'i')
  var string = reg.exec(href)
  return string ? string[1] : null
}

/*
 * url 目标url
 * arg 需要替换的参数名称
 * arg_val 替换后的参数的值
 * return url 参数替换后的url
 */
export const changeURLArg = (url: string, arg: string, argVal: string) => {
  const pattern = arg + '=([^&]*)'
  const replaceText = arg + '=' + argVal
  if (url.match(pattern)) {
    let tmp = '/(' + arg + '=)([^&]*)/gi'
    // tslint:disable-next-line:no-eval
    tmp = url.replace(eval(tmp), replaceText)
    return tmp
  } else {
    if (url.match('[?]')) {
      return url + '&' + replaceText
    } else {
      return url + '?' + replaceText
    }
  }
}

/*
 * url 目标url
 * arg 需要删除的参数名称
 * return url 参数替换后的url
 */
export const removeURLArg = (url: string, key: string) => {
  let baseUrl = url.split('?')[0] + '?'
  let query = url.split('?')[1]
  if (query.indexOf(key) > -1) {
    let obj: any = {}
    let arr: any = query.split('&')
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[key]
    let url =
      baseUrl +
      JSON.stringify(obj)
        .replace(/[\"\{\}]/g, '')
        .replace(/\:/g, '=')
        .replace(/\,/g, '&')
    return url
  } else {
    return url
  }
}
