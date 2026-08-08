import { Toast } from '@apps/mobile-ui'
import { showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { getIntl } from '@linkseeks/i18n'
import { fnGetLimtArr, fnGetSkuId } from '@/packages/order/commonlyFn'
import { postMarketingMobileActivityGoodsPriceCalculate } from '@apps/apis'
import { postProductMobileShopPurchaseSaveOrUpdatePurchase } from '@apps/apis'

/**
 * 明确商品归属商店
 * memberId 该商品所属商铺ID
 * memberName 该商品所属商铺名字
 * newCommodityMessage: 经过整合的商品信息
 * newShopMessage  购物车已经整合好的商品信息
 * orderAmount 包邮的限制
 */
const fnGetShopAscription = (
  memberId: string,
  memberRoleId: string,
  memberName: string,
  newCommodityMessage: any,
  newShopMessage: any,
  commodityType: string,
  storeId: number,
  storeLogo: string,
  storeName: string,
  orderAmount: number,
) => {
  const shopId = `shopId_${memberId}`
  const commodityTypeKey = `type_${commodityType}`
  if (!newShopMessage[shopId]) {
    // eslint-disable-next-line no-param-reassign
    newShopMessage[shopId] = {
      memberId,
      memberName,
      memberRoleId,
      storeName,
      storeLogo,
      storeId,
      commodity: [newCommodityMessage],
      commodityType: {},
      selectCommodity: [],
      allSelectCommodity: [],
      allPay: 0, // 318 新增数据, 商品总金额
      orderAmount: orderAmount, // 包邮的限制
    }
    // eslint-disable-next-line no-param-reassign
    newShopMessage[shopId].commodityType[commodityTypeKey] = [newCommodityMessage]
    // 过滤是否售罄或者下架或者是否现货商品
    if (
      newCommodityMessage.isPublish &&
      newCommodityMessage.priceType === 1 &&
      newCommodityMessage.stockCount !== 0 &&
      `${newCommodityMessage.isMain}` !== 'false'
    ) {
      // 还没有下架
      newShopMessage[shopId].allSelectCommodity.push(newCommodityMessage.skuId)
    }
  } else {
    newShopMessage[shopId].commodity.push(newCommodityMessage)
    // 过滤是否售罄或者下架
    if (
      newCommodityMessage.isPublish &&
      newCommodityMessage.priceType === 1 &&
      newCommodityMessage.stockCount !== 0 &&
      `${newCommodityMessage.isMain}` !== 'false'
    ) {
      newShopMessage[shopId].allSelectCommodity.push(newCommodityMessage.skuId)
    }
    if (newShopMessage[shopId].commodityType[commodityTypeKey]) {
      newShopMessage[shopId].commodityType[commodityTypeKey].push(newCommodityMessage)
    } else {
      // eslint-disable-next-line no-param-reassign
      newShopMessage[shopId].commodityType[commodityTypeKey] = [newCommodityMessage]
    }
  }
  return newShopMessage
}
// 明确商品属性数组对象
const fnGetSku = (attributeAndValueList: any) => {
  const attrArr = attributeAndValueList.map((item: any) => {
    const obj = {
      name: item.customerAttribute.name,
      value: item.customerAttributeValue.value,
      id: item.id,
    }
    return obj
  })
  return attrArr
}
/**
 * @param newCommodityCount 当前商品数量
 * @param newActivity 当前活动
 * @returns 赠品
 */
const fnGetGiftList = (newCommodityCount: number, newActivity: any) => {
  let giftList: any = []
  newActivity.ladders.forEach((item: any) => {
    if (item.limitValue <= newCommodityCount) {
      giftList = [...giftList, ...item.list]
    }
  })
  return giftList
}
/**
 * 初始化当情商品的赠送
 * @param newCommodity 当前商品
 */
const fnInitGift = (newCommodity: any) => {
  let gift: any = []
  if (newCommodity.topActivityDetail && newCommodity.topActivityDetail.activityType === 6) {
    const giftListDesc = fnGetGiftList(newCommodity.count, newCommodity.topActivityDetail)
    gift = [...gift, ...giftListDesc]
  }
  if (newCommodity.activityDetails && newCommodity.activityDetails.length > 0) {
    newCommodity.activityDetails.forEach((item: any) => {
      if (item.activityType === 6) {
        const giftListDesc = fnGetGiftList(newCommodity.count, item)
        gift = [...gift, ...giftListDesc]
      }
    })
  }
  return gift
}
/**
 *  明确商品价格和梯度选中
 *  unitPrice 梯度价格
 *  count 数量
 */
const fnGetPriceAndAction = (unitPrice: { [x: string]: number }, count: number) => {
  const keys = Object.keys(unitPrice).sort((a, b) => parseFloat(a) - parseFloat(b))
  let newPrice = 0
  let newAction = 0
  keys.forEach((item: any, index: number) => {
    const countArr = item.split('-')
    const begin = Number(countArr[0])
    const end = Number(countArr[1])
    if (begin <= count && count <= end) {
      newPrice = Number(unitPrice[item])
      newAction = index
    }
  })
  if (!newPrice) {
    // 如果不在区间内 小于第一个开始值就是两个之间
    keys.forEach((item: any, index: number) => {
      const countArr = item.split('-')
      const begin = Number(countArr[0])
      const end = Number(countArr[1])
      if (count < begin && !newPrice) {
        newAction = index - 1
        newPrice = Number(unitPrice[keys[newAction]])
      }
    })
  }
  if (!newPrice) {
    // 拿不到，就拿了最后一个
    newPrice = unitPrice[keys[keys.length - 1]]
    newAction = keys.length - 1
  }
  return {
    newPrice,
    newAction,
  }
}
/**
 * 获取限制购买的数量
 */
const fnGetLimitCount = (newCommodity: any) => {
  let limitCount = newCommodity.stockCount
  if (!newCommodity.goodsCartResp) {
    return limitCount
  }
  if (newCommodity.goodsCartResp.topActivityDetail) {
    const { topActivityDetail } = newCommodity.goodsCartResp
    if (topActivityDetail.restrictNum && topActivityDetail.restrictNum < limitCount) {
      limitCount = topActivityDetail.restrictNum
    }
  }
  if (newCommodity.goodsCartResp.activityDetails && newCommodity.goodsCartResp.activityDetails.length > 0) {
    newCommodity.goodsCartResp.activityDetails.forEach((item: any) => {
      if (item.restrictNum && item.restrictNum < limitCount) {
        limitCount = item.restrictNum
      }
    })
  }
  return limitCount
}
/**
 * 区分套餐商品
 * @param newCommodityDesc 当前商品
 */
const fnGetActivityType = (newCommodityDesc: any) => {
  if (newCommodityDesc.purchaseCommodityType === 4 || newCommodityDesc.purchaseCommodityType === 2) {
    // 2 套餐商品, 4 换购商品
    return `type_${newCommodityDesc.purchaseCommodityType}_${newCommodityDesc.setMealId}`
  }
  return `type_${newCommodityDesc.purchaseCommodityType}`
}

/**
 *
 * @param obj 全部商品信息 为了拿到父商品的购物车id
 * @param item 当前商品信息
 * @returns
 */
const fnSetParentSkuId = (item: any, obj: any) => {
  if (!item.setMealId) {
    return ''
  }
  let cardId = ''
  obj.forEach((thisObj: any) => {
    if (thisObj.isMain && item.setMealId === thisObj.setMealId) {
      cardId = thisObj.id
    }
  })
  return `${item.setMealId}_${cardId}`
}

/**
 *
 * @param obj 商品信息
 * @returns 整合商品信息
 */
const fnGetShopMessage = (obj: any) => {
  let newShopMessage = {}
  obj.forEach((item: any) => {
    // 明确商品sku
    const commoditySku = fnGetSku(item.purchaseSkuResp.commoditySkuAttributeList)
    // 统合当前商品信息
    const { purchaseSkuResp } = item // 商品信息
    const priceMessage = fnGetPriceAndAction(purchaseSkuResp.unitPrice, item.count) // 当前商品价格 当前的梯度
    const newCommodityMessage = {
      name: purchaseSkuResp.commodity.name, // 商品名字
      commoditySku, // 商品的sku
      skuId: `${purchaseSkuResp.id}_${item.id}`, // 商品的skuId------因为skuId不唯一,所以加这个来确定skuId的唯一性
      brandId: purchaseSkuResp.commodity.brandId, // 品牌
      brandName: purchaseSkuResp.commodity.brandName, // 品牌
      isMemberPrice: purchaseSkuResp.commodity.isMemberPrice, // 是否允许会员价
      memberId: purchaseSkuResp.commodity.memberId, // 会员id
      memberRoleId: purchaseSkuResp.commodity.memberRoleId, // 会员角色id
      unitPrice: purchaseSkuResp.unitPrice, // 梯度价格
      count: item.count, // 商品的数量
      minOrder: purchaseSkuResp.commodity.minOrder, // 最小起订
      stockCount: item.stockCount, // 库存数量
      limitCount: fnGetLimitCount(item), // 限制购买数量
      newPrice: priceMessage.newPrice, // 当前商品价格
      estimatePrice: 0, // 预估到手价
      newAction: priceMessage.newAction, // 当前的梯度
      commodityId: purchaseSkuResp.commodity.id, // 商品id
      id: item.id, // 购物车id
      commodityLogo: purchaseSkuResp.commodity.mainPic, // 商品logo
      unitName: purchaseSkuResp.commodity.unitName, // 商品单位
      logistics: purchaseSkuResp.commodity.logistics, // 物流信息
      memberName: purchaseSkuResp.commodity.memberName, // 商店名称
      storeLogo: purchaseSkuResp.commodity.storeLogo, // 商店Logo
      storeName: purchaseSkuResp.commodity.storeName, // 商店名称
      storeId: purchaseSkuResp.commodity.storeId, // 店铺id
      isPublish: item.isPublish, // 是否出版
      topActivityDetail: {}, // 放置顶部的活动
      activityDetails: [], // 放置下面的活动
      parameter: item.parameter, // 会员权益比例
      customerCategoryId: purchaseSkuResp.commodity.customerCategoryId, // 商品分类
      customerCategoryName: purchaseSkuResp.commodity.customerCategoryName, // 商品分类
      upperCommodityId: purchaseSkuResp.commodity.upperCommodityId, // 上游商品id
      upperMemberId: purchaseSkuResp.commodity.upperMemberId, // 上游供应会员id
      upperMemberName: purchaseSkuResp.commodity.upperMemberName, // 上游供应会员名称
      upperMemberRoleId: purchaseSkuResp.commodity.upperMemberRoleId, // 上游供应会员角色id
      upperMemberRoleName: purchaseSkuResp.commodity.upperMemberRoleName, // 上游供应会员角色名称
      taxRate: purchaseSkuResp.commodity.taxRate, // 税率
      priceType: purchaseSkuResp.commodity.priceType, // 商品价格类型，1-现货价格，2-询价价格，3-积分兑换，4-赠品
      giftList: [], // 赠品初始化
      parentSkuId: fnSetParentSkuId(item, obj), // 新增数据----商品的父skuId------因为skuId不唯一,所以加这个来确定skuId的唯一性
      isMain: item.isMain, // 新增数据----是否套餐的主商品
      setMealId: item.setMealId, // 新增数据--- 套餐id
      purchaseCommodityType: item.purchaseCommodityType, // 新增数据--- 商品类型：1-普通商品;2-套餐商品;3-秒杀商品;4-换购商品;
      commodityAreaList: purchaseSkuResp.commodity.commodityAreaList, // 318 新增数据-商品物流配送地址 用来判断是否存在配送范围
      limitWay: purchaseSkuResp.commodity.salesAreaTemplate?.limitWay,
      isAllArea: purchaseSkuResp.commodity.isAllArea, // 318 新增数据-商品物流配送地址
      isCrossBorder: purchaseSkuResp.commodity.isCrossBorder, // 判断是不是跨境商品
    }
    if (item.goodsCartResp) {
      newCommodityMessage.topActivityDetail = item.goodsCartResp.topActivityDetail
      newCommodityMessage.activityDetails = item.goodsCartResp.activityDetails
    }
    newCommodityMessage.giftList = fnInitGift(newCommodityMessage)
    // 明确商品归属商店
    newShopMessage = fnGetShopAscription(
      purchaseSkuResp.commodity.memberId,
      purchaseSkuResp.commodity.memberRoleId,
      purchaseSkuResp.commodity.memberName,
      newCommodityMessage,
      newShopMessage,
      fnGetActivityType(item),
      purchaseSkuResp.commodity.storeId,
      purchaseSkuResp.commodity.storeLogo,
      purchaseSkuResp.commodity.storeName,
      item.orderAmount,
    )
  })
  console.log(newShopMessage, '整合后的')
  return newShopMessage
}

/**
 * @param allId 选中商品id
 * @param newObj 当前商品
 * @returns 购物车总价格和总数
 */
const fnGetAllNumberAndPrice = (allId: Array<number>, newObj: any) => {
  let allNumber = 0
  let allPrice = 0
  let originalPrice = 0 // 原价
  let arrDesc: any = []
  allId.forEach((newId: number) => {
    Object.keys(newObj.commodityType).forEach((typeKey: string) => {
      newObj.commodityType[typeKey].forEach((thisObj: any) => {
        if (thisObj.skuId === newId) {
          allNumber += thisObj.count
          originalPrice += thisObj.count * thisObj.newPrice
          if (thisObj.estimatePrice > 0) {
            allPrice += thisObj.count * thisObj.estimatePrice
          } else {
            allPrice += thisObj.count * thisObj.newPrice
          }
          if (thisObj.isMain && thisObj.purchaseCommodityType === 4) {
            // 换购商品的主商品 明确换购条件
            const limitMoney = thisObj.estimatePrice * thisObj.count
            arrDesc = fnGetLimtArr(limitMoney, thisObj)
          }
        } else if (thisObj.parentSkuId === newId) {
          // 子商品
          allNumber += thisObj.count
          if (thisObj.purchaseCommodityType === 4) {
            // 为4点时候是换购商品,所以也要加上换购商品的价格
            if (arrDesc.indexOf(fnGetSkuId(thisObj.skuId)) > -1) {
              // 换购商品 切可以换购
              if (thisObj.estimatePrice > 0) {
                allPrice += thisObj.count * thisObj.estimatePrice
              } else {
                allPrice += thisObj.count * thisObj.newPrice
              }
            } else {
              // 不构成换购的条件
              allNumber -= thisObj.count
            }
          }
        }
      })
    })
  })
  allPrice = Number(allPrice.toFixed(2))
  const callBlackObj = {
    allNumber,
    allPrice,
    originalPrice,
  }
  return callBlackObj
}
/**
 *x
 * @param shopMessage 购物车商品信息
 * @returns 购物车的总价格 总件数 总类数
 */
const fnGetAllType = (shopMessage: any) => {
  let allType = 0 // 所有商品类型
  let allNumber = 0 // 所有商品总数量
  let allPrice = 0 // 总价格
  let originalPrice = 0 // 原价
  const keys = Object.keys(shopMessage)
  keys.forEach((key) => {
    allType += shopMessage[key].selectCommodity.length
    if (shopMessage[key].selectCommodity.length !== 0) {
      const objNumOrPri = fnGetAllNumberAndPrice(shopMessage[key].selectCommodity, shopMessage[key])
      allNumber += objNumOrPri.allNumber
      allPrice += objNumOrPri.allPrice
      originalPrice += objNumOrPri.originalPrice
    }
  })
  return {
    allType,
    allNumber,
    allPrice,
    originalPrice,
  }
}

/**
 * 获取skuId
 */
const fnGetSkuId_1 = (skuId: any) => {
  try {
    return Number(`${skuId.split('_')[1]}`)
  } catch (error) {
    return skuId
  }
}

/**
 * @param thisComany 当前选中的商品（对象模式）
 * @returns 返回整合的vendors参数
 */
const fnGetCheckPar = (thisComany: any) => {
  const arr: { vendorMemberId: number; vendorRoleId: number; products: never[] }[] = []
  Object.keys(thisComany).forEach((key) => {
    const obj: any = {
      vendorMemberId: '',
      vendorRoleId: '',
      products: [],
    }
    const commodityArr: any[] = []
    if (thisComany[key].selectCommodity) {
      thisComany[key].selectCommodity.forEach((keyId: number) => {
        thisComany[key].commodity.forEach((item: any) => {
          if (item.skuId === keyId || fnGetSkuId_1(keyId) === fnGetSkuId_1(item.parentSkuId)) {
            commodityArr.push(item)
          }
        })
      })
    } else {
      thisComany[key].forEach((item: any) => {
        commodityArr.push(item)
      })
    }
    commodityArr.forEach((item: any) => {
      obj.vendorMemberId = Number(item.memberId)
      obj.vendorRoleId = Number(item.memberRoleId)
      const productsObj = {
        productId: item.commodityId,
        skuId: fnGetSkuId(item.skuId),
        freightType: item.logistics.carriageType,
        crossBorder: item.isCrossBorder || false,
      }
      obj.products.push(productsObj)
    })
    if (obj.vendorMemberId) {
      arr.push(obj)
    }
  })
  return arr
}
/**
 *
 * @param newCommodity 当前的商品
 * @param shopId 商城的id
 * @param isGroupPurchasing  是否团购
 * @returns
 */
const fnInitListCalculate = (newCommodity: any, shopId: any, isGroupPurchasing?: false) => {
  const obj: any = {
    shopId: shopId.shopId || shopId, // 商城id
    productId: newCommodity.commodityId, // 商品id
    skuId: fnGetSkuId(newCommodity.skuId), // skuid
    commodityType: newCommodity.priceType, // 商品类型:1-会员商品;2-渠道商品
    parentSkuId: `${newCommodity.isMain}` === 'false' ? fnGetSkuId(newCommodity.parentSkuId) : '', // 父级skuid（例如：置换商品）
    quantity: newCommodity.count, // 数量
    upperMemberId: newCommodity.memberId, // 供应商会员id.
    upperRoleId: newCommodity.memberRoleId, // 供应商角色id
    groupNo: newCommodity.purchaseCommodityType === 2 ? newCommodity.setMealId : '', // 分组编号(套餐商品必填)
    joinGroup: !!isGroupPurchasing, // 是否参与拼团
    notJoinList: [],
    purchaseId: newCommodity.id,
  }
  if (!newCommodity.setMealId) {
    const noJoinObj = { activityType: 15 }
    obj.notJoinList.push(noJoinObj)
  }
  return obj
}

/**
 * 删除选中的商品
 * @param arr 选中的商品
 * @param target 删除的商品
 */
const fnPlice = (arr: Array<number>, target: number) => {
  const arrDesc = [...arr]
  const index = arrDesc.indexOf(target)
  arrDesc.splice(index, 1)
  return arrDesc
}

/**
 *x
 * @param shopMessage 购物车商品信息
 * @returns 返回整合后预估到手价
 */
const fnGetEstimate = async (shopMessage: any, shopId: any, errorTips?: string) => {
  const listCalculate: any = []
  let hasCorrect = false
  // debugger
  Object.keys(shopMessage).forEach((key: string) => {
    if (!shopMessage[key].commodityType) {
      return
    }
    if (!errorTips) {
      showLoading()
    } else {
      Toast.show({ title: errorTips, icon: 'none' })
    }
    Object.keys(shopMessage[key].commodityType).forEach((typeKey: string) => {
      shopMessage[key].commodityType[typeKey].forEach((item: any) => {
        const hasSelect = shopMessage[key].selectCommodity.indexOf(item.skuId)
        // eslint-disable-next-line no-param-reassign
        item.estimatePrice = 0
        if (hasSelect > -1 && `${item.isMain}` !== 'false') {
          // 选中并且需要会员比例
          // eslint-disable-next-line no-param-reassign
          // item.estimatePrice = item.parameter * item.newPrice;
          const calculate = fnInitListCalculate(item, shopId)
          listCalculate.push(calculate)
        }
        const hasSelectSetMealId = shopMessage[key].selectCommodity.indexOf(item.parentSkuId)
        if (hasSelectSetMealId > -1 && `${item.isMain}` === 'false' && item.purchaseCommodityType === 4) {
          // 属于换购商品
          const calculate = fnInitListCalculate(item, shopId)
          listCalculate.push(calculate)
        }
      })
    })
  })
  Object.keys(shopMessage).forEach((key: string) => {
    shopMessage[key].allPay = 0
  })
  if (listCalculate.length === 0) {
    return shopMessage
  }

  const { code, data, message } = await postMarketingMobileActivityGoodsPriceCalculate(listCalculate)
  if (code !== 1000) {
    Toast.show({ title: getIntl().formatMessage({ id: `${code}`, defaultMessage: message }), icon: 'none' })
    Object.keys(shopMessage).forEach((key: string) => {
      shopMessage[key].selectCommodity = []
    })
    return shopMessage
  }
  data.forEach((newData: any) => {
    Object.keys(shopMessage).forEach((key: string) => {
      Object.keys(shopMessage[key].commodityType).forEach((typeKey: string) => {
        shopMessage[key].commodityType[typeKey].forEach((item: any) => {
          if (newData.purchaseId === Number(`${item.skuId.split('_')[1]}`)) {
            if (newData.enableQuantity === 0) {
              // 用户已经没有购买的商品了
              // Toast.show({ title: '你已超出最大购买限制' });
              hasCorrect = true
              shopMessage[key].selectCommodity = fnPlice(shopMessage[key].selectCommodity, item.skuId)
              shopMessage[key].allSelectCommodity = fnPlice(shopMessage[key].allSelectCommodity, item.skuId)
              item.estimatePrice = 0
              item.count = 0
              // item.isPublish = false;
              item.stockCount = 0
              item.limitCount = 0
            } else if (newData.enableQuantity > 0) {
              // 超过了最大购买
              Toast.show({ title: `该商品，您最多购买${newData.enableQuantity}件` })
              hasCorrect = true
              shopMessage[key].selectCommodity = fnPlice(shopMessage[key].selectCommodity, item.skuId)
              // shopMessage[key].allSelectCommodity = fnPlice(shopMessage[key].allSelectCommodity, item.skuId);
              item.estimatePrice = 0
              item.count = newData.enableQuantity
              item.limitCount = newData.enableQuantity
              fnChangeCountCom(shopId, item)
            } else {
              // 下面四个价格 肯定有一个 从下到上拿即可
              // groupHandPrice 套餐到手价 handPrice 活动到手价 basePrice 会员比例后的价格 commodityPrice 策略价格
              // ps 商品的setMealId 就是 到手价的 groupNo 不同后台的不通字段
              // if (item.setMealId && newData.groupNo === item.setMealId && item.purchaseCommodityType === 2){ // 因为套餐的时候,skuId一样的 所以套餐特别处理,还得套餐id一致
              //   item.estimatePrice = newData.handPrice || newData.basePrice || newData.commodityPrice;
              //   item.handPrice = newData.handPrice;
              // }else if (item.purchaseCommodityType === 4){ // 换购商品,也有一样的skuId
              //   item.estimatePrice = newData.handPrice || newData.basePrice || newData.commodityPrice;
              //   item.handPrice = newData.handPrice;

              // } else
              if (Number(item.skuId.split('_')[1]) === newData.purchaseId) {
                item.estimatePrice =
                  newData.groupHandPrice || newData.handPrice || newData.basePrice || newData.commodityPrice
                item.handPrice = newData.handPrice
                if (item.purchaseCommodityType === 2) {
                  item.handPrice = newData.handPrice
                }
                if (item.logistics?.carriageType === 2) {
                  shopMessage[key].allPay += (item.handPrice || item.estimatePrice) * item.count
                }
              }

              item.saleTotalAmount = newData.saleTotalAmount
              item.giveList = [] // 重置一下赠品
              if (newData.setMealList) {
                // 套餐活动的子商品重置一下到手价
                newData.setMealList.forEach((mealItem: any) => {
                  shopMessage[key].commodityType[typeKey].forEach((newlChildItem: any) => {
                    if (mealItem.id === Number(`${newlChildItem.skuId.split('_')[0]}`)) {
                      // ps 商品的setMealId 就是 到手价的 groupNo 不同后台的不通字段
                      if (mealItem.groupNo && mealItem.groupNo === newlChildItem.setMealId) {
                        // 因为套餐的时候,skuId一样的 所以套餐特别处理,还得套餐id一致
                        newlChildItem.estimatePrice =
                          mealItem.groupHandPrice || mealItem.handPrice || mealItem.basePrice || mealItem.commodityPrice
                      } else {
                        newlChildItem.estimatePrice =
                          mealItem.groupHandPrice || mealItem.handPrice || mealItem.basePrice || mealItem.commodityPrice
                      }

                      newlChildItem.count = mealItem.num
                      // const cardId = fnGetCardIdForSkuId(shopMessage[key].commodityType[typeKey], newData.skuId);
                      newlChildItem.parentSkuId = `${newData.skuId}_${newData.purchaseId}`
                    }
                  })
                })
              } else if (newData.giveList) {
                item.giveList = newData.giveList
              }
            }
          }
        })
      })
    })
  })
  if (!errorTips) {
    hideLoading()
  }
  if (hasCorrect) {
    // Toast.show({ title: '选中商品中有商品库存不足', icon: 'none' });
    const newShopMessage = await fnGetEstimate(
      shopMessage,
      shopId,
      getIntl().formatMessage({ id: 'purchase_commonlyFn_fnGetEstimate' }),
    )
    return newShopMessage
  } else {
    return { ...shopMessage }
  }
}
/**
 * 根据当前商品重置当前店铺
 * @param newCommodity 当前商品
 * @param shopMessage 当前店铺
 */
const fnInitShopMessageForCommitidy = (newCommodity: any, shopMessage: any) => {
  // const keyName = `shopId_${newCommodity.memberId}`;
  const commodity = shopMessage.commodityType
  Object.keys(commodity).forEach((key) => {
    commodity[key].forEach((item: any) => {
      if (newCommodity.id === item.id) {
        // 给当前的商品挂上赠品/换购商品
        // eslint-disable-next-line no-param-reassign
        item = newCommodity
      }
    })
  })
  return shopMessage
}

/**
 * 保留两位小数
 */
const fnKeepTwo = (stringPri: number) => Math.abs(stringPri).toFixed(2)

const fnChangeCountCom = async (shopAndSite: any, commodity: any) => {
  const postData = {
    id: commodity.id,
    count: commodity.count,
  }
  // 这里应该需要做防抖优化----已经出了个蒙版 不用了
  const { code } = await postProductMobileShopPurchaseSaveOrUpdatePurchase(postData)
  if (code === 1000) {
  }
}

const fnGetActivityDeliveryType = (deliveryType: number) => {
  const list: string[] = []
  if (deliveryType === 2 || deliveryType === 3) {
    list.push(getIntl().formatMessage({ id: 'communityGroupBuy.activity.deliveryType.2', defaultMessage: '自提' }))
  }
  if (deliveryType === 1 || deliveryType === 3) {
    list.push(getIntl().formatMessage({ id: 'communityGroupBuy.activity.deliveryType.1', defaultMessage: '物流' }))
  }
  return list.join('、')
}

export {
  fnGetShopMessage,
  fnGetPriceAndAction,
  fnGetAllType,
  fnGetCheckPar,
  fnGetEstimate,
  fnKeepTwo,
  fnInitListCalculate,
  fnInitShopMessageForCommitidy,
  fnInitGift,
  fnChangeCountCom,
  fnGetShopAscription,
  fnGetActivityType,
  fnGetActivityDeliveryType,
}
