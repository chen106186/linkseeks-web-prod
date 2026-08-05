export function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
/**
 * @param { Object[] } arr 源数据
 * @param { any } target 目标值 通常是id等主键
 * @param { string } customKey 可选 自定义主键 默认'id'
 */
export const findItemAndDelete = (arr: any[], target: any, customKey?: string) => {
  const newArr = [...arr]
  if (newArr.length > 0 && isObject(newArr[0])) {
    return newArr.filter((v) => v[customKey || 'id'] !== target)
  }
  const targetIndex = arr.indexOf(target)
  if (targetIndex === -1) {
    return newArr
  } else {
    newArr.splice(targetIndex, 1)
    return newArr
  }
}
