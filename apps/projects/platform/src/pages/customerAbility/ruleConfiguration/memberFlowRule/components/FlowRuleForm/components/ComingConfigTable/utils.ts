/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-18 14:56:03
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-18 15:26:10
 * @Description:
 */
export function pagingArr(page, size, arr) {
  const sub = [...arr]
  const star = (page - 1) * size
  const end = star + size
  return sub.slice(star, end)
}
