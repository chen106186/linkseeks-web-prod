/**
 * @Description: 地址卡片组件
 */
import React, { useImperativeHandle, useReducer } from 'react'
import { Row, Col, message } from 'antd'
import { createFormActions, Form, FormEffectHooks, FormItem, ISchemaFormActions } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { Radio } from '@apps/formily'
import {
  DELIVERY_TYPE_EXPRESS,
  DELIVERY_TYPE_SELF_LIFTING,
  DELIVERY_TYPE_NO_DISTRIBUTION,
  DELIVERY_TYPE_ENUM,
} from '@/constants/afterService'
import MellowCard from '@/components/MellowCard'
import { AddressSelectProps } from '@/components/AddressSelect'
import CustomAddressSelect from '@/components/NiceForm/components/CustomAddressSelect'
import { AsType, AsAddressRole } from '../../utils'
import { reducer, initialState, AsAddressType, AsAddressValue } from './reducer'
import AddressInfo from './components/AddressInfo'
import styles from './index.less'

const formActions = createFormActions()
const { onFieldValueChange$ } = FormEffectHooks

const intlIns = getIntl()

interface AsAddressCardProps {
  /**
   * 售后类型，需要注意的是 换货流程其实是包含退货流程的
   * 售后换货：2 售后退货： 3 售后维修：4
   */
  asType: AsType
  /**
   * 角色
   * 寄件人 'sender' 收件人 'receiver'
   */
  addressRole?: AsAddressRole
  /**
   * 配送方式
   */
  deliveryType: number | undefined
  /**
   * 发货地址
   */
  deliveryAddress: AsAddressType
  /**
   * 收货地址
   */
  shippingAddress: AsAddressType
  /**
   * 是否可编辑的，默认 false
   */
  ediabled?: boolean
}

export type AsAddressSubmitValue = {
  /**
   * 收货地址
   */
  shippingAddress: {
    /**
     * 收货地址id
     */
    receiveId: number
    /**
     * 收货地址
     */
    receiveAddress: string
    /**
     * 收货者名称
     */
    receiveUserName: string
    /**
     * 收货者电话
     */
    receiveUserTel: string
  }
  /**
   * 发货地址
   */
  deliveryAddress: {
    /**
     * 配送方式
     */
    deliveryType: number
    /**
     * 发货地址id
     */
    sendId: number
    /**
     * 发货地址
     */
    sendAddress: string
    /**
     * 发货者名称
     */
    sendUserName: string
    /**
     * 发货者电话
     */
    sendUserTel: string
  }
}

export interface AsAddressRefHandle {
  submit: () => Promise<AsAddressSubmitValue>
}

// 卡片标题
const CARD_TITLE_MAP: { [key in AsType]: string } = {
  2: intlIns.formatMessage({ id: 'afterService.components.ExchangeAddressInfo.title', defaultMessage: '换货收货地址' }),
  3: intlIns.formatMessage({ id: 'afterService.components.ReturnAddressInfo.title', defaultMessage: '退货收货地址' }),
  4: intlIns.formatMessage({ id: 'afterService.components.RepairAddressInfo.title', defaultMessage: '维修地址' }),
}

// 发货信息标题
const DELIVERY_ADDRESS_TITLE_MAP: { [key in AsType]: string } = {
  2: intlIns.formatMessage({
    id: 'afterService.components.ExchangeAddressInfo.deliveryAddress',
    defaultMessage: '换货发货地址',
  }),
  3: intlIns.formatMessage({
    id: 'afterService.components.ReturnAddressInfo.deliveryAddress',
    defaultMessage: '退货发货地址',
  }),
  4: intlIns.formatMessage({ id: 'afterService.components.RepairAddressInfo.title', defaultMessage: '维修地址' }),
}

// 收货信息标题
const SHIPPIND_ADDRESS_TITLE_MAP: { [key in AsType]: string } = {
  2: intlIns.formatMessage({
    id: 'afterService.components.ExchangeAddressInfo.shippingAddress',
    defaultMessage: '换货收货地址',
  }),
  3: intlIns.formatMessage({
    id: 'afterService.components.ReturnAddressInfo.shippingAddress',
    defaultMessage: '退货收货地址',
  }),
  4: '',
}

// 自提信息标题
const SELF_LIFTING_TITLE_MAP: { [key in AsType]: string } = {
  2: intlIns.formatMessage({
    id: 'afterService.components.ExchangeAddressInfo.pickupAddress',
    defaultMessage: '换货自提地址',
  }),
  3: intlIns.formatMessage({
    id: 'afterService.components.ReturnAddressInfo.pickupAddress',
    defaultMessage: '退货自提地址',
  }),
  4: '',
}

