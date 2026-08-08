/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-20 15:14:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:47:08
 * @Description: 新增换货发货单
 */
import React, { useState } from 'react'
import { FormEffectHooks } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import moment from 'moment'
import { DOC_TYPE_EXCHANGE_INVOICE } from '@/constants/commodity'
import BillsFormPage, { RelatedInfoDataType, BillSubmitValuesType } from '@/pages/afterAbility/components/BillsFormPage'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getAftersalesReplaceGoodsGetDetailBySupplier,
  postAftersalesReplaceGoodsAddReplaceDeliveryGoods,
} from '@apps/apis'

const { onFormInputChange$ } = FormEffectHooks

const ExchangeAddDeliverBill = () => {
  const { applyId } = usePageStatus()

  const [unsaved, setUnsaved] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const intl = useIntl()
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const fetchRelatedInfo = (): Promise<RelatedInfoDataType> => {
    return new Promise((resolve, reject) => {
      getAftersalesReplaceGoodsGetDetailBySupplier({
        replaceId: applyId,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve({
              relatedNo: res.data.applyNo,
              memberName: res.data.supplierName,
              address: `${res.data.returnGoodsAddress?.receiveUserName || ''} / ${
                res.data.returnGoodsAddress?.receiveUserTel || ''
              } ${res.data.returnGoodsAddress?.receiveAddress || ''}`,
              logisticsType: res.data.returnGoodsAddress?.deliveryType,
              billDetails: res.data.goodsDetailList.map((item) => ({
                orderNo: item.orderNo,
                productId: item.productId,
                productName: item.productName,
                category: item.category,
                brand: item.brand,
                unit: item.unit,
                price: item.purchasePrice,
                relatedCount: item.replaceCount,
                count: item.receiveCount,
                billDetailId: item.detailId,
              })),
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

  const handleSubmit = (values: BillSubmitValuesType) => {
    setSubmitLoading(true)
    postAftersalesReplaceGoodsAddReplaceDeliveryGoods({
      replaceId: applyId,
      deliveryTime: values.createTime ? moment(values.createTime).valueOf() : 0,
      orderAbstract: values.digest,
      remark: values.remark,
      inventoryName: values.inventoryName,
      inventoryRole: values.inventoryRole,
      detailList: values.billDetails.map((item) => ({
        orderNo: item.orderNo,
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        count: item.count,
        replaceDetailId: item.billDetailId,
      })),
    }).then((res) => {
      if (res.code === 1000) {
        setUnsaved(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      } else {
        setSubmitLoading(false)
      }
    })
  }

  return (
    <>
      <BillsFormPage
        relatedType={2}
        billType={DOC_TYPE_EXCHANGE_INVOICE}
        fetchRelatedInfo={fetchRelatedInfo}
        submitLoading={submitLoading}
        onSubmit={handleSubmit}
        customEffects={() => {
          onFormInputChange$().subscribe(() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          })
        }}
      />
    </>
  )
}

export default ExchangeAddDeliverBill
