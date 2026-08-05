/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-06 09:54:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:32:13
 * @Description: 换货收货地址
 */
import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import { createAsyncFormActions, FormEffectHooks } from '@apps/formily'
import { getLogisticsSelectListShipperAddress } from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'

const modalFormActions = createAsyncFormActions()
const { onFieldInputChange$ } = FormEffectHooks

export interface Values {
  deliveryType: number
  id: number
  isDefault: number
  sendAddress: string | undefined
  sendUserName: string | undefined
  sendUserTel: string | undefined
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

const ShippingAddress: React.FC<AddressProps> = ({ value }) => (
  <div>
    <p>
      {value.name || ''} / {value.phone || ''}
    </p>
    <p>{value.fullAddress || ''}</p>
  </div>
)

interface ExchangeAddressInfo extends MellowCardProps {
  /**
   * 是否是编辑的
   */
  isEdit?: boolean

  /**
   * 换货收货地址
   */
  deliveryAddress: {
    /**
     * id
     */
    id?: number
    /**
     * 配送方式
     */
    deliveryType?: number
    /**
     * 收件人姓名
     */
    name: string
    /**
     * phone
     */
    phone: string
    /**
     * 完整地址
     */
    fullAddress: string
  }

  /**
   * 换货发货地址
   */
  shippingAddress: {
    /**
     * id
     */
    id?: number
    /**
     * 配送方式
     */
    deliveryType?: number
    /**
     * 收件人姓名
     */
    name: string
    /**
     * phone
     */
    phone: string
    /**
     * 完整地址
     */
    fullAddress: string
  }

  /**
   * 提交事件
   */
  onFormSubmit: (values: Values) => void
}

const ExchangeAddressInfo: React.FC<ExchangeAddressInfo> = ({
  isEdit = false,
  deliveryAddress = {},
  shippingAddress = {},
  onFormSubmit,
  ...rest
}) => {
  const intl = useIntl()

  useEffect(() => {
    const { setFieldState } = modalFormActions
    switch (shippingAddress.deliveryType) {
      // 物流
      case 1: {
        if (isEdit) {
          setFieldState('shippingAddress', (state) => {
            state.visible = true
          })
          setFieldState('pickupAddress', (state) => {
            state.visible = false
          })
        } else {
          setFieldState('*(shippingAddress,pickupAddress)', (state) => {
            state.visible = false
          })
          setFieldState('shippingAddressShow', (state) => {
            state.visible = true
          })
        }
        break
      }
      // 自提
      case 2: {
        if (isEdit) {
          setFieldState('shippingAddress', (state) => {
            state.visible = false
          })
          setFieldState('pickupAddress', (state) => {
            state.visible = true
          })
        } else {
          setFieldState('shippingAddressShow', (state) => {
            state.title = intl.formatMessage({
              id: 'afterService.components.ExchangeAddressInfo.pickupAddress',
              defaultMessage: '换货自提地址',
            })
          })
          setFieldState('pickupAddress', (state) => {
            state.visible = true
          })
          setFieldState('*(shippingAddress,pickupAddress)', (state) => {
            state.visible = false
          })
          setFieldState('shippingAddressShow', (state) => {
            state.visible = true
          })
        }
        break
      }
      // 无需物流
      case 3: {
        setFieldState('*(shippingAddress,pickupAddress,shippingAddressShow)', (state) => {
          state.visible = false
        })
        break
      }
      default:
        break
    }
  }, [shippingAddress.deliveryType, isEdit])

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

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'afterService.components.ExchangeAddressInfo.title',
        defaultMessage: '换货收货地址',
      })}
      {...rest}
    >
      <NiceForm
        initialValues={{
          deliveryType: shippingAddress.deliveryType,
          shippingAddress: shippingAddress.id,
          pickupAddress: shippingAddress.id,
          deliveryAddress,
          shippingAddressShow: shippingAddress,
        }}
        previewPlaceholder=" "
        effects={($, { getFieldValue }) => {
          useAsyncSelect('*(shippingAddress,pickupAddress)', fetchShipperAddress, ['label', 'value'])

          const linkage = useLinkageUtils()

          // 联动配送方式
          onFieldInputChange$('deliveryType').subscribe((fieldState) => {
            const { value } = fieldState

            switch (value) {
              // 物流
              case 1: {
                linkage.show('shippingAddress')
                linkage.hide('pickupAddress')
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
                linkage.hide('*(shippingAddress,pickupAddress)')
                break
              }
              default:
                break
            }

            if (onFormSubmit) {
              onFormSubmit({
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

          onFieldInputChange$('*(shippingAddress,pickupAddress)').subscribe(async (fieldState) => {
            const { value, originAsyncData = [] } = fieldState
            const deliveryTypeValue = await getFieldValue('deliveryType')
            const fullData = originAsyncData.find((item) => item.id === value)

            if (onFormSubmit) {
              onFormSubmit({
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
        components={{
          Address,
          ShippingAddress,
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
