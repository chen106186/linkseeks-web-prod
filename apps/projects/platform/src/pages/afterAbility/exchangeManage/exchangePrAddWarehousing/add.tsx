/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-20 14:20:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:48:59
 * @Description: 新增换货退货入库单
 */
import React, { useState } from 'react'
import { FormEffectHooks } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import moment from 'moment'
import { DOC_TYPE_EXCHANGE_RETURN_RECEIPT } from '@/constants/commodity'
import BillsFormPage, { RelatedInfoDataType, BillSubmitValuesType } from '@/pages/afterAbility/components/BillsFormPage'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getAftersalesReplaceGoodsGetReturnGoodsStorageDetail,
  postAftersalesReplaceGoodsAddReturnGoodsStorage,
} from '@apps/apis'

const { onFormInputChange$ } = FormEffectHooks

const ExchangeAddWarehouseBill = () => {
  const { applyId, deliveryId } = usePageStatus()

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
      getAftersalesReplaceGoodsGetReturnGoodsStorageDetail({
        returnDeliveryId: deliveryId,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve({
              relatedNo: res.data.applyNo,
              memberName: res.data.memberName,
              address: `${res.data.userName || ''} / ${res.data.tel || ''} ${res.data.address || ''}`,
              logisticsType: res.data.deliveryType,
              billDetails: res.data.goodsDetailDeliveryList.map((item) => ({
                orderNo: item.orderNo,
                productId: item.productId,
                productName: item.productName,
                category: item.category,
                brand: item.brand,
                unit: item.unit,
                price: item.purchasePrice,
                relatedCount: item.replaceCount,
                billCount: item.replaceDeliveryCount,
                count: item.replaceDeliveryCount,
                billDetailId: item.replaceDetailId,
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
    postAftersalesReplaceGoodsAddReturnGoodsStorage({
      replaceId: applyId,
      storageTime: values.createTime ? moment(values.createTime).valueOf() : 0,
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
        billType={DOC_TYPE_EXCHANGE_RETURN_RECEIPT}
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

export default ExchangeAddWarehouseBill