const AsAddressCardProps: React.ForwardRefRenderFunction<AsAddressRefHandle, AsAddressCardProps> = (
  props: AsAddressCardProps,
  ref,
) => {
  const { asType, addressRole, deliveryType, deliveryAddress, shippingAddress, ediabled = false } = props

  const [innerValue, innerValueDispatch] = useReducer(reducer, initialState)

  const intl = useIntl()

  const handleShippingAddressChange = (next: AddressSelectProps['value']) => {
    innerValueDispatch({
      type: 'setAsAddress',
      payload: {
        shippingAddress: {
          id: next.id,
          name: next.name,
          phone: next.phone,
          detailed: next.fullAddress,
        },
      },
    })
  }

  const handleDeliveryAddressChange = (next: AddressSelectProps['value']) => {
    innerValueDispatch({
      type: 'setAsAddress',
      payload: {
        deliveryAddress: {
          id: next.id,
          name: next.name,
          phone: next.phone,
          detailed: next.fullAddress,
        },
      },
    })
  }

  const handleDeliveryTypeChange = (next: number) => {
    innerValueDispatch({
      type: 'setAsAddress',
      payload: {
        deliveryType: next,
      },
    })
  }

  const handleSubmit: () => Promise<AsAddressSubmitValue> = () =>
    new Promise(async (resolve, reject) => {
      try {
        await formActions.validate('*')
        resolve({
          shippingAddress: {
            receiveId: innerValue.shippingAddress?.id,
            receiveAddress: innerValue.shippingAddress?.detailed,
            receiveUserName: innerValue.shippingAddress?.name,
            receiveUserTel: innerValue.shippingAddress?.phone,
          },
          deliveryAddress: {
            deliveryType: innerValue.deliveryType,
            sendId: innerValue.deliveryAddress?.id,
            sendAddress: innerValue.deliveryAddress?.detailed,
            sendUserName: innerValue.deliveryAddress?.name,
            sendUserTel: innerValue.deliveryAddress?.phone,
          },
        })
      } catch (error) {
        if (error.errors?.length) {
          message.warning(error.errors[0].messages[0])
          reject(error)
        }
      }
    })

  const renderDeliveryBlock = () => (
    <Col span={12}>
      {ediabled && asType === 2 ? (
        <FormItem
          type="string"
          title={DELIVERY_ADDRESS_TITLE_MAP[asType]}
          name="deliveryAddress"
          component={CustomAddressSelect}
          onChange={handleDeliveryAddressChange}
          rules={[
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'afterService.components.ReturnAddressInfo.shippingAddress.placeholder',
                defaultMessage: '请选择',
              })}${DELIVERY_ADDRESS_TITLE_MAP[asType]}`,
            },
          ]}
          addressType={2}
          isDefaultAddress
        />
      ) : (
        <FormItem
          type="string"
          title={DELIVERY_ADDRESS_TITLE_MAP[asType]}
          name="deliveryAddress"
          valueName="data"
          component={AddressInfo}
        />
      )}
    </Col>
  )

  // 这里不能直接调用 Form 的 submit，因为还没有返回值
  // 所以只能手动 监听onChang，并内部维护表单状态
  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(),
  }))

  return (
    <div className={styles['as-address-card']}>
      <MellowCard
        title={CARD_TITLE_MAP[asType]}
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        <Form
          value={{
            deliveryType: deliveryType,
            deliveryAddress,
            shippingAddress,
          }}
          actions={formActions}
          effects={($, actions: ISchemaFormActions) => {
            const { setFieldState } = actions

            onFieldValueChange$('deliveryType').subscribe((fieldState) => {
              const { value } = fieldState
              switch (value) {
                // 物流
                case DELIVERY_TYPE_EXPRESS: {
                  setFieldState('*(deliveryAddress,shippingAddress)', (state) => {
                    state.visible = true
                  })
                  setFieldState('deliveryAddress', (state) => {
                    state.props.title = DELIVERY_ADDRESS_TITLE_MAP[asType]
                  })
                  break
                }
                // 自提
                case DELIVERY_TYPE_SELF_LIFTING: {
                  setFieldState('*(deliveryAddress,shippingAddress)', (state) => {
                    state.visible = true
                  })
                  setFieldState('deliveryAddress', (state) => {
                    state.props.title = SELF_LIFTING_TITLE_MAP[asType]
                  })
                  break
                }
                // 无需物流
                case DELIVERY_TYPE_NO_DISTRIBUTION: {
                  setFieldState('*(deliveryAddress,shippingAddress)', (state) => {
                    state.visible = false
                  })
                  break
                }
                default:
                  break
              }
            })
          }}
          labelAlign="left"
          labelCol={6}
          wrapperCol={18}
          previewPlaceholder=" "
          editable={ediabled}
          colon={false}
        >
          <Row gutter={128}>
            {asType !== 4 && (
              <Col span={12}>
                <FormItem
                  type="string"
                  title={intl.formatMessage({
                    id: 'afterService.components.ReturnAddressInfo.deliveryType',
                    defaultMessage: '配送方式',
                  })}
                  name="deliveryType"
                  dataSource={DELIVERY_TYPE_ENUM}
                  component={Radio.Group}
                  optionType="button"
                  onChange={handleDeliveryTypeChange}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'afterService.components.ExchangeAddressInfo.deliveryType.required',
                        defaultMessage: '请选择配送方式',
                      }),
                    },
                  ]}
                  editable={ediabled && asType === 2}
                />
              </Col>
            )}
            {ediabled ? renderDeliveryBlock() : <Col span={12} />}
            {asType !== 4 && (
              <Col span={12}>
                {ediabled && asType === 3 ? (
                  <FormItem
                    type="string"
                    title={SHIPPIND_ADDRESS_TITLE_MAP[asType]}
                    name="shippingAddress"
                    component={CustomAddressSelect}
                    onChange={handleShippingAddressChange}
                    rules={[
                      {
                        required: true,
                        message: `${intl.formatMessage({
                          id: 'afterService.components.ReturnAddressInfo.shippingAddress.placeholder',
                          defaultMessage: '请选择',
                        })}${SHIPPIND_ADDRESS_TITLE_MAP[asType]}`,
                      },
                    ]}
                    addressType={1}
                    isDefaultAddress
                  />
                ) : (
                  <FormItem
                    type="string"
                    title={SHIPPIND_ADDRESS_TITLE_MAP[asType]}
                    name="shippingAddress"
                    valueName="data"
                    component={AddressInfo}
                  />
                )}
              </Col>
            )}
            {!ediabled ? renderDeliveryBlock() : null}
          </Row>
        </Form>
      </MellowCard>
    </div>
  )
}

const AsAddressCardPropsForWard = React.forwardRef<AsAddressRefHandle, AsAddressCardProps>(AsAddressCardProps)

export default AsAddressCardPropsForWard
