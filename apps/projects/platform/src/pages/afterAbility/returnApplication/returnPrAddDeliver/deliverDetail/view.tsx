/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-16 11:47:55
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:57:39
 * @Description: 退货发货单详情
 */
import React from 'react'
import { DOC_TYPE_RETURN_INVOICE } from '@/constants/commodity'
import BillsFormPage, { RelatedInfoDataType } from '@/pages/afterAbility/components/BillsFormPage'
import { usePageStatus } from '@/hooks/usePageStatus'
import { formatTimeString } from '@/utils'
import { getAftersalesReturnGoodsGetReturnDeliveryGoodsDetail } from '@apps/apis'

const ReturnDeliverBillDetail = () => {
  const { id } = usePageStatus()

  const fetchRelatedInfo = (): Promise<RelatedInfoDataType> => {
    return new Promise((resolve, reject) => {
      getAftersalesReturnGoodsGetReturnDeliveryGoodsDetail({
        returnDeliveryId: id,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve({
              relatedNo: res.data.applyNo,
              memberName: res.data.memberName,
              address: `${res.data.userName || ''} / ${res.data.tel || ''} ${res.data.address || ''}`,
              logisticsType: res.data.deliveryType,
              inventoryId: res.data.inventoryName,
              inventoryRole: res.data.inventoryRole,
              digest: res.data.orderAbstract,
              createTime: res.data.orderTime ? formatTimeString(res.data.orderTime) : '',
              billDetails: res.data.goodsDetailDeliveryList.map((item) => ({
                orderNo: item.orderNo,
                productId: item.productId,
                productName: item.productName,
                category: item.category,
                brand: item.brand,
                unit: item.unit,
                price: item.purchasePrice,
                relatedCount: item.returnCount,
                count: item.returnDeliveryCount,
              })),
              remark: res.data.remark,
              orderType: res.data.orderType,
            })
          }
          reject()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return (
    <>
      <BillsFormPage
        relatedType={1}
        billType={DOC_TYPE_RETURN_INVOICE}
        fetchRelatedInfo={fetchRelatedInfo}
        editable={false}
      />
    </>
  )
}

export default ReturnDeliverBillDetail
