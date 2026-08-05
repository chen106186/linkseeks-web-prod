/**
 * 根据url链接，解析query参数
 * @param url 链接地址
 * @param query 需要截取的param key， 若不传则返回整个对象，默认为空对象{}
 */
export function getQueryStringParams(url: string): { [key: string]: string }
export function getQueryStringParams<Q extends string>(
  url: string,
  query: Q,
): Q extends string ? string : { [key: string]: string }
export function getQueryStringParams(url: string, query?: string) {
  const queryStartIndex = url.indexOf('?')
  if (queryStartIndex === -1) {
    return {}
  }

  const queryString = url.slice(queryStartIndex + 1)
  const params = queryString.split('&')
  const queryParams: { [key: string]: string } = {}

  params.forEach((param) => {
    const [key, value] = param.split('=')
    queryParams[key] = decodeURIComponent(value)
  })

  return query ? queryParams[query] : queryParams
}
