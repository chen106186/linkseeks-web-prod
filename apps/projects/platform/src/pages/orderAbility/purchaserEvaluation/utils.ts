/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-19 16:02:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-10 18:24:06
 * @Description:
 */
import { normalizeFiledata, FileData } from '@/utils'
import { EvaluationFormValue } from './components/EvaluationForm'

export type EvaluateItem = {
  /**
   * 订单商品明细id
   */
  orderProductId: number
  /**
   * 商品Id（来自商品服务）
   */
  productId: number
  /**
   * 商品skuId（来自商品服务）
   */
  skuId: number
  /**
   * 商品（物料）编号
   */
  productNo: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品品类
   */
  category: string
  /**
   * 商品品牌
   */
  brand: string
  /**
   * 报价商品规格
   */
  spec: string
  /**
   * 计价单位
   */
  unit: string
  /**
   * 商品Logo
   */
  logo: string
  /**
   * 价格
   */
  price: number
  /**
   * 采购数量
   */
  quantity: number
  /**
   * 金额
   */
  amount: number
  /**
   * 评价星级（1-5）
   */
  star: number
  /**
   * 评价内容
   */
  comment: string
  /**
   * 评价图片 ,String
   */
  pics: string[]
  /**
   * 是否已评价0-否1-是
   */
  commentStatus: number
}

export type NormalizedEvaluateItem = EvaluationFormValue['comments'][0] & {}

// 初始化待评价列表
export const normalizeUnevaluatedList = (arr: EvaluateItem[]): NormalizedEvaluateItem[] => {
  const ret = []

  if (!Array.isArray(arr)) {
    return ret
  }
  arr.forEach((item) => {
    // 未评价过的
    const atom = {
      good: {
        pic: item.logo || '',
        productId: item.productId,
        productName: item.name,
        unit: item.unit,
        price: item.price,
        spec: item.spec,
        purchaseCount: item.quantity, // 采购数量
        totalPrice: item.amount,
        orderProductId: item.orderProductId,
      },
      star: item.star || undefined, // 评分星星
      comment: item.comment || undefined, // 评价
      picture: item.pics ? item.pics.map((item) => normalizeFiledata(item)) : [],
      smile: item.star || undefined, // 笑脸
      commentStatus: item.commentStatus,
    }
    ret.push(atom)
  })

  return ret
}
