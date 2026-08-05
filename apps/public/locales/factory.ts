/**
 * 生成一个国际化的命名空间
 * @param namespace 命名空间
 * @param resource 实际对应的文案，以对象形式
 * @returns 返回生成的国际化命名空间对象
 * @example
 * createLocaleWordSpace('demo', { 'hello': 'word' })
 * 生成 { 'demo.hello': 'word' }
 */
export const createLocaleWordSpace = <K extends string, T extends Record<any, string>>(namespace: K, resource: T) => {
  const localeWordSpace: any = {}
  if (namespace === '') {
    // @ts-ignore
    return resource as Record<`${K}.${keyof T}`, string>
  }
  for (const key in resource) {
    if (resource.hasOwnProperty(key)) {
      localeWordSpace[namespace] = {
        ...localeWordSpace[namespace],
        [key]: resource[key],
      }
    }
  }
  // @ts-ignore
  return localeWordSpace as Record<`${K}.${keyof T}`, string>
}
