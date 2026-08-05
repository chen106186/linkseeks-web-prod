/*
 * @Description: 订单相关信息hook
 */
import { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { getWebIntl } from '@/utils/locales'
import { useLocation, useNavigate } from 'react-router-dom'
import { LinkTo } from '@/utils'
import { OrderModeType } from '@/constants'
import {
  PostOrderCreatePaymentFindResponse,
  getOrderCacheGet,
  postOrderCacheDelete,
  postOrderCreatePaymentFind,
  postMarketingWebActivityGoodsPriceCalculate,
  getLogisticsShipperAddressGet,
  getLogisticsShipperAddressStoreList,
  GetPayEAccountAllInPayGetUserBalanceResponse,
  getPayEAccountAllInPayGetUserBalance,
} from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import { ORDER_TYPE } from '@/types/order'
import { getLoginDomainFn } from '@/constants/domain'
import { getQueryString } from '@/utils/getUrlParam'
import {
  OrderInfoType,
  OrderItemInfoType,
  OrderProductType,
  ProductItemType,
  PromotionsCommodityType,
  StoreAddressItemType,
} from '../types'
import { AddressItemType } from '../address'

interface IProps {
  selectAddressInfo: AddressItemType | undefined
}

interface UseOrderInfoReturnRes {
  orderInfo: OrderInfoType | undefined
  contractInfo: any
  orderModel: number
  orderProduct: OrderProductType[]
  balanceInfo: GetPayEAccountAllInPayGetUserBalanceResponse | undefined
  contracErrorInfo: any
  spinningState: boolean
  submitDisabled: boolean
  dispatchSpin: (state: boolean) => void
  dispatchOrderInfo: (newOrderInfo: OrderInfoType) => void
  dispatchSubmitState: (state: boolean) => void
}

/**
 * 获取预下单订单信息
 * @param key
 * @returns
 */
const getCacheOrderInfo = (key: string): Promise<OrderInfoType | undefined> => {
  return new Promise((resolve) => {
    getOrderCacheGet({ key })
      .then((res) => {
        message.destroy()
        if (res.data) {
          resolve(JSON.parse(res.data))
        } else {
          resolve(undefined)
        }
      })
      .catch(() => {
        resolve(undefined)
      })
  })
}

/**
 * 退出订单页面的时候删除预下单数据
 * @param key
 * @returns
 */
const removeCacheOrderInfo = (key: string): Promise<boolean> => {
  return new Promise((resolve) => {
    postOrderCacheDelete({ key })
      .then((res) => {
        message.destroy()
        if (res.code === 1000) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch(() => {
        resolve(false)
      })
  })
}

/**
 * 获取订单的促销金额
 */
const fnGetSaleTotalAmount = async (orderInfo: OrderInfoType) => {
  const parmas: any = []
  orderInfo.orderList.forEach((item) => {
    item.orderList.forEach((second) => {
      let obj = {
        shopId: orderInfo.shopId, // 商城id
        productId: second.productId, // 商品id
        skuId: second.id, // skuid
        commodityType: 1, // 商品类型:1-会员商品;2-渠道商品
        parentSkuId: undefined, // 父级skuid（例如：置换商品）
        quantity: second.count, // 数量
        upperMemberId: second.vendorMemberId, // 供应商会员id.
        upperRoleId: second.vendorRoleId, // 供应商角色id
        groupNo: second.purchaseCommodityType === 2 ? second.setMealId : '', // 分组编号(套餐商品必填)
        joinGroup: orderInfo?.orderType === ORDER_TYPE.group ? true : false, // 是否参与拼团
        notJoinList: second.setMealId ? [] : [{ activityType: 15 }], // 直接购买都不参加套餐活动
      }
      if (!second.parentSkuId) {
        parmas.push(obj)
      }
    })
  })
  try {
    const res = await postMarketingWebActivityGoodsPriceCalculate(parmas, { ctlType: 'none' })
    message.destroy()
    res.data.forEach((callBlackItem: any) => {
      orderInfo.orderList?.forEach((item) => {
        item.orderList.forEach((second) => {
          if (callBlackItem.skuId === second.id) {
            second.refPrice = callBlackItem.handPrice || callBlackItem.basePrice || callBlackItem.goodsPrice
            second.unitPrice = callBlackItem.commodityPrice
            second.price = callBlackItem.commodityPrice
            second.saleTotalAmount = callBlackItem.saleTotalAmount || 0
            second.groupHandPrice = callBlackItem.groupHandPrice || 0
            second.giveList = callBlackItem.giveList || []
            second.memberDiscountAmount = callBlackItem.memberDiscountAmount || 0
          }
        })
      })
    })
  } catch (error) {}
  return orderInfo
}

const useOrderInfo = (props: IProps): UseOrderInfoReturnRes => {
  const { selectAddressInfo } = props
  const { url, userInfo } = useGlobalConext()
  const [orderInfo, setOrderInfo] = useState<OrderInfoType>()
  const [balanceInfo, setBalanceInfo] = useState<GetPayEAccountAllInPayGetUserBalanceResponse>()
  const [spinningState, setSpinningState] = useState<boolean>(true)
  const location = useLocation()
  const spamId = getQueryString('spam_id', location?.search)
  const [contractInfo, setContractInfo] = useState<any>()
  const [contracErrorInfo, setContracErrorInfo] = useState<any>()
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false)
  const translate = getWebIntl()
  const navigate = useNavigate()

  const matchLevel = (
    storeAddress: StoreAddressItemType,
    matchAddressInfo: AddressItemType,
    level: number,
  ): boolean => {
    if (level === 4) {
      return (
        storeAddress.provinceCode === matchAddressInfo.provinceCode &&
        storeAddress.cityCode === matchAddressInfo.cityCode &&
        storeAddress.districtCode === matchAddressInfo.districtCode &&
        storeAddress.streetCode === matchAddressInfo.streetCode
      )
    } else {
      return (
        storeAddress.provinceCode === matchAddressInfo.provinceCode &&
        storeAddress.cityCode === matchAddressInfo.cityCode &&
        storeAddress.districtCode === matchAddressInfo.districtCode
      )
    }
  }

  /** 匹配自提地址 */
  const matchNearPickUpAddress = (orderList: OrderItemInfoType[], addressInfo: AddressItemType) => {
    const newOrderList = orderList.map((orderItem) => {
      return {
        ...orderItem,
        orderList: orderItem.orderList.map((productItem) => {
          if (orderItem.storeList && orderItem.storeList.length > 0) {
            // 显示省市区三级匹配上的门店地址作为自提地址，并将省市区街道四级都能匹配上的门店地址显示在最前面，并默认选择第一个
            // 匹配到街道的地址
            const streeFilterAddress = orderItem.storeList.filter((storeAddressItem) =>
              matchLevel(storeAddressItem, addressInfo, 4),
            )[0]
            if (!streeFilterAddress) {
              // 匹配到区级的地址
              const districtFilterAddress = orderItem.storeList.filter((storeAddressItem) =>
                matchLevel(storeAddressItem, addressInfo, 3),
              )[0]
              if (districtFilterAddress) {
                productItem['pickUpAddress'] = districtFilterAddress
                orderItem.storeList = orderItem.storeList.sort((a, b) => (b.id === districtFilterAddress.id ? 1 : -1))
              }
            } else {
              productItem['pickUpAddress'] = streeFilterAddress
              orderItem.storeList = orderItem.storeList.sort((a, b) => (b.id === streeFilterAddress.id ? 1 : -1))
            }
          }
          return productItem
        }),
      }
    })
    if (orderInfo) {
      const newOrderInfo = { ...orderInfo }
      newOrderInfo.orderList = newOrderList
      setOrderInfo(newOrderInfo)
    }
  }

  useEffect(() => {
    // 如果含有自提的配送方式则根据收货地址匹配最近的自提地址
    if (
      orderInfo &&
      selectAddressInfo &&
      (orderInfo.logistics.deliveryType === 4 || orderInfo.logistics.deliveryType === 2) &&
      orderInfo.orderList.some((item) => item.storeList && item.storeList.length > 0)
    ) {
      matchNearPickUpAddress(orderInfo.orderList, selectAddressInfo)
    }
  }, [selectAddressInfo])

  // useEffect(() => {
  //   if (orderInfo) {
  //     if (
  //       orderInfo.logistics.deliveryType === 1 ||
  //       orderInfo.logistics.deliveryType === 4
  //     ) {
  //       if (selectAddressInfo) {
  //         fetchElectronicContractInfo();
  //       }
  //     } else {
  //       fetchElectronicContractInfo();
  //     }
  //   }
  // }, [orderInfo, selectAddressInfo]);

  /**
   * 获取下单模式
   */
  const orderModel = useMemo(() => {
    let mode = OrderModeType.BUYER
    if (orderInfo?.orderType === ORDER_TYPE.integral) {
      mode = OrderModeType.RIGHT_POINT
    } else {
      mode = OrderModeType.BUYER
    }
    return mode
  }, [orderInfo])

  /**
   * 对支付方式进行排序
   * @param info 支付信息
   * @returns  支付信息
   */
  const sortPayWay = (info: PostOrderCreatePaymentFindResponse) => {
    if (info && info?.payTypes && info?.payTypes.length > 0) {
      const newPayWayInfo: PostOrderCreatePaymentFindResponse = { ...info }
      const newPayTypes = info.payTypes.sort((a, b) => (b.payType === 6 || b.payType === 1 ? 1 : -1))
      newPayWayInfo.payTypes = newPayTypes
      return newPayWayInfo
    }
    return info
  }

  /**
   * 获取支付方式
   * @param memberId
   */
  const getPayWayListByMemberId = (
    vendors: any,
    shopId: number,
  ): Promise<{
    required: boolean
    payTypes: any[]
    payNodes: any[]
    hasContract: boolean
    contractId: number
  }> => {
    return new Promise((resolve, reject) => {
      if (!vendors) {
        resolve({
          required: false,
          payTypes: [],
          payNodes: [],
          hasContract: false,
          contractId: 0,
        })
        return
      }
      const param: any = {
        shopId,
        vendors,
      }
      postOrderCreatePaymentFind(param, { ctlType: 'none' }).then((res) => {
        message.destroy()
        if (res.code === 1000) {
          resolve(sortPayWay(res.data))
        } else {
          message.error(res.message)
          reject()
        }
      })
    })
  }

  /**
   * 根据url中的spamId获取sessionStorage中的订单信息
   */
  const initOrderInfo = async (spamId: string) => {
    let cacheOrderInfo = await getCacheOrderInfo(spamId)
    if (!cacheOrderInfo) {
      message.error(translate('web.resource.mall.dingdanbucunzai'))
      // history.goBack();
      navigate(-1)
      return
    }
    const newOrderList: any[] = []
    let storeList: StoreAddressItemType[] = []
    const vendors: any[] = []
    for (const item of cacheOrderInfo.orderList) {
      const tempOrderList: any[] = []
      const vendorsItem: any = {
        products: [],
      }
      for (const orderItem of item.orderList) {
        let resData: any = {}
        if (orderItem.logistics.deliveryType !== 3) {
          if (orderItem.logistics?.sendAddressId) {
            try {
              resData = await getLogisticsShipperAddressGet({
                id: String(orderItem.logistics.sendAddressId),
              })
            } catch (error) {}
          }
          message.destroy()
          // 如果是物流+自提的方式，则默认勾选物流
          if (orderItem.logistics.deliveryType === 4) {
            orderItem.selectDeliveryType = 1
          } else {
            orderItem.selectDeliveryType = orderItem.logistics.deliveryType
          }

          const param: any = {
            vendorMemberId: orderItem.vendorMemberId,
            vendorRoleId: orderItem.vendorRoleId,
          }
          const res = await getLogisticsShipperAddressStoreList(param)
          if (res.code === 1000 && res.data && res.data.length > 0) {
            storeList = res.data as unknown as StoreAddressItemType[]
            // 如果门店地址为空则使用【商品能力--商品管理--商品管理--新增商品】中物流信息设置的发货(自提)地址
            orderItem.pickUpAddress = storeList[0]
          } else {
            // 如果门店地址为空则使用【商品能力--商品管理--商品管理--新增商品】中物流信息设置的发货(自提)地址
            orderItem.pickUpAddress = resData.data || undefined
          }
        }
        item.memberId = orderItem.vendorMemberId
        item.memberRoleId = orderItem.vendorRoleId
        tempOrderList.push(orderItem)
        vendorsItem.vendorMemberId = orderItem.vendorMemberId
        vendorsItem.vendorRoleId = orderItem.vendorRoleId
        vendorsItem.products.push({
          productId: orderItem.productId,
          skuId: orderItem.id,
          freightType: orderItem.logistics?.carriageType,
          crossBorder: orderItem.isCrossBorder,
        })
      }
      item.storeList = storeList
      item.orderList = tempOrderList
      newOrderList.push(item)
      vendors.push(vendorsItem)
    }
    cacheOrderInfo.orderList = newOrderList

    if (cacheOrderInfo.orderType !== ORDER_TYPE.integral) {
      const { required, payTypes, payNodes, hasContract } = await getPayWayListByMemberId(
        vendors,
        cacheOrderInfo.shopId,
      )
      cacheOrderInfo.requiredPay = required
      cacheOrderInfo.payWayList = payTypes
      cacheOrderInfo.payNodes = payNodes
      cacheOrderInfo.hasContract = hasContract
    }

    if (cacheOrderInfo?.orderType !== ORDER_TYPE.integral) {
      cacheOrderInfo = await fnGetSaleTotalAmount(cacheOrderInfo) // 重置加上促销金额
    }
    if (cacheOrderInfo.requiredPay) {
      fetchBalanceInfo()
    }
    console.log(cacheOrderInfo, 'cacheOrderInfo')
    setOrderInfo(cacheOrderInfo)
    setSpinningState(false)
  }

  const fetchBalanceInfo = () => {
    getPayEAccountAllInPayGetUserBalance().then((res: any) => {
      message.destroy()
      if (res.code === 1000) {
        setBalanceInfo(res.data)
      }
    })
  }

  useEffect(() => {
    if (!userInfo) {
      message.error(translate('web.resource.member.dengluyiguoqiqingchongxindenglu'))
      setTimeout(() => {
        LinkTo(getLoginDomainFn(url))
      }, 1000)
      return
    }
    if (!spamId) {
      message.error(translate('web.resource.mall.dingdanbucunzai'))
      navigate(-1)
    } else {
      initOrderInfo(spamId)
    }
    return () => {
      if (spamId) {
        removeCacheOrderInfo(spamId)
      }
    }
  }, [])

  const getAttrName = (productInfo: ProductItemType) => {
    const attribute = productInfo.attribute
    let attributeName = ''
    if (attribute && attribute.length > 0) {
      attributeName = attribute.map((item: any) => item.customerAttributeValue.value).join('/')
    }
    return attributeName
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
    } else if (newCom.promotions && newCom.promotions.length > 0) {
      return 5
    }
    return 0
  }

  const orderProduct = useMemo(() => {
    if (!orderInfo) return []
    const orderProductRequests: any[] = []
    if (orderInfo.orderList && orderInfo.orderList.length > 0) {
      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          const temp: any = {}

          temp.vendorMemberId = orderItem.vendorMemberId // 供应商会员Id
          temp.vendorRoleId = orderItem.vendorRoleId // 供应商会员角色Id
          temp.vendorMemberName = orderItem.vendorMemberName // 供应商会员名称

          temp.supplyMemberId = orderItem.upperMemberId // 上游供应商会员Id
          temp.supplyRoleId = orderItem.upperMemberRoleId // 上游供应商会员角色Id
          temp.supplyMemberName = orderItem.upperMemberName // 上游供应商会员名称

          temp.productId = orderItem.productId // 商品Id
          temp.cartId = orderItem.purchaseId // 购物车Id
          temp.logo = orderItem.commodityPic // 商品LogoUrl
          temp.skuId = orderItem.id // 商品SkuId
          temp.priceType = orderItem.priceType // 商品价格类型
          temp.spec = getAttrName(orderItem) // 商品规格
          temp.name = orderItem.name // 商品名称
          temp.category = orderItem.category // 商品品类
          temp.brand = orderItem.brand // 商品品牌
          temp.unit = orderItem.unitName // 计价单位
          temp.price = orderItem.price // 商品单价
          temp.refPrice = orderItem.refPrice // 到手价

          // 如果有商品仓位库存数量和仓库地址信息
          if (orderItem.orderProductPositionVOS && Array.isArray(orderItem.orderProductPositionVOS)) {
            temp.orderProductPositionVOS = orderItem.orderProductPositionVOS.map((_item: any) => {
              return {
                ..._item,
                positionName: _item?.warehouseAddress.split(',')[0],
              }
            })
          }

          if (orderItem.isMemberPrice) {
            temp.discount = orderItem.memberDiscount // 会员折扣
          }
          temp.quantity = orderItem.count // 采购数量
          temp.tax = orderItem.taxRate ? true : false // 是否含税
          if (orderItem.taxRate) {
            temp.taxRate = orderItem.taxRate // 税率
          }
          temp.weight = orderItem.logistics?.weight // 商品重量
          temp.logisticsTemplateId = orderItem.logistics?.templateId // 物流模板Id
          temp.deliveryType = orderItem.logistics.deliveryType // 商品配送方式：1-物流，2-自提，3-无需配送
          temp.freightType = orderItem.logistics.carriageType // 运费类型
          if (temp.deliveryType === 4) {
            temp.deliveryType = orderItem.selectDeliveryType
          }

          // 若配送方式为自提
          if (
            (temp.deliveryType === 2 || (temp.deliveryType === 4 && orderItem.selectDeliveryType === 2)) &&
            orderItem.pickUpAddress
          ) {
            temp.addressId = orderItem.pickUpAddress.id // 自提地址Id
            temp.address = `${orderItem.pickUpAddress.provinceName || ''}${orderItem.pickUpAddress.cityName}${
              orderItem.pickUpAddress.districtName
            }${orderItem.pickUpAddress.streetName || ''}${orderItem.pickUpAddress.address}` // 自提地址
            temp.receiver = orderItem.pickUpAddress.shipperName // 接收人
            temp.phone = orderItem.pickUpAddress.phone // 接收人电话
          }
          const promotionType = fnGetPromotionType(orderItem)
          // 商品关联的营销活动相关
          temp.promotionType = promotionType // 商品营销活动类型
          temp.groupNo = orderItem?.groupNo // 套餐编号
          temp.promotions = orderItem?.promotions || [] // 商品关联的营销活动列表
          temp.parentSkuId = orderItem?.parentSkuId // 换购商品SkuId
          temp.crossBorder = orderItem?.isCrossBorder // 是否跨境商品
          // 判断是否有赠品
          const promotionsItem = temp.promotions.find(
            (promotionItem: { promotionType: number }) => promotionItem.promotionType === 6,
          )
          const sortLadders =
            Array.isArray(promotionsItem?.ladders) && promotionsItem?.ladders.length > 0
              ? promotionsItem?.ladders.sort((a: { limitValue: number }, b: { limitValue: number }) =>
                  b.limitValue < a.limitValue ? -1 : 0,
                )
              : []

          // 符合赠送条件的赠品信息
          let giftList: PromotionsCommodityType[] = []
          const allGift: PromotionsCommodityType[] = []
          if (sortLadders.length > 0) {
            for (const ladderItem of sortLadders) {
              for (const listItem of ladderItem.list) {
                if (allGift.every((item) => item.skuId !== listItem.skuId)) {
                  allGift.push(listItem)
                }
              }
            }
          }
          if (orderItem.giveList && orderItem.giveList.length > 0) {
            for (const giveItem of orderItem.giveList) {
              const commonItem = allGift.find((item) => item.skuId === giveItem.id)
              if (commonItem) {
                giftList.push({
                  ...commonItem,
                  num: giveItem.num,
                })
              }
            }
          }

          if (giftList.length > 0) {
            for (const giftItem of giftList) {
              if (giftItem.skuId) {
                const isPickUp =
                  giftItem.logistics?.deliveryType === 2 ||
                  (giftItem.logistics?.deliveryType === 4 &&
                    orderItem.selectDeliveryType === 2 &&
                    orderItem.pickUpAddress)
                orderProductRequests.push({
                  vendorMemberId: giftItem.memberId,
                  vendorRoleId: giftItem.memberRoleId,
                  vendorMemberName: giftItem.memberName,
                  supplyMemberId: giftItem.upperMemberId,
                  supplyRoleId: giftItem.upperMemberRoleId,
                  supplyMemberName: giftItem.upperMemberName,
                  productId: giftItem.id,
                  skuId: giftItem.skuId,
                  priceType: giftItem.priceType,
                  name: giftItem.productName,
                  category: giftItem.category,
                  brand: giftItem.brand,
                  unit: giftItem.unit,
                  logo: giftItem.productImgUrl,
                  spec: giftItem.attribute,
                  price: giftItem.price,
                  refPrice: 0,
                  quantity: giftItem.num,
                  crossBorder: giftItem.isCrossBorder || false,
                  tax: !!giftItem.taxRate, // 是否含税（true-含税，false-不含税）
                  taxRate: giftItem.taxRate, // 税率（百分比的分子部分）
                  deliveryType:
                    giftItem.logistics?.deliveryType === 4
                      ? orderItem.selectDeliveryType
                      : giftItem.logistics?.deliveryType, // 配送
                  freightType: giftItem.logistics?.carriageType,
                  weight: giftItem.logistics?.weight,
                  logisticsTemplateId: giftItem.logistics?.templateId,
                  addressId: isPickUp ? orderItem?.pickUpAddress?.id : '',
                  address: isPickUp
                    ? `${orderItem.pickUpAddress?.provinceName || ''}${orderItem.pickUpAddress?.cityName}${
                        orderItem.pickUpAddress?.districtName
                      }${orderItem.pickUpAddress?.streetName || ''}${orderItem.pickUpAddress?.address}`
                    : '',
                  receiver: isPickUp ? orderItem.pickUpAddress?.shipperName : '',
                  phone: isPickUp ? orderItem.pickUpAddress?.phone : '',
                  promotionType: 0,
                  promotions: [],
                })
              }
            }
          }

          orderProductRequests.push(temp)
        }
      }
    }

    return orderProductRequests
  }, [orderInfo])

  const dispatchSpin = (state: boolean) => {
    setSpinningState(state)
  }

  const dispatchSubmitState = (state: boolean) => {
    setSubmitDisabled(state)
  }

  const dispatchOrderInfo = (newOrderInfo: OrderInfoType) => {
    setOrderInfo(newOrderInfo)
  }

  return {
    orderInfo,
    contractInfo,
    balanceInfo,
    orderModel,
    orderProduct,
    contracErrorInfo,
    spinningState,
    submitDisabled,
    dispatchSpin,
    dispatchOrderInfo,
    dispatchSubmitState,
  }
}

export default useOrderInfo
