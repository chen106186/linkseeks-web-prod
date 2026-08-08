/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-06 09:54:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-02-02 10:26:13
 * @Description: 换货收货地址
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'
import { getLogisticsSelectListShipperAddress } from '@apps/apis'

const modalFormActions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInit$ } = FormEffectHooks

export interface Values {
  deliveryType: number
  id: number
  isDefault: number
  sendAddress: string | undefined
  sendUserName: string | undefined
  sendUserTel: string | undefined
}

interface ExchangeAddressInfo {
  // 是否是编辑的
  isEdit?: boolean

  // 换货收货地址
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

  // 换货发货地址
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

const ExchangeAddressInfo: React.FC<ExchangeAddressInfo> = ({
  isEdit = false,
  deliveryAddress = {},
  shippingAddress = {},
  onSubmit,
}) => {
  const handleSubmit = (values) => {}

  // 获取发货地址
  const fetchShipperAddress = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      getLogisticsSelectListShipperAddress()
        .then((res) => {
          if (res.code === 1000) {
            const options = res.data
              ? res.data.map((item) => ({
                  label: `${item.fullAddress}/${item.shipperName}/${item.phone}`,
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
        {deliveryAddress.name || ''} / {deliveryAddress.phone || ''}
      </p>
      <p>{deliveryAddress.fullAddress || ''}</p>
    </div>
  )

  const ShippingAddress = (
    <div>
      <p>
        {shippingAddress.name || ''} / {shippingAddress.phone || ''}
      </p>
      <p>{shippingAddress.fullAddress || ''}</p>
    </div>
  )

  return (
    <MellowCard title="换货收货地址" fullHeight>
      <NiceForm
        initialValues={{
          deliveryType: shippingAddress.deliveryType,
          shippingAddress: shippingAddress.id,
          pickupAddress: shippingAddress.id,
        }}
        previewPlaceholder=" "
        expressionScope={{
          Address,
          ShippingAddress,
        }}
        effects={($, { setFieldState, getFieldValue }) => {
          useAsyncSelect('*(shippingAddress,pickupAddress)', fetchShipperAddress, ['label', 'value'])

          const linkage = useLinkageUtils()

          // 联动配送方式
          onFieldValueChange$('deliveryType').subscribe((fieldState) => {
            const { value } = fieldState

            switch (value) {
              // 物流
              case 1: {
                if (isEdit) {
                  linkage.show('shippingAddress')
                  linkage.hide('pickupAddress')
                } else {
                  linkage.hide('*(shippingAddress,pickupAddress)')
                  linkage.show('shippingAddressShow')
                }
                break
              }
              // 自提
              case 2: {
                if (isEdit) {
                  linkage.hide('shippingAddress')
                  linkage.show('pickupAddress')
                } else {
                  setFieldState('shippingAddressShow', (fieldState) => {
                    fieldState.title = '换货自提地址'
                  })
                  linkage.hide('*(shippingAddress,pickupAddress)')
                  linkage.show('shippingAddressShow')
                }
                break
              }
              // 无需物流
              case 3: {
                linkage.hide('*(shippingAddress,pickupAddress)')
                break
              }
              default:
                break
            }

            if (onSubmit) {
              onSubmit({
                deliveryType: value,
                id: undefined,
                isDefault: undefined,
                sendAddress: undefined,
                sendUserName: undefined,
                sendUserTel: undefined,
              })
            }
          })

          onFieldInputChange$('deliveryType').subscribe((fieldState) => {
            const { name, value } = fieldState
            if (value) {
              linkage.value('*(shippingAddress,pickupAddress)', undefined)
            }
          })

          onFieldInputChange$('*(shippingAddress,pickupAddress)').subscribe((fieldState) => {
            const { value, originAsyncData = [] } = fieldState
            const deliveryTypeValue = getFieldValue('deliveryType')
            const fullData = originAsyncData.find((item) => item.id === value)

            if (onSubmit) {
              onSubmit({
                deliveryType: deliveryTypeValue,
                id: fullData ? fullData.id : undefined,
                isDefault: fullData ? fullData.isDefault : undefined,
                sendAddress: fullData ? fullData.fullAddress : undefined,
                sendUserName: fullData ? fullData.shipperName : undefined,
                sendUserTel: fullData ? fullData.phone : undefined,
              })
            }
          })
        }}
        editable={isEdit}
        actions={modalFormActions}
        schema={schema}
        onSubmit={handleSubmit}
        colon
      />
    </MellowCard>
  )
}

export default ExchangeAddressInfo
