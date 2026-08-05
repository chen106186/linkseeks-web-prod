import type { ProductItem } from '../../../../components/ProductList/Item'

type ShowcaseCommodityItem = {
  id: number
  name: string
  slogan: string
  min: number
  max?: number
  unitName?: string
  sold: number
  mainPic: string
  storeId: number
  preferentialPrice?: number
  tagList?: string[]
  priceType: number
  activityTypeList?: number[]
  stockCount: number
  minOrder: number
  groupPurchase?: boolean
  memberId?: number
  memberRoleId?: number
  storeName?: string
  memberName?: string
}

/**
 * 橱窗商品列表规格化，保留商品跳转和展示依赖的活动、库存字段。
 * @author guanxiaomign
 */
export const normalizeShowcaseProductList = (data: ShowcaseCommodityItem[], isSelf?: boolean): ProductItem[] => {
  return data.map((item) => {
    const atom: ProductItem = {
      id: item.id,
      name: item.name,
      describe: item.slogan,
      price: item.min,
      unit: item.unitName,
      salesVolume: item.sold,
      picture: item.mainPic,
      storeId: item.storeId,
      preferentialPrice: item.preferentialPrice,
      saleTags: item.tagList,
      priceType: item.priceType,
      activityTypeList: item.activityTypeList,
      stockCount: item.stockCount,
      minOrder: item.minOrder,
      min: item.min,
      max: item.max,
      groupPurchase: item.groupPurchase,
    }

    if (!isSelf) {
      atom.supplierInfo = {
        id: item.memberId as number,
        roleId: item.memberRoleId as number,
        name: item.storeName || item.memberName || '',
      }
    }

    return atom
  })
}
