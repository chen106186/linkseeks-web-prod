import { Affix, Button, Checkbox, message } from 'antd'
import React, { useState } from 'react'
import cx from 'classnames'
import { history } from '@linkseeks/router-manager'
import type { PostOrderCreatePaymentFindResponse } from '@apps/apis'
import { postOrderCreateCheck, postOrderCreatePaymentFind, postOrderCacheSet } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import { priceFormat } from '../utils/numFormat'
import { dateFormat } from '@/utils/date'
import styles from './index.less'

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
  } = props
  const intl = useIntl()
  const translate = useWebIntl()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  /**
   * 计算已选商品数量
   */
  const handleComputeSelectCount = () => {
    let count = 0
    for (const item of orderList) {
      for (const orderItem of item.orderList) {
        if (item.checkedList.includes(orderItem.id)) {
          count += Number(orderItem.count)
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

  const checkCanMerge = (vendors: any) => {
    return new Promise((resolve) => {
      if (vendors) {
        const param: any = {
          shopId: mallId,
          vendors,
        }
        postOrderCreateCheck(param)
          .then((res) => {
            if (res.code === 1000) {
              message.destroy()
              resolve(true)
            } else {
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
        buyerMemberId: mallInfo.memberId,
        buyerRoleId: mallInfo.roleId,
        buyerMemberName: mallInfo.memberName,
      }
      postOrderCreatePaymentFind(param).then((res) => {
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
    }
    return obj
  }

  /**
   * 整合当前活动
   */
  const fnInitActivity = (goodsCartResponse: any) => {
    if (!goodsCartResponse) {
      return []
    }
    const activityArr = []
    console.log(goodsCartResponse)
    if (goodsCartResponse.topActivityDetail) {
      const obj = fnGetActivityObj(goodsCartResponse.topActivityDetail)
      activityArr.push(obj)
    }
    goodsCartResponse.activityDetails.forEach((item: any) => {
      const obj = fnGetActivityObj(item)
      activityArr.push(obj)
    })
    return activityArr
  }

  const cacheOrderInfo = (key: string, value: any) => {
    return new Promise((resolve, reject) => {
      postOrderCacheSet({ key, value })
        .then((res) => {
          message.destroy()
          if (res.code === 1000) {
            resolve(true)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  const updateOrderInfo = (orderInfo: any, sessionKey: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const state = await cacheOrderInfo(sessionKey, JSON.stringify(orderInfo))
        resolve(state)
      } catch (error) {
        reject()
      }
    })
  }

  // /**
  //  * 结算
  //  */
  const handleSettlement = async () => {
    // if (orderList.length > 1 && orderList.every(item => item.checkedList.length > 0)) {
    //   message.info("暂不支持多个供应商商品生成订单，请选择相同供应商的商品")
    //   return
    // } else
    if (orderList.every((item: any) => item.checkedList.length === 0)) {
      message.info(intl.formatMessage({ id: 'purchaseOrder.index.selectPurchase' }))
      return
    }

    const selectList = orderList.filter((item: any) => item.checkedList.length > 0)
    const selectCommodityList = []
    const vendors = []
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

      const newOrderList = []
      const hasGroupObj: any[] = []
      let checkOrderList = newlistItem.orderList.filter((item: any) => {
        if (item.parentSkuId && !item.setMealId) {
          // 当有setMealId的时候 是套餐商品
          hasGroupObj.push(item)
        }
        if (newlistItem.checkedList.includes(item.id)) {
          return item
        }
      })
      const descArr = []
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
          count: selectOrderItem.count,
          priceType: selectOrderItem.purchaseSkuResp.commodity.priceType,
          refPrice: selectOrderItem.purchaseSkuResp.refPrice,
          saleTotalAmount: selectOrderItem.purchaseSkuResp.saleTotalAmount,
          unitName: selectOrderItem.purchaseSkuResp.commodity.unitName,
          unitPrice: getUnitPrice(selectOrderItem.purchaseSkuResp, selectOrderItem.count, selectOrderItem.parameter),
          price: getUnitPrice(selectOrderItem.purchaseSkuResp, selectOrderItem.count, selectOrderItem.parameter, false),
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
          promotions: fnInitActivity(selectOrderItem.goodsCartResponse),
          commodityAreaList: selectOrderItem.purchaseSkuResp.commodity?.commodityAreaList,
          isCrossBorder: selectOrderItem.purchaseSkuResp.commodity?.isCrossBorder,
          isAllArea: selectOrderItem.purchaseSkuResp.commodity?.isAllArea,
          purchaseCommodityType: selectOrderItem.purchaseCommodityType,
          setMealId: selectOrderItem.setMealId,
          parentSkuId: selectOrderItem.parentSkuId,
          isMain: selectOrderItem.isMain,
          groupNo: selectOrderItem.setMealId,
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
      shopId: mallInfo.shopId,
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
    console.log(buyOrderInfo)
    const sessionKey = `${selectCommodityList[0].id}${new Date().getTime()}`
    updateOrderInfo(buyOrderInfo, sessionKey).then(() => {
      history.push(`/orderAbility/saleOrder/agentPurchaseOrder/order?spam_id=${sessionKey}&scence=purchase`)
    })
  }

  return (
    <div>
      <Affix offsetBottom={0}>
        <div className={styles.settlement_box}>
          <div className={cx(styles.settlement_box_checkedbox)}>
            <Checkbox
              // className="common-checkbox"
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              {intl.formatMessage({ id: 'purchaseOrder.index.SelectAll' })}
            </Checkbox>
            <div className={styles.settlement_box_checkedbox_delbtn} onClick={() => handleBatchDelete()}>
              {intl.formatMessage({ id: 'order.index.invoice.delete' })}
            </div>
            <div
              className={styles.settlement_box_checkedbox_selectMore}
              onClick={() => history.push('/orderAbility/saleOrder/agentPurchaseOrder/commodity')}
            >
              {intl.formatMessage({ id: 'purchaseOrder.index.selectMoreCommodity' })}
            </div>
          </div>
          <div className={styles.settlement_box_item}>
            <div className={styles.settlement_box_item_price}>
              <span>{intl.formatMessage({ id: 'purchaseOrder.index.SelectedItems' })}：</span>
              <b>{handleComputeSelectCount()}</b>
              <span>{intl.formatMessage({ id: 'purchaseOrder.index.piece' })}</span>
            </div>
            <div className={styles.settlement_box_item_price}>
              <span>{intl.formatMessage({ id: 'order.index.TotalAmount' })}：</span>
              <span>{translate('web.common.currencySymbol')}</span>
              <b className={styles.settlement_box_item_price_total}>{handleComputeSelectPrice()}</b>
            </div>
            <Button
              disabled={handleComputeSelectCount() <= 0}
              loading={confirmLoading}
              className={styles.settlement_box_item_btn}
              onClick={() => handleSettlement()}
            >
              {intl.formatMessage({ id: 'purchaseOrder.index.settlement' })}
            </Button>
          </div>
        </div>
      </Affix>
    </div>
  )
}

export default ButtonSettlement
