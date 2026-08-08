/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-06 09:54:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:37:58
 * @Description: 退货地址信息
 */
import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import { createAsyncFormActions, FormEffectHooks } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'

const modalFormActions = createAsyncFormActions()
const { onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

export interface Values {
  deliveryType: number
  id: number
  isDefault: number
  receiveAddress: string | undefined
  receiveUserName: string | undefined
  receiveUserTel: string | undefined
}

interface AddressData {
  /**
   * id
   */
  id?: number
  /**
   * 配送方式
   */
  deliveryType?: number
  /**
   * 收件人名字
   */
  name: string
  /**
   * 收件人电话号码
   */
  phone: string
  /**
   * 收件地址
   */
  fullAddress: string
}

interface AddressProps {
  value: AddressData
}

const Address: React.FC<AddressProps> = ({ value }) => (
  <div>
    <p>
      {value.name || ''} / {value.phone || ''}
    </p>
    <p>{value.fullAddress || ''}</p>
  </div>
)

const DeliveryAddress: React.FC<AddressProps> = ({ value }) => (
  <div>
    <p>
      {value.name || ''} / {value.phone || ''}
    </p>
    <p>{value.fullAddress || ''}</p>
  </div>
)

interface ReturnAddressInfo extends MellowCardProps {
  /**
   * 是否可编辑的
   */
  isEdit?: boolean

  /**
   * 退货收货地址
   */
  deliveryAddress: AddressData

  /**
   * 退货发货地址
   */
  shippingAddress: AddressData

  /**
   * 表单提交事件
   */
  onFormSubmit: (values: Values) => void
}

const ReturnAddressInfo: React.FC<ReturnAddressInfo> = ({
  isEdit = false,
  deliveryAddress = {},
  shippingAddress = {},
  onFormSubmit,
  ...rest
}) => {
  const intl = useIntl()

  useEffect(() => {
    const { setFieldState } = modalFormActions
    if (isEdit) {
      setFieldState('deliveryAddress', (state) => {
        state.visible = true
      })
      setFieldState('deliveryAddressShow', (state) => {
        state.visible = false
      })
    } else {
      setFieldState('deliveryAddress', (state) => {
        state.visible = false
      })
      setFieldState('deliveryAddressShow', (state) => {
        state.visible = true
      })
    }
  }, [isEdit])

  const handleSubmit = (values) => {}

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'afterService.components.ReturnAddressInfo.title',
        defaultMessage: '退货收货地址',
      })}
      fullHeight
      {...rest}
    >
      <NiceForm
        initialValues={{
          deliveryType: shippingAddress.deliveryType,
          deliveryAddress: deliveryAddress.id,
          shippingAddress: shippingAddress,
          pickupAddress: shippingAddress,
          deliveryAddressShow: deliveryAddress,
        }}
        previewPlaceholder=" "
        effects={($, { getFieldValue }) => {
          const linkage = useLinkageUtils()

          // 联动配送方式
          onFieldValueChange$('deliveryType').subscribe((fieldState) => {
            const { value } = fieldState

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

          onFieldValueChange$('deliveryAddress').subscribe((fieldState) => {
            const { value } = fieldState
            const deliveryTypeValue = getFieldValue('deliveryType')

            if (onFormSubmit) {
              onFormSubmit({
                deliveryType: deliveryTypeValue,
                id: value ? value.id : undefined,
                isDefault: value ? value.isDefault : undefined,
                receiveAddress: value ? value.fullAddress : undefined,
                receiveUserName: value ? value.name : undefined,
                receiveUserTel: value ? value.phone : undefined,
              })
            }
          })
        }}
        components={{
          Address,
          DeliveryAddress,
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

export default ReturnAddressInfo
