/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-20 11:43:12
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-04 14:35:12
 * @Description:
 */
import { normalizeFiledata, FileData, isJSONStr } from '@/utils'

export interface Unevaluated {
  good: {
    pic: string
    productName: string
    price: number
    purchaseCount: number // 采购数量
  }
  star: number
  comment: string
  picture: FileData[]
}

// 初始化待评价列表
export function normalizeUnevaluatedList(arr: any): Unevaluated[] {
  const ret: Unevaluated[] = []

  if (!Array.isArray(arr)) {
    return ret
  }
  arr.forEach((item) => {
    const atom = {
      good: {
        pic: item.productImgUrl,
        productName: item.product,
        price: item.price,
        purchaseCount: item.purchaseCount, // 采购数量
        unit: item.unit,
      },
      totalPrice: item.totalPrice,
      star: item.star, // 评分星星
      comment: item.comment, // 评价
      picture: Array.isArray(item.pics) ? item.pics.map((item) => normalizeFiledata(item)) : [],
      smile: item.star, // 笑脸
      orderType: item.orderType, // 笑脸
    }
    ret.push(atom)
  })
  return ret
}
