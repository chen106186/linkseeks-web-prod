import { postMarketingWebActivityGoodsPriceCalculate, postProductShopPurchaseSaveOrUpdatePurchase } from '@apps/apis'
import { message } from 'antd'
import { getWebIntl } from '@/utils/locales'

const translate = getWebIntl()

interface ParmasType {
  shopId: number // 商城id
  productId: any // 商品id
  skuId: any // skuid
  commodityType: any // 商品类型:1-会员商品;2-渠道商品
  parentSkuId: number | undefined // 父级skuid（例如：置换商品）
  quantity: any // 数量
  upperMemberId: any // 供应商会员id.
  upperRoleId: any // 供应商角色id
  groupNo: number | undefined // 分组编号(套餐商品必填)
  joinGroup: boolean
}

/**
 * 初始化获取到手价需要的参数对象
 * @param selectCommodity 当前商品
 */
const fnInitHandPricePar = (selectCommodity: any, mallId: number) => {
  const obj = {
    shopId: mallId, // 商城id
    productId: selectCommodity.purchaseSkuResp.commodity.id, // 商品id
    skuId: selectCommodity.purchaseSkuResp.id, // skuid
    commodityType: selectCommodity.purchaseSkuResp.commodity.priceType, // 商品类型:1-会员商品;2-渠道商品
    parentSkuId: selectCommodity.parentSkuId, // 父级skuid（例如：置换商品）
    quantity: selectCommodity.count, // 数量
    upperMemberId: selectCommodity.purchaseSkuResp.commodity.memberId, // 供应商会员id.
    upperRoleId: selectCommodity.purchaseSkuResp.commodity.memberRoleId, // 供应商角色id
    groupNo: selectCommodity.purchaseCommodityType === 2 ? selectCommodity.setMealId : '', // 分组编号(套餐商品必填)
    joinGroup: selectCommodity.setMealId ? true : false, // 是否参与拼团
    notJoinList: selectCommodity.setMealId ? [] : [{ activityType: 15 }],
  }
  if (!selectCommodity.parentSkuId || selectCommodity.purchaseCommodityType === 4) {
    return obj
  }
}
/**
 * 初始化到手价的参数
 */
const fnInitParmas = (shopList: any, mallId: number) => {
  const parmas: ParmasType[] = []
  shopList.map((item: any) => {
    if (item.checkedList.length > 0) {
      item.checkedList.forEach((selectId: number) => {
        item.orderList.find((selectCommodity: any) => {
          if (selectCommodity.id === selectId) {
            const obj = fnInitHandPricePar(selectCommodity, mallId)
            if (obj) {
              parmas.push(obj)
            }
          }
        })
      })
    }
  })
  return parmas
}

/**
 * 修改购买数量
 * @param count
 * @param id
 */
const handleCountChange = (count: number, id: number, mallId: number) => {
  const param: any = {
    id,
    count: Number(count),
  }

  const headers = {
    shopId: `${mallId}`,
  }

  postProductShopPurchaseSaveOrUpdatePurchase(param, { headers, ctlType: 'none' }).then((res) => {
    if (res.code !== 1000) {
      message.error(res.message)
    }
  })
}

/**
 * 初始化到手价
 * @param shopList 当前购物车商店列表
 * @param mallId 当前商城id
 */
const fnInitHandPrice = async (shopList: any[], mallId: number) => {
  const parmas = fnInitParmas(shopList, mallId)
  if (!parmas || parmas.length === 0) {
    return
  }
  const res = await postMarketingWebActivityGoodsPriceCalculate(parmas, { ctlType: 'none' })
  if (res.code === 1000) {
    shopList.find((thisShop: any) => {
      thisShop.unFreeShipping = 0
    })
    if (!res.data || res.data.length === 0) {
      return {
        shopList: [...shopList],
        shouldReset: false,
      }
    }
    let shouResetInit = false
    res.data.forEach((item: any) => {
      shopList.find((thisShop: any) => {
        thisShop.orderList.find((thisCommodyty: any) => {
          if (
            (thisCommodyty.purchaseSkuResp.id === item.skuId && (thisCommodyty.isMain || !thisCommodyty.parentSkuId)) ||
            (!thisCommodyty.isMain && thisCommodyty.purchaseCommodityType === 4)
          ) {
            // groupHandPrice 套餐到手价 handPrice 活动到手价 basePrice 会员比例后的价格 commodityPrice 策略价格
            if (item.enableQuantity || item.enableQuantity === 0) {
              thisCommodyty.count = item.enableQuantity
              message.destroy()
              message.error(
                `${thisCommodyty.purchaseSkuResp.commodity.name}${translate(
                  'web.resource.mall.huodongkegoumaishuliangbuzuyichongzhi',
                )}${item.enableQuantity}${thisCommodyty.purchaseSkuResp.commodity.unitName}`,
              )
              shouResetInit = true
              handleCountChange(item.enableQuantity, thisCommodyty.id, mallId)
            }
            thisCommodyty.purchaseSkuResp.refPrice = item.handPrice || item.basePrice || item.commodityPrice
            thisCommodyty.purchaseSkuResp.saleTotalAmount = item.saleTotalAmount
            thisShop.shopAllPay += thisCommodyty.purchaseSkuResp.refPrice * thisCommodyty.count
            if (thisCommodyty.purchaseSkuResp.commodity.logistics.carriageType === 2) {
              // 商品运费由买家承担的,才算满额包邮里面
              thisShop.unFreeShipping += thisCommodyty.purchaseSkuResp.refPrice * thisCommodyty.count
            }
            if (item.setMealList?.length > 0) {
              // 套餐的子商品需要重置数量
              if (thisCommodyty.setMealId === item.groupNo) {
                thisCommodyty.groupHandPrice = item.groupHandPrice
                thisCommodyty.saleTotalAmount = item.saleTotalAmount
              }
              item.setMealList.forEach((setMeal: any) => {
                // 循环套餐的子商品
                thisShop.orderList.forEach((thisOrder: any) => {
                  if (
                    thisOrder.purchaseSkuResp.id === setMeal.id &&
                    thisOrder.setMealId === setMeal.groupNo &&
                    item.skuId === thisOrder.parentSkuId
                  ) {
                    thisOrder.count = setMeal.num
                    thisOrder.purchaseSkuResp.refPrice = setMeal.handPrice
                  }
                })
              })
            }
          }
        })
      })
    })
    if (shouResetInit) {
      return {
        shopList: [...shopList],
        shouldReset: true,
      }
    } else {
      return {
        shopList: [...shopList],
        shouldReset: false,
      }
    }
  } else {
    message.destroy()
    message.info(res.message)
    shopList.forEach((item: any) => {
      item.checkedList = []
    })
    return {
      shopList: [...shopList],
      shouldReset: false,
      shouldResetAll: true,
    }
  }
}

export { fnInitHandPrice, fnInitHandPricePar }
