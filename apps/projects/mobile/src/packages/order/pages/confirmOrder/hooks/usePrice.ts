import { useState, useEffect } from 'react'
import useStores from '@/store/useStores'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { fnGetSkuId, fnKeepTwo } from '../../../commonlyFn'

type OptionsType = {
  /**
   * 团购活动id
   */
  cbgActivityId: number
  /**
   * 团购活动配送方式
   */
  cbgDeliveryType: number
}

/**
 * 根据shopMessageStore返回提交订单页所需要数据
 */
function usePrice(options: OptionsType) {
  const { cbgActivityId, cbgDeliveryType } = options
  const {
    purchaseOrderStore: { shopMessageStore },
  } = useStores()

  const [newPrice, setNewPrice] = useState('0.00')
  const [estimatePrice, setEstimatePrice] = useState('0.00')
  const [couponPrice, setCouponPrice] = useState('0.00')
  const [logisticsIds, setLogisticsIds] = useState<any[]>([])
  const [skuIdListObj, setSkuIdListObj] = useState<any[]>([])

  useEffect(() => {
    let _newPrice = 0
    let _estimatePrice = 0
    let _couponPrice = 0
    const _logisticsIds: any[] = []
    const _skuIdListObj: any[] = []
    Object.keys(shopMessageStore).forEach((key: string) => {
      // 组装skuid数组初始化对象
      const obj: any = {
        memberId: '',
        roleId: '',
        skuIdList: [],
      }
      shopMessageStore[key].forEach((item: any) => {
        // 计算商品价格 start
        if (`${item.isMain}` !== 'false') {
          // 子商品不加到总价格
          // 没有优惠卷拿原价
          _estimatePrice += item.count * (item?.estimatePrice || item?.newPrice)
          _newPrice += item.count * item.newPrice
        } else if (`${item.isMain}` === 'false' && item.purchaseCommodityType === 4) {
          // 换购的子商品需要加上
          // 没有优惠卷拿原价
          _estimatePrice += item.count * (item?.estimatePrice || item?.newPrice)
          _newPrice += item.count * item.newPrice
        }
        // 计算商品价格 end
        // 组装物流id数组 start
        const { logistics } = item
        let checkLogistics: boolean
        if (cbgActivityId > 0) {
          checkLogistics = [1, 3].includes(cbgDeliveryType) && logistics.useTemplate
        } else {
          checkLogistics =
            [DELIVERY_TYPE_ENUM.LOGISTICS, DELIVERY_TYPE_ENUM.LOGISTICS_AND_SELF].includes(logistics.deliveryType) &&
            logistics.carriageType === 2 &&
            logistics.useTemplate
        }
        if (checkLogistics) {
          const _logisticsIdsObj = {
            memberId: item.memberId,
            roleId: item.memberRoleId,
            refPrice: item.estimatePrice,
            templateId: logistics?.templateId,
            weight: logistics?.weight,
            count: item.count,
          }
          _logisticsIds.push(_logisticsIdsObj)
        }
        // 组装物流id数组 end

        // 组装skuid数组 start
        if (!obj.memberId) {
          obj.memberId = item.memberId
          obj.roleId = item.memberRoleId
        }
        obj.skuIdList.push(fnGetSkuId(item.skuId))
        // 组装skuid数组 end

        // 计算优惠券价格 start
        let canUserCoupon = true
        if (item.topActivityDetail?.activityId && item.topActivityDetail?.canUseCoupon !== 1) {
          canUserCoupon = false
        }
        item.activityDetails?.forEach((second: any) => {
          if (second.canUseCoupon !== 1) {
            canUserCoupon = false
          }
        })
        if (canUserCoupon) {
          _couponPrice += item.count * (item.estimatePrice || item.newPrice)
        }
        // 计算优惠券价格 end
      })
      // 组装skuid数组
      if (obj.memberId) {
        _skuIdListObj.push(obj)
      }
    })
    setNewPrice(fnKeepTwo(_newPrice))
    setEstimatePrice(fnKeepTwo(_estimatePrice))
    setCouponPrice(fnKeepTwo(_couponPrice))
    setLogisticsIds(_logisticsIds)
    setSkuIdListObj(_skuIdListObj)
  }, [shopMessageStore])

  return {
    /**
     * 商品价格
     */
    newPrice,
    /**
     * 商品到手价
     */
    estimatePrice,
    /**
     * 优惠券价格
     */
    couponPrice,
    /**
     * 物流id数组
     */
    logisticsIds,
    /**
     * skuId数组
     */
    skuIdListObj,
  }
}

export default usePrice
