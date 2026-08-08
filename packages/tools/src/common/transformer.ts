/**
 * 数据转化类型的
 */

/**
 * 转换常量枚举
 * 通过传入的参数，将会返回三个适用于业务中常见的枚举类型
 * @param listEnum 传入一个字符串数组
 * @param options 转化配置
 */
export const transformConstantsEnum = (listEnum: string[], options: any = {}) => {
  const { allowEmpty = false } = options
  const maps: { label: string; value: any }[] = []
  const list: number[] = []
  const textList = listEnum
  listEnum.forEach((text, index) => {
    if (!allowEmpty && index === 0) {
    } else {
      maps.push({
        label: text,
        value: index,
      })
      list.push(index)
    }
  })

  return [maps, list, textList]
}
