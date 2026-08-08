/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-06 09:54:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-14 18:09:45
 * @Description: 退货地址信息
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'
import { getLogisticsSelectListReceiverAddress } from '@apps/apis'

const modalFormActions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInit$ } = FormEffectHooks

export interface Values {
  deliveryType: number
  id: number
  isDefault: number
  receiveAddress: string | undefined
  receiveUserName: string | undefined
  receiveUserTel: string | undefined
}

interface ReturnAddressInfo {
  // 是否是编辑的
  isEdit?: boolean

  // 退货收货地址
  deliveryAddress: {
    // id
    id?: number
    // 配送方式
    deliveryType?: number
    // 收件人姓名
    name: string
    // phone
    phone: string
    // 完整地址
    fullAddress: string
  }

  // 退货发货地址
  shippingAddress: {
    // id
    id?: number
    // 配送方式
    deliveryType?: number
    // 收件人姓名
    name: string
    // phone
    phone: string
    // 完整地址
    fullAddress: string
  }

  // onSubmit
  onSubmit?: (values: Values) => void
}

const ReturnAddressInfo: React.FC<ReturnAddressInfo> = ({
  isEdit = false,
  deliveryAddress = {},
  shippingAddress = {},
  onSubmit,
}) => {
  const handleSubmit = (values) => {}

  // 获取收货地址
  const fetchDeliveryAddress = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      getLogisticsSelectListReceiverAddress()
        .then((res) => {
          if (res.code === 1000) {
            const options = res.data
              ? res.data.map((item) => ({
                  label: `${item.fullAddress}/${item.receiverName}/${item.phone}`,
                  value: item.id,
                  ...item,
                }))
              : []
            resolve(options)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const Address = (
    <div>
      <p>
        {shippingAddress.name || ''} / {shippingAddress.phone || ''}
      </p>
      <p>{shippingAddress.fullAddress || ''}</p>
    </div>
  )

  const DeliveryAddress = (
    <div>
      <p>
        {deliveryAddress.name || ''} / {deliveryAddress.phone || ''}
      </p>
      <p>{deliveryAddress.fullAddress || ''}</p>
    </div>
  )

  return (
    <MellowCard title="退货收货地址" fullHeight>
      <NiceForm
        initialValues={{
          deliveryType: shippingAddress.deliveryType,
          deliveryAddress: deliveryAddress.id,
        }}
        previewPlaceholder=" "
        effects={($, { setFieldState, getFieldValue }) => {
          useAsyncSelect('deliveryAddress', fetchDeliveryAddress, ['label', 'value'])

          const linkage = useLinkageUtils()

          // 联动配送方式
          onFieldValueChange$('deliveryType').subscribe((fieldState) => {
            const { name, value } = fieldState

            if (isEdit) {
              linkage.show('deliveryAddress')
              linkage.hide('deliveryAddressShow')
            } else {
              linkage.hide('deliveryAddress')
              linkage.show('deliveryAddressShow')
            }

            switch (value) {
              // 物流
              case 1: {
                linkage.hide('pickupAddress')
                linkage.show('shippingAddress')
                break
              }
              // 自提
              case 2: {
                linkage.hide('shippingAddress')
                linkage.show('pickupAddress')
                break
              }
              // 无需物流
              case 3: {
                linkage.hide('*(shippingAddress,pickupAddress,deliveryAddress,deliveryAddressShow)')
                break
              }
              default:
                break
            }
          })

          onFieldInputChange$('deliveryAddress').subscribe((fieldState) => {
            const { name, value, originAsyncData } = fieldState
            const deliveryTypeValue = getFieldValue('deliveryType')
            const fullData = originAsyncData.find((item) => item.id === value)

            if (onSubmit) {
              onSubmit({
                deliveryType: deliveryTypeValue,
                id: fullData ? fullData.id : undefined,
                isDefault: fullData ? fullData.isDefault : undefined,
                receiveAddress: fullData ? fullData.fullAddress : undefined,
                receiveUserName: fullData ? fullData.receiverName : undefined,
                receiveUserTel: fullData ? fullData.phone : undefined,
              })
            }
          })
        }}
        expressionScope={{
          Address,
          DeliveryAddress,
        }}
        editable={isEdit}
        actions={modalFormActions}
        schema={schema}
        onSubmit={handleSubmit}
      />
    </MellowCard>
  )
}

export default ReturnAddressInfo
