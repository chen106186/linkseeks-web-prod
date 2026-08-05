import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import { getEnhanceSupplierToBeAddDetails, GetEnhanceSupplierToBeAddDetailsResponse } from '@apps/apis'
import { priceFormat } from '@/utils/numberFomat'
import moment, { Moment } from 'moment'
import React, { useMemo } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { SubmitDataType } from '../../types'

/** 修改生产通知单时使用 */

type EditInititalValueType = Omit<SubmitDataType, 'deliveryDate' | 'source1'> & {
  deliveryDate: Moment
  id: number
  source1: 1 | 0 | number | {}
}

type OtherTypes = {
  deliveryDesc: string
  payDesc: string
  taxDesc: string
  materialDesc: string
  packingDesc: string
  otherDesc: string
}

const intl = getIntl()

const useFormatData = () => {
  const { id, lastTypeParams } = usePageStatus()
  const isEdit = useMemo(() => lastTypeParams === '/edit', [lastTypeParams])
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<GetEnhanceSupplierToBeAddDetailsResponse, { id: string }>(
    getEnhanceSupplierToBeAddDetails,
    params,
  )

  const cacheInitialValue = useMemo<EditInititalValueType>(() => {
    if (initialValue === null) {
      return { source: 1, source1: 1 } as EditInititalValueType
    }
    const {
      summary,
      deliveryType,
      deliveryDate,
      processMemberId,
      processName,
      processRoleId,
      receiveAddress,
      receiveUserName,
      receiveUserTel,
      receiverAddressId,
      source,
      otherAsk,
      details,
    } = initialValue
    const isOrder = source === 1
    const explainKeys = ['deliveryDesc', 'payDesc', 'taxDesc', 'materialDesc', 'packingDesc', 'otherDesc']
    const descValue: OtherTypes = {} as OtherTypes
    ;(otherAsk as unknown as any).explain?.forEach((item, index) => {
      descValue[explainKeys[index]] = item.value
    })
    const productList = isOrder
      ? []
      : details.map((_item) => {
          return {
            /** @fix 这里不应该去sku 值 */
            commodityId: _item.productId,
            brand: _item.brand,
            category: _item.category,
            skuid: _item.productId,
            productProps: (_item.property as any).specs,
            processNum: _item.processNum,
            processUnitPrice: _item.processPrice,
            processTotalPrice: priceFormat(_item.processTotalPrice),
            taxRate: _item.taxRate,
            unitName: _item.unit,
            name: _item.productName,
            isHasTax: _item.isHasTax,
            isHasTaxAndTaxRate: `${
              _item.isHasTax ? intl.formatMessage({ id: 'handling.shi' }) : intl.formatMessage({ id: 'handling.fou' })
            }/${_item.taxRate}%`,
            enclosure: (_item.property as any).annex.map((_row) => {
              return {
                name: _row.name,
                // value: _row.value,
                url: _row.value,
              }
            }),
          }
        })
    const orderList =
      (isOrder &&
        details?.map((_item) => {
          return {
            /** @fix 这里不应该去sku 值 */
            commodityId: _item.productId,
            brand: _item.brand,
            category: _item.category,
            skuid: _item.productId,
            productProps: (_item.property as any).specs,
            processNum: _item.processNum,
            processUnitPrice: _item.processPrice,
            processTotalPrice: priceFormat(_item.processTotalPrice),
            taxRate: _item.taxRate,
            unitName: _item.unit,
            name: _item.productName,
            isHasTax: _item.isHasTax,
            isHasTaxAndTaxRate: `${
              _item.isHasTax ? intl.formatMessage({ id: 'handling.shi' }) : intl.formatMessage({ id: 'handling.fou' })
            }/${_item.taxRate}%`,
            enclosure: (_item.property as any).annex.map((_row) => {
              return {
                name: _row.name,
                // value: _row.value,
                url: _row.value,
              }
            }),
            surplusProcessNum: _item.surplusProcessNum,
            surplusAndProcessNum: `${_item.surplusProcessNum} / ${_item.processNum}`,
            orderNo: _item.orderNo,
            orderId: _item.orderId,
            id: +_item.orderDetailId,
            purchaseCount: _item.purchaseCount,
            purchaseCountAndUnit: `${_item.purchaseCount}/${_item.unit}`,
          }
        })) ||
      []
    return {
      id: initialValue.id,
      summary,
      deliveryType,
      deliveryDate: moment(deliveryDate),
      processMemberId,
      processName,
      processRoleId,
      receiveAddress,
      receiveUserName,
      receiveUserTel,
      receiverAddressId,
      receivefullAddress: receiverAddressId,
      source,
      source1: source,
      productList,
      orderList,
      ...descValue,
      enclosure: (otherAsk as unknown as any).annex.map((_item) => {
        return {
          name: _item.name,
          url: _item.value,
        }
      }),
    }
  }, [initialValue])

  return { cacheInitialValue, isEdit }
}

export default useFormatData
