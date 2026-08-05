/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-12 16:41:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-19 14:12:36
 * @Description:
 */
import { BillDetailsItemType, BillDetailsItemValueType } from './interface'

// 格式化初始单据详情数据，计算初始单据数量，单据金额
export function normalizeBillDetails(data: BillDetailsItemType[]): BillDetailsItemValueType[] {
  const ret: BillDetailsItemValueType[] = []

  data.forEach((item) => {
    const atom: BillDetailsItemValueType = {
      ...item,
      count: +item.count,
      amount: +(+item.count * +item.price).toFixed(2),
    }
    ret.push(atom)
  })
  return ret
}
