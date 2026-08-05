import { useState, useEffect } from 'react'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { dateFormat } from '@/utils/date'
import { fnGetSkuId } from '../../../commonlyFn'
import { fnGetPriceAndAction } from '../../purchase/commonlyFn'

/**
 * 根据shopMessageStore返回提交订单页所需要数据
 */
const useProduct = () => {
  const intl = useIntl()
  const {
    purchaseOrderStore: { shopMessageStore },
    userStore: { shopAndSite },
  } = useStores()
  const [productList, setProductList] = useState<any[]>([])
  const [needFreight, setNeedFreight] = useState<boolean>(false)

  const fnGetNewGiveActivity = (newCommiityDesc: any) => {
    let isGive = false
    let giveActivity: any = {}
    if (newCommiityDesc.topActivityDetail.activityType === 6) {
      isGive = true
      giveActivity = newCommiityDesc.topActivityDetail
    }
    if (!isGive) {
      newCommiityDesc.activityDetails.forEach((item: any) => {
        if (item.activityType === 6) {
          giveActivity = item
        }
      })
    }
    return giveActivity
  }

  /**
   * @param item 当前的商品
   * @returns 获取供应商名字 如果是自营商城，直接用自营商城的名字
   */
  const fnGetVendorMemberName = (item: any) => {
    if (shopAndSite?.isSelf) {
      return shopAndSite?.name
    }
    return item.memberName
  }

  const fnGetPrice = (newItem: any) => {
    if (newItem.price || newItem.newPrice) {
      return newItem.price || newItem.newPrice
    }
    const obj = fnGetPriceAndAction(newItem.unitPrice, newItem.num)
    return obj.newPrice
  }

  /**
   * 获取商品的类型 换购的话返回3
   */
  const fnGetPromotionType = (newCom: any) => {
    if (`${newCom.isMain}` === 'true' && newCom.purchaseCommodityType === 4) {
      return 3 // 3-换购的主商品
    } else if (`${newCom.isMain}` === 'false' && newCom.purchaseCommodityType === 4) {
      return 4 // 4-被换购的商品
    } else if (`${newCom.isMain}` === 'true' && newCom.purchaseCommodityType === 2) {
      return 1 // 3-套餐主商品
    } else if (`${newCom.isMain}` === 'false' && newCom.purchaseCommodityType === 2) {
      return 2 // 4-套餐中的商品
    }
    return 0
  }

  /**
   * @param item 当前商品
   * @returns 整合后的订单商品参数 --赠品｜｜换购
   */
  const fnInitObjGift = (item: any) => {
    const _itemDeliveryType = item?.deliveryType ?? item.logistics?.deliveryType
    // 物流+自提 如果没有选择就默认是物流
    const _deliveryType =
      _itemDeliveryType === DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF ? DELIVERY_TYPE_ENUM.LOGISTICS : _itemDeliveryType
    const obj = {
      vendorMemberId: item.memberId, // 供应商会员Id
      vendorRoleId: item.memberRoleId, // 供应商会员角色Id
      vendorMemberName: fnGetVendorMemberName(item), // 供应商会员名称
      supplyMemberId: item.upperMemberId, // 上游供应商会员Id
      supplyRoleId: item.upperMemberRoleId, // 上游供应商会员角色Id
      supplyMemberName: item.upperMemberRoleName, // 上游供应商会员名称
      productId: item.productId, // 商品Id
      skuId: item.skuId, // 商品SkuId
      name: item.productName, // 商品名称
      brand: item.brandName, // 商品品牌
      unit: item.unit || item.unitName, // 计价单位
      logo: item.productImgUrl, // 商品LogoUrl
      price: fnGetPrice(item), // 商品单价
      refPrice: item.swapPrice || 0, // 商品到手价格
      discount: item.parameter === 0 ? 1 : item.parameter, // 会员折扣（百分比的分子部分）
      quantity: item.num, // 采购数量
      tax: !!item.taxRate, // 是否含税（true-含税，false-不含税）
      taxRate: item.taxRate, // 税率（百分比的分子部分）
      deliveryType: _deliveryType || DELIVERY_TYPE_ENUM.NO_DELIVERY, // 配送
      priceType: item.priceType, // 商品价格类型，1-现货价格，2-询价价格，3-积分兑换，4-赠品
      category: item.categoryName, // 商品品类
      spec: item.attribute, // 商品规格
      promotionType: fnGetPromotionType(item), // 商品营销活动类型：0-无营销活动的普通商品，1-套餐主商品，2-套餐中的商品，3-被换购的商品，4-其他营销活动商品
      parentSkuId: item.parentSkuId, // 换购商品SkuId，如果是被换购的商品，不能为空，且换购前的商品必须在商品列表中，
      groupNo: item.isMain ? item.setMealId : '', // 套餐编号，如果是套餐主商品不能为空或0
      addressId: '', // 自提地址ID
      logisticsTemplateId: '', // 物流模板Id，当配送方式是物流时要非空且大于0
      freightType: '', // 运费类型，1-卖家承担，2-买家承担
      weight: '', // 商品重量，当配送方式是物流时要非空且大于0
      crossBorder: item.isCrossBorder || false, // 是否跨境
    }
    // 自提
    if (obj.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP) {
      // obj.address = `${item.logistics.addMessage.provinceName}${item.logistics.addMessage.cityName}${item.logistics.addMessage.districtName}${item.logistics.addMessage.address}`;
      // obj.receiver = item.logistics.addMessage.shipperName;
      // obj.phone = item.logistics.addMessage.phone;
      obj.addressId = item.logistics?.sendAddressId
      // return obj;
    } else if (obj.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS) {
      // 物流
      obj.logisticsTemplateId = item.logistics?.templateId
      obj.freightType = item.logistics?.carriageType
      obj.weight = `${item.logistics?.weight}`
      // return obj;
    }
    return obj
  }

  /**
   * @param skuList
   * 获取sku属性
   */
  const fnGetSku = (skuList: any) => {
    try {
      if (!skuList || skuList.length === 0) {
        return ''
      }
      const str = skuList.map((item: any) => `${item.name}:${item.value}`)
      return str.join(',')
    } catch (error) {
      return intl.formatMessage({ id: 'confirmOrder_components_footerBtn_fnGetSku', defaultMessage: '报错了' })
    }
  }

  const fnInitActivityPar = (newActivity: any) => {
    let startTime: any = (newActivity.startTime ? `${newActivity.startTime}` : '').replace(/-/g, '/')
    let endTime: any = (newActivity.endTime ? `${newActivity.endTime}` : '').replace(/-/g, '/')
    if (!startTime.includes('/')) {
      // 因为拼团的时间返回的是时间戳  其他的是字符串 这里要重置一下
      startTime = Number(startTime)
      endTime = Number(endTime)
    }
    const obj = {
      recordId: newActivity.recordId, //（例如拼团订单）营销记录Id，前端从营销服务获得，可为空
      promotionId: newActivity?.activityId, // 营销活动Id
      name: newActivity.preferentialTag, // 营销活动名称
      promotionType: newActivity.activityType, // 营销活动类型枚举
      belongType: newActivity.belongType, // 营销活动归属类型枚举
      startTime: dateFormat(new Date(startTime), 'YY-MM-DD HH:mm:ss'), // 营销活动起始时间,格式为yyyy-MM-ddHH:mm:ss
      expireTime: dateFormat(new Date(endTime), 'YY-MM-DD HH:mm:ss'), // 营销活动结束时间，格式为yyyy-MM-ddHH:mm:ss
    }
    return obj
  }

  const fnGetPromotions = (newCom: any) => {
    const arrPar: any = []
    if (newCom.topActivityDetail && newCom.topActivityDetail?.activityId) {
      const par = fnInitActivityPar(newCom.topActivityDetail)
      arrPar.push(par)
    }
    if (newCom.activityDetails?.length > 0) {
      newCom.activityDetails.forEach((thisActivity: any) => {
        const par = fnInitActivityPar(thisActivity)
        arrPar.push(par)
      })
    }
    return arrPar
  }

  /**
   * 获取商品的类型 换购的话返回3
   */
  const fnGetParentSkuId = (newCom: any) => {
    if (`${newCom.isMain}` === 'false' && newCom.purchaseCommodityType === 4) {
      return fnGetSkuId(newCom.parentSkuId) // 4-被换购的商品
    }
    return null
  }

  /**
   * @param item 当前商品
   * @returns 整合后的订单商品参数 --主商品
   */
  const fnInitObj = (item: any) => {
    const _itemDeliveryType = item?.deliveryType ?? item.logistics?.deliveryType
    // 物流+自提 如果没有选择就默认是物流
    const _deliveryType =
      _itemDeliveryType === DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF ? DELIVERY_TYPE_ENUM.LOGISTICS : _itemDeliveryType
    const obj = {
      vendorMemberId: item.memberId, // 供应商会员Id
      vendorRoleId: item.memberRoleId, // 供应商会员角色Id
      vendorMemberName: fnGetVendorMemberName(item), // 供应商会员名称
      supplyMemberId: item.upperMemberId, // 上游供应商会员Id
      supplyRoleId: item.upperMemberRoleId, // 上游供应商会员角色Id
      supplyMemberName: item.upperMemberRoleName, // 上游供应商会员名称
      productId: item.commodityId, // 商品Id
      storeId: item.storeId, // 商铺id
      skuId: fnGetSkuId(item.skuId), // 商品SkuId
      name: item.name, // 商品名称
      brand: item.brandName, // 商品品牌
      unit: item.unitName, // 计价单位
      logo: item.commodityLogo, // 商品LogoUrl
      price: item.newPrice, // 商品单价
      refPrice: item.handPrice || item.estimatePrice || item.newPrice, // 商品到手价格  handPrice 在套餐活动的时候 才加上的
      discount: item.parameter === 0 ? 1 : item.parameter, // 会员折扣（百分比的分子部分）
      quantity: item.count, // 采购数量
      stock: item.stockCount, // 供方库存
      tax: !!item.taxRate, // 是否含税（true-含税，false-不含税）
      taxRate: item.taxRate, // 税率（百分比的分子部分）
      deliveryType: _deliveryType || DELIVERY_TYPE_ENUM.NO_DELIVERY, // 配送
      priceType: item.priceType, // 商品价格类型，1-现货价格，2-询价价格，3-积分兑换，4-赠品
      category: item.customerCategoryName, // 商品品类
      spec: fnGetSku(item.commoditySku), // 商品规格
      stockId: 0, // 渠道商品库存Id----非必需
      cartId: item.id, // 购物车Id --- 非必需
      promotions: fnGetPromotions(item), // 活动记录列表
      promotionType: fnGetPromotionType(item), // 商品营销活动类型：0-无营销活动的普通商品，1-套餐主商品，2-套餐中的商品，3-换购的主商品，4-被换购的商品，5-其他营销活动商品
      parentSkuId: fnGetParentSkuId(item), // 换购商品SkuId，如果是被换购的商品，不能为空，且换购前的商品必须在商品列表中，
      groupNo: item.purchaseCommodityType === 2 ? item.setMealId : '', // 套餐编号，如果是套餐主商品不能为空或0
      address: item?.address || '', // 自提地址（如配送方式为自提，必填）
      receiver: item?.receiver || '', // 接收人（如配送方式为自提，必填）
      phone: item?.phone || '', // 接收人电话（如配送方式为自提，必填）
      addressId: item?.addressId || '', // 自提地址ID
      logisticsTemplateId: '', // 物流模板Id，当配送方式是物流时要非空且大于0
      freightType: item.logistics?.carriageType, // 运费类型，1-卖家承担，2-买家承担
      weight: item?.weight || '', // 商品重量，当配送方式是物流时要非空且大于0
      crossBorder: item.isCrossBorder || false, // 是否跨境
    }
    // 自提
    if (obj.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP && !item.addressId) {
      // obj.address = `${item.logistics.addMessage.provinceName}${item.logistics.addMessage.cityName}${item.logistics.addMessage.districtName}${item.logistics.addMessage.address}`;
      // obj.receiver = item.logistics.addMessage.shipperName;
      // obj.phone = item.logistics.addMessage.phone;
      obj.addressId = item.logistics?.sendAddressId
      // return obj;
    } else if (obj.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS) {
      // 物流
      obj.logisticsTemplateId = item.logistics?.templateId
      obj.freightType = item.logistics?.carriageType
      obj.weight = `${item.logistics?.weight}`
      // return obj;
    }
    return obj
  }

  useEffect(() => {
    const _arrList: any = []
    let activityList: any = []
    Object.keys(shopMessageStore).forEach((key: string) => {
      shopMessageStore[key].forEach((item: any) => {
        if (item.additionalCommodity && item.additionalCommodity.length > 0) {
          item.additionalCommodity.forEach((newCommodity: any) => {
            // eslint-disable-next-line no-param-reassign
            newCommodity.parentSkuId = item.skuId
          })
          activityList = [...activityList, ...item.additionalCommodity]
        }
        if (item.giveList && item.giveList.length > 0) {
          // 有赠品数据
          const giveNewActivity = fnGetNewGiveActivity(item)
          if (giveNewActivity.activityType === 6) {
            // 赠品数据
            let contrast = item.count // 商品数量----用来对比层级
            let newLimitValue = 0 // 当前层级
            let giveList = []
            if (giveNewActivity.concreteType === 5 || giveNewActivity.concreteType === 6) {
              // 这里是用商品金额来做确定赠品
              contrast = item.estimatePrice * item.count // 商品金额
            }
            giveNewActivity.ladders?.forEach((ladderItem: any) => {
              if (newLimitValue === 0 && contrast >= ladderItem.limitValue) {
                // 初始化赠品列表和当前曾经
                newLimitValue = ladderItem.limitValue
                giveList = ladderItem.list
              } else if (ladderItem.limitValue <= contrast && ladderItem.limitValue >= newLimitValue) {
                // 当前对比层大 并且还大于储存的赠品
                newLimitValue = ladderItem.limitValue
                giveList = ladderItem.list
              }
            })
            giveList.forEach((giveItem: any) => {
              if (giveItem.skuId) {
                const obj = fnInitObjGift(giveItem)
                _arrList.push(obj)
              }
            })
          }
        }
        const obj = fnInitObj(item)
        _arrList.push(obj)
      })
    })
    setProductList(_arrList)
  }, [shopMessageStore])

  useEffect(() => {
    setNeedFreight(
      productList.find(
        (item) =>
          item.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS ||
          item.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF,
      )
        ? true
        : false,
    )
  }, [productList])

  return {
    /**
     * 商品列表
     */
    productList,
    /**
     * 是否需要运费
     */
    needFreight,
  }
}

export default useProduct
