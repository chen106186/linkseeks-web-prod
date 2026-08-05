/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-20 10:10:55
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-28 16:48:48
 * @Description:
 */
import { OptionItemType } from '../components/ApplicableList'
type OriginUnitPriceType = { [key: string]: any }

type UnitPriceType = {
  /**
   * 起始
   */
  min: number
  /**
   * 终止值
   */
  max: number
  /**
   * 阶梯价格
   */
  price: number
}

export type CategoryItemType = {
  /**
   * 品类id
   */
  id: number
  /**
   * 品类图片
   */
  imageUrl: string
  /**
   * 品类名称
   */
  name: string
}

export type ShopItemType = {
  /**
   * 商城id
   */
  id: number
  /**
   * 商城图片
   */
  logoUrl: string
  /**
   * 商城名称
   */
  name: string
}

export type BrandItemType = {
  /**
   * 品牌id
   */
  id: number
  /**
   * 品牌图片
   */
  logoUrl: string
  /**
   * 品牌名称
   */
  name: string
}

export function normalizeUnitPrice(unitPrice: UnitPriceType): UnitPriceType[] {
  if (!unitPrice) {
    return
  }
  const ret = []
  const objKeys = Object.keys(unitPrice).sort((a, b) => parseFloat(a) - parseFloat(b))

  objKeys.forEach((item) => {
    const keyArr = item.split('-')
    const value = unitPrice[item]
    ret.push({
      min: keyArr[0],
      max: keyArr[1],
      price: value,
    })
  })

  return ret
}

export function normalizeCategoryList(origin: CategoryItemType[][]): OptionItemType[] {
  const ret: OptionItemType[] = []
  if (!Array.isArray(origin)) {
    return ret
  }
  origin.forEach((item, index) => {
    ret.push({
      logo: item[item.length - 1]?.imageUrl,
      label: item.map((item) => item.name).join('-'),
      value: index,
    })
  })
  return ret
}

export function normalizeShopList(origin: ShopItemType[]): OptionItemType[] {
  const ret: OptionItemType[] = []
  if (!Array.isArray(origin)) {
    return ret
  }
  origin.forEach((item) => {
    ret.push({
      logo: item.logoUrl,
      label: item.name,
      value: item.id,
    })
  })
  return ret
}

export function normalizeBrandList(origin: BrandItemType[]): OptionItemType[] {
  const ret: OptionItemType[] = []
  if (!Array.isArray(origin)) {
    return ret
  }
  origin.forEach((item) => {
    ret.push({
      logo: item.logoUrl,
      label: item.name,
      value: item.id,
    })
  })
  return ret
}
