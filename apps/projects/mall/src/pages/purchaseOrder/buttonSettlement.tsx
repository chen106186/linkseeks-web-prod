import { Affix, Button, Checkbox, message } from 'antd'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import {
  postOrderCreateCheck,
  postOrderCreatePaymentFind,
  PostOrderCreatePaymentFindResponse,
  postProductShopCommodityCollectSaveCommodityCollectBatch,
} from '@apps/apis'
import { LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'
import { dateFormat, priceFormat } from '@apps/utils'
import useLink from '@/hooks/useLink'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'

const ButtonSettlement: React.FC<any> = (props) => {
  const {
    indeterminate,
    onCheckAllChange,
    checkAll,
    handleBatchDelete,
    orderList,
    mallId,
    computeAllPrice,
    getUnitPrice,
    mallInfo,
    updateOrderInfo,
  } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const { countModifyState } = usePurchaseOrderContext()
  const { linkPrefix } = useLink()
  const translate = getWebIntl()
  /**
   * 批量移入收藏夹
   */
  const handleBatchCollect = () => {
    let idList: number[] = []

    let commodityIdList: any = []
    for (const item of orderList) {
      idList = [...idList, ...item.checkedList]
      if (item.checkedList && item.checkedList.length > 0) {
        item.checkedList.forEach((checkKey: any) => {
          item.orderList.forEach((orderItem: any) => {
            if (Number(orderItem.id) === Number(checkKey)) {
              commodityIdList.push(orderItem.purchaseSkuResp.commodity.id)
            }
          })
        })
      }
    }
    if (commodityIdList.length <= 0) {
      message.info(translate('web.resource.mall.qingxuanzeyaoyirushoucangjiade'))
      return false
    }
    const param: any = {
      commodityIdList,
    }

    const headers = {
      shopId: mallId,
    }

    postProductShopCommodityCollectSaveCommodityCollectBatch(param, {
      headers,
      ctlType: 'none',
    }).then((res: any) => {
      if (res.code === 1000) {
        message.success(translate('web.resource.mall.yirushoucangjiachenggong'))
        handleBatchDelete(false)
      }
    })
  }

  /**
   * 计算已选商品数量
   */
  const handleComputeSelectCount = () => {
    let count = 0
    for (const item of orderList) {
      for (const orderItem of item.orderList) {
        if (item.checkedList.includes(orderItem.id)) {
          if (orderItem?.purchaseSkuResp?.inventoryByProductVOS?.length) {
            count += Number(orderItem.purchaseProductPositions.reduce((p: any, c: any) => p + c.positionQuantity, 0))
          } else {
            count += Number(orderItem.count)
          }
        }
      }
    }
    return count
  }

  /**
   * 计算已选商品价格
   */
  const handleComputeSelectPrice = () => {
    let price = 0
    for (const item of orderList) {
      for (const orderItem of item.orderList) {
        // 小数点的问题
        if (item.checkedList.includes(orderItem.id)) {
          let commodityPrice = 0
          if (orderItem.setMealId) {
            // 如果是套餐商品, 直接取套餐价格
            if (orderItem.groupHandPrice && orderItem.isMain) {
              commodityPrice = orderItem.groupHandPrice * orderItem.count
            } else {
              commodityPrice = computeAllPrice(orderItem.purchaseSkuResp, orderItem.count, 1)
            }
          } else {
            commodityPrice = computeAllPrice(orderItem.purchaseSkuResp, orderItem.count, 1)
          }
          price += commodityPrice
        }
      }
    }
    return priceFormat(price)
  }

  /** 购物车” - 判断是否可以合并下单 */
  const checkCanMerge = (vendors: any) => {
    return new Promise((resolve) => {
      if (vendors) {
        const param: any = {
          shopId: mallId,
          vendors,
        }
        postOrderCreateCheck(param, { ctlType: 'none' })
          .then((res) => {
            if (res.code === 1000) {
              resolve(true)
            } else {
              message.error(res.message)
              resolve(false)
            }
          })
          .catch(() => {
            resolve(false)
          })
      }
    })
  }

  /**
   * 对支付方式进行排序
   * @param info 支付信息
   * @returns  支付信息
   */
  const sortPayWayInfo = (info: PostOrderCreatePaymentFindResponse) => {
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
        shopId: mallId,
        vendors,
      }
      postOrderCreatePaymentFind(param, { ctlType: 'none' }).then((res) => {
        message.destroy()
        if (res.code === 1000) {
          resolve(sortPayWayInfo(res.data))
        } else {
          message.error(res.message)
          reject()
        }
      })
    })
  }

  const fnGetActivityObj = (item: any) => {
    const obj = {
      promotionId: item.activityId,
      name: item.preferentialTag,
      promotionType: item.activityType,
      belongType: item.belongType,
      startTime: dateFormat(new Date(item.startTime), 'YY-MM-DD HH:mm:ss'),
      expireTime: dateFormat(new Date(item.endTime), 'YY-MM-DD HH:mm:ss'),
      activityType: item.activityType,
      ladders: item.ladders || [],
      preferentialTag: item.preferentialTag,
    }
    return obj
  }

  /**
   * 整合当前活动
   */
  const fnInitActivity = (goodsCartResp: any) => {
    if (!goodsCartResp) {
      return []
    }
    const activityArr: any[] = []
    if (goodsCartResp.topActivityDetail) {
      const obj = fnGetActivityObj(goodsCartResp.topActivityDetail)
      activityArr.push(obj)

      goodsCartResp.activityDetails.forEach((item: any) => {
        const obj = fnGetActivityObj(item)
        activityArr.push(obj)
      })
    }

    return activityArr
  }

  /**
   * 结算
   */
  const handleSettlement = async () => {
    if (!countModifyState.current) {
      return
    }
    if (orderList.every((item: any) => item.checkedList.length === 0)) {
      message.info(translate('web.resource.mall.qingxuanzeyaogoumaideshangpin'))
      return
    }

    const selectList = orderList.filter((item: any) => item.checkedList.length > 0)
    const selectCommodityList: any[] = []
    const vendors: any[] = []
    let hasLogistics = false
    let logisticsInfo = {}
    let commonLogistics = {}
    let isInvoice = false
    for (const listItem of selectList) {
      const newlistItem = { ...listItem }
      const vendorsItem: any = {
        vendorMemberId: newlistItem.memberId,
        vendorRoleId: newlistItem.memberRoleId,
        products: [],
      }

      const newOrderList: any[] = []
      let hasGroupObj: any[] = []
      let checkOrderList = newlistItem.orderList.filter((item: any) => {
        if (item.parentSkuId && !item.setMealId) {
          // 当有setMealId的时候 是套餐商品
          hasGroupObj.push(item)
        }
        if (newlistItem.checkedList.includes(item.id)) {
          return item
        }
      })
      const descArr: any[] = []
      checkOrderList.forEach((checkOrderItem: any) => {
        // 查询得到套餐的子商品
        hasGroupObj.forEach((thisGroupItem: any) => {
          if (checkOrderItem.purchaseSkuResp.id === thisGroupItem.parentSkuId) {
            descArr.push(thisGroupItem)
          }
        })
      })
      checkOrderList = [...checkOrderList, ...hasGroupObj]
      for (const selectOrderItem of checkOrderList) {
        // 如果配送方式中存在物流方式，则保存物流方式的配送信息
        commonLogistics = selectOrderItem.purchaseSkuResp.commodity.logistics
        if (
          selectOrderItem.purchaseSkuResp.commodity.logistics.deliveryType === 1 ||
          selectOrderItem.purchaseSkuResp.commodity.logistics.deliveryType === 4
        ) {
          hasLogistics = true
          logisticsInfo = selectOrderItem.purchaseSkuResp.commodity.logistics
        }
        if (selectOrderItem.purchaseSkuResp.commodity.isInvoice) {
          isInvoice = true
        }
        vendorsItem.products.push({
          productId: selectOrderItem.purchaseSkuResp.commodity.id,
          skuId: selectOrderItem.purchaseSkuResp.id,
          freightType: selectOrderItem.purchaseSkuResp.commodity.logistics.carriageType,
          crossBorder: selectOrderItem.purchaseSkuResp.commodity?.isCrossBorder,
        })
        const buyCommodityInfo: any = {
          vendorMemberId: newlistItem.memberId,
          vendorRoleId: newlistItem.memberRoleId,
          vendorMemberName: newlistItem.shopname,
          upperCommodityId: selectOrderItem.purchaseSkuResp.commodity?.upperCommodityId,
          upperMemberId: selectOrderItem.purchaseSkuResp.commodity?.upperMemberId,
          upperMemberName: selectOrderItem.purchaseSkuResp.commodity?.upperMemberName,
          upperMemberRoleId: selectOrderItem.purchaseSkuResp.commodity?.upperMemberRoleId,
          upperMemberRoleName: selectOrderItem.purchaseSkuResp.commodity?.upperMemberRoleName,
          id: selectOrderItem.purchaseSkuResp.id,
          productId: selectOrderItem.purchaseSkuResp.commodity.id,
          purchaseId: selectOrderItem.id,
          count: selectOrderItem.purchaseSkuResp?.inventoryByProductVOS?.length
            ? selectOrderItem.purchaseProductPositions.reduce((p: any, c: any) => p + c.positionQuantity, 0)
            : selectOrderItem.count,
          priceType: selectOrderItem.purchaseSkuResp.commodity.priceType,
          refPrice: selectOrderItem.purchaseSkuResp.refPrice,
          saleTotalAmount: selectOrderItem.purchaseSkuResp.saleTotalAmount,
          unitName: selectOrderItem.purchaseSkuResp.commodity.unitName,
          unitPrice: getUnitPrice(
            selectOrderItem.purchaseSkuResp,
            selectOrderItem.purchaseSkuResp?.inventoryByProductVOS?.length
              ? selectOrderItem.purchaseProductPositions.reduce((p: any, c: any) => p + c.positionQuantity, 0)
              : selectOrderItem.count,
            selectOrderItem.parameter,
            selectOrderItem.setMealId ? false : true,
          ),
          price: getUnitPrice(
            selectOrderItem.purchaseSkuResp,
            selectOrderItem.purchaseSkuResp?.inventoryByProductVOS?.length
              ? selectOrderItem.purchaseProductPositions.reduce((p: any, c: any) => p + c.positionQuantity, 0)
              : selectOrderItem.count,
            selectOrderItem.parameter,
            false,
          ),
          logistics: selectOrderItem.purchaseSkuResp.commodity.logistics,
          name: selectOrderItem.purchaseSkuResp.commodity.name,
          minOrder: selectOrderItem.purchaseSkuResp.commodity.minOrder,
          priceRange: selectOrderItem.purchaseSkuResp.priceRange,
          category: selectOrderItem.purchaseSkuResp.commodity.customerCategoryName,
          brand: selectOrderItem.purchaseSkuResp.commodity.brandName,
          commodityPic: selectOrderItem.purchaseSkuResp.commodity.mainPic,
          attribute: selectOrderItem.purchaseSkuResp.commoditySkuAttributeList,
          stockCount: selectOrderItem.stockCount || 0,
          isMemberPrice: selectOrderItem.purchaseSkuResp.commodity.isMemberPrice ? 1 : 0,
          memberDiscount: selectOrderItem.parameter || 1,
          taxRate: selectOrderItem.purchaseSkuResp.commodity.taxRate,
          promotions: fnInitActivity(selectOrderItem.goodsCartResp),
          commodityAreaList: selectOrderItem.purchaseSkuResp.commodity?.commodityAreaList,
          isCrossBorder: selectOrderItem.purchaseSkuResp.commodity?.isCrossBorder,
          isAllArea: selectOrderItem.purchaseSkuResp.commodity?.isAllArea,
          purchaseCommodityType: selectOrderItem.purchaseCommodityType,
          setMealId: selectOrderItem.setMealId,
          parentSkuId: selectOrderItem.parentSkuId,
          isMain: selectOrderItem.isMain,
          groupNo: selectOrderItem.purchaseCommodityType === 2 ? selectOrderItem.setMealId : undefined,
          orderProductPositionVOS: selectOrderItem?.purchaseProductPositions || [],
          // limitWay: selectOrderItem?.salesAreaTemplate?.limitWay,
          limitWay: selectOrderItem.purchaseSkuResp.commodity.salesAreaTemplate?.limitWay,
        }
        newOrderList.push(buyCommodityInfo)
      }
      newlistItem.orderList = newOrderList
      vendors.push(vendorsItem)
      selectCommodityList.push(newlistItem)
    }
    setConfirmLoading(true)

    const buyOrderInfo: any = {
      purchaseOrder: true, // 是否购物车下单
      productType: 1,
      logistics: hasLogistics ? logisticsInfo : commonLogistics,
      shopId: mallInfo.id,
      isInvoice,
      orderList: selectCommodityList,
    }
    try {
      const checkRes = await checkCanMerge(vendors)
      if (!checkRes) {
        setConfirmLoading(false)
        return
      }
      const { required, payTypes, hasContract, contractId, payNodes } = await getPayWayListByMemberId(vendors)
      buyOrderInfo.requiredPay = required
      buyOrderInfo.payWayList = payTypes
      ;(buyOrderInfo.supplyMembersName = selectList[0]?.memberName),
        (buyOrderInfo.supplyMembersId = selectList[0]?.memberId),
        (buyOrderInfo.supplyMembersRoleId = selectList[0]?.memberRoleId),
        (buyOrderInfo.hasContract = hasContract)
      buyOrderInfo.contractId = contractId
      buyOrderInfo.payNodes = payNodes
    } catch (error) {
      setConfirmLoading(false)
      return
    }
    const sessionKey = `${selectCommodityList[0].id}${new Date().getTime()}`
    updateOrderInfo(sessionKey, buyOrderInfo).then(() => {
      LinkTo(linkPrefix(`/order?spam_id=${sessionKey}&scence=purchase`))
      setConfirmLoading(false)
    })
  }

  return (
    <div>
      <Affix offsetBottom={0}>
        <div className={styles.settlement_box}>
          <div className={cx(styles.settlement_box_checkedbox)}>
            <Checkbox
              className="common_checkbox"
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              {translate('web.common.selectAll')}
            </Checkbox>
            <div className={styles.settlement_box_checkedbox_delbtn} onClick={() => handleBatchDelete()}>
              {translate('web.common.delete')}
            </div>
            <div className={styles.settlement_box_checkedbox_delbtn} onClick={() => handleBatchCollect()}>
              {translate('web.resource.mall.yiruwodeshoucang')}
            </div>
          </div>
          <div className={styles.settlement_box_item}>
            <div className={styles.settlement_box_item_price}>
              <span>{translate('web.resource.mall.yixuanshangpin')}：</span>
              <b>{handleComputeSelectCount()}</b>
              <span>{translate('web.common.jian')}</span>
            </div>
            <div className={styles.settlement_box_item_price}>
              <span>{translate('web.resource.mall.shangpinjinezongji')}：</span>
              <b className={styles.settlement_box_item_price_total}>
                {translate('web.common.currencySymbol')}
                {handleComputeSelectPrice()}
              </b>
            </div>
            <Button
              disabled={handleComputeSelectCount() <= 0}
              loading={confirmLoading}
              className={styles.settlement_box_item_btn}
              onClick={() => handleSettlement()}
            >
              {translate('web.resource.mall.jiesuan')}
            </Button>
          </div>
        </div>
      </Affix>
    </div>
  )
}

export default ButtonSettlement
