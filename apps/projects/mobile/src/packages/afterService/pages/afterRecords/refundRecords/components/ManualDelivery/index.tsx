/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 13:52:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-16 17:20:06
 * @Description: 手工发货
 */
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { getCurrentInstance, preload, showToast } from '@apps/mobile-services/utils/taro'
import { View, Input, Picker } from '@apps/mobile-ui'
import { CommonEventFunction } from '@tarojs/components'
import { PickerDateProps } from '@tarojs/components/types/Picker'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { dateFormat } from '@/utils/date'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { limitByte } from '@/utils'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import useAfterServiceConst from '@/packages/afterService/hooks/useAfterServiceConst'
import styles from './index.module.scss'

export interface AddressValue {
  /**
   * 数据id
   */
  id: number
  /**
   * 省
   */
  provinceName?: string
  /**
   * 市
   */
  cityName?: string
  /**
   * 区
   */
  districtName?: string
  /**
   * 详细地址
   */
  address?: string
  /**
   * 完整地址
   */
  fullAddress: string
  /**
   * 是否是默认地址
   */
  isDefault?: boolean
  /**
   * 手机号码
   */
  phone: string
  /**
   * 邮编
   */
  postalCode?: number
  /**
   * 收件人
   */
  shipperName: string
  /**
   * 固话
   */
  tel?: number
}

export type CompanyCallbackValue = {
  name: string
  key: string | undefined
}

export interface Values {
  /**
   * 地址值
   */
  deliveryAddress: string
  /**
   * 发货时间
   */
  deliveryTime: number | string
  /**
   * 物流单号
   */
  logisticsOrderNo: string
  /**
   * 物流公司
   */
  logisticsName: string
  /**
   * 其他物流公司
   */
  otherLogisticsName?: string
}

interface IProps {
  /**
   * 是否可以编辑
   */
  isEdit?: boolean
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 值
   */

  value?: Values
  /**
   * 配送方式
   */
  deliveryType: number
}

export type ManualDeliveryRefHandle = {
  /**
   * 提交
   */
  submit: () => Values | null
}

const ManualDelivery: React.ForwardRefRenderFunction<ManualDeliveryRefHandle, IProps> = (props, ref) => {
  const params = getCurrentInstance().preloadData as any

  const { isEdit = false, value, customStyle, deliveryType } = props
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const nowTime = new Date()
  const [deliveryTime, setDeliveryTime] = useState(dateFormat(nowTime, 'YYYY-MM-DD'))
  const [logisticsOrderNo, setLogisticsOrderNo] = useState('')
  const [logisticsName, setLogisticsName] = useState('')
  const [isOtherCompany, setIsOtherCompany] = useState(false)
  const [otherLogisticsName, setOtherLogisticsName] = useState('')
  const { OTHER_LOGISTICS_COMPANY_KEY } = useAfterServiceConst()

  const intl = useIntl()

  useEffect(() => {
    if ('value' in props && value) {
      const date = new Date(value.deliveryTime)
      setDeliveryAddress(value.deliveryAddress)
      setDeliveryTime(dateFormat(date, 'YYYY-MM-DD'))
      setLogisticsOrderNo(value.logisticsOrderNo)
      setLogisticsName(value.logisticsName)
    }
  }, [value])

  const handleJump = () => {
    // 跳转
    preload({
      ...params,
      addressList: (address: AddressValue) => {
        const addressStr = `${address.fullAddress} ${address.shipperName} ${address.phone}`
        setDeliveryAddress(addressStr)
      },
      active: '1',
    })
    Router.navigateTo('basicSetting/addressList')
  }

  // 发货时间确认变化
  const handlePickerConfirm: CommonEventFunction<PickerDateProps.ChangeEventDetail> = (e) => {
    const timerStr = dateFormat(new Date(e.detail.value), 'YYYY-MM-DD')
    setDeliveryTime(timerStr)
  }

  // 物流单号改变
  const handleLogisticsOrderNoChange = (next: string) => {
    setLogisticsOrderNo(next)
  }

  // 物流公司改变
  const handleCompanyChange = (next: string) => {
    setLogisticsName(next)
  }

  // 其他物流公司改变
  const handleOtherCompanyChange = (next: string) => {
    setOtherLogisticsName(next)
  }

  const handleJumpChooseLogisticsCompany = () => {
    preload({
      ...params,
      onCallback: (next: CompanyCallbackValue) => {
        handleCompanyChange(next.name)
        if (next.key !== OTHER_LOGISTICS_COMPANY_KEY) {
          setIsOtherCompany(false)
        } else {
          setIsOtherCompany(true)
        }
      },
      defaultValue: logisticsName,
    })
    Router.navigateTo('afterService/afterRecords/chooseLogisticsCompany')
  }

  const handleSubmit = () => {
    if (!deliveryAddress) {
      showToast({
        title: intl.formatMessage({
          id: 'refundRecords.components.manualDelivery.deliveryAddress.required',
          defaultMessage: '请选择发货地址',
        }),
        icon: 'none',
      })
      return null
    }
    if (!deliveryTime) {
      showToast({
        title: intl.formatMessage({
          id: 'refundRecords.components.manualDelivery.deliveryTime.required',
          defaultMessage: '请选择发货时间',
        }),
        icon: 'none',
      })
      return null
    }
    if (deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS && !logisticsName) {
      showToast({
        title: intl.formatMessage({
          id: 'refundRecords.components.manualDelivery.logisticsName.required',
          defaultMessage: '请选择物流公司',
        }),
        icon: 'none',
      })
      return null
    }
    if (deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS && logisticsName && isOtherCompany && !otherLogisticsName) {
      showToast({
        title: intl.formatMessage({
          id: 'refundRecords.components.manualDelivery.otherLogisticsName.required',
          defaultMessage: '请输入物流公司',
        }),
        icon: 'none',
      })
      return null
    }
    if (deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS && logisticsName && isOtherCompany && otherLogisticsName) {
      const message = limitByte(otherLogisticsName, { maxByte: 40 })
      if (message) {
        showToast({ title: message, icon: 'none' })
        return null
      }
    }
    if (deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS && !logisticsOrderNo) {
      showToast({
        title: intl.formatMessage({
          id: 'refundRecords.components.manualDelivery.logisticsOrderNo.required',
          defaultMessage: '请输入发货单号',
        }),
        icon: 'none',
      })
      return null
    }
    return {
      deliveryAddress,
      deliveryTime,
      logisticsOrderNo,
      logisticsName,
      otherLogisticsName,
    }
  }

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }))

  return (
    <>
      <MellowCard
        title={intl.formatMessage({ id: 'refundRecords.components.manualDelivery.title', defaultMessage: '退货信息' })}
        style={customStyle}
        bodyStyle={{
          padding: 0,
        }}
        headStyle={{
          borderBottom: 'none',
        }}
      >
        <Cell>
          <Cell.Item
            title={intl.formatMessage({
              id: 'refundRecords.components.manualDelivery.deliveryAddress',
              defaultMessage: '发货地址',
            })}
            value={
              deliveryAddress ||
              intl.formatMessage({
                id: 'refundRecords.components.manualDelivery.deliveryAddress.required.sub',
                defaultMessage: '请选择',
              })
            }
            onPress={handleJump}
            hasArrow={isEdit}
            clickable={isEdit}
          />
          <Cell.Item
            title={intl.formatMessage({
              id: 'refundRecords.components.manualDelivery.deliveryTime',
              defaultMessage: '发货时间',
            })}
            value={
              <>
                <Picker mode="date" value={deliveryTime} onChange={handlePickerConfirm}>
                  {deliveryTime}
                </Picker>
              </>
            }
            hasArrow={isEdit}
            clickable={isEdit}
          />
          {deliveryType !== DELIVERY_TYPE_ENUM.SELF_PICKUP ? (
            <>
              <Cell.Item
                title={intl.formatMessage({
                  id: 'refundRecords.components.manualDelivery.logisticsName',
                  defaultMessage: '物流公司',
                })}
                value={
                  logisticsName ||
                  intl.formatMessage({
                    id: 'refundRecords.components.manualDelivery.logisticsName.required.sub',
                    defaultMessage: '请选择',
                  })
                }
                onPress={handleJumpChooseLogisticsCompany}
                hasArrow={isEdit}
                clickable={isEdit}
              />
              {isOtherCompany && (
                <Cell.Item
                  title={intl.formatMessage({
                    id: 'refundRecords.components.manualDelivery.otherLogisticsName',
                    defaultMessage: '物流公司名称',
                  })}
                  value={
                    <View className={styles['manual-delivery-field']}>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'refundRecords.components.manualDelivery.otherLogisticsName.placeholder',
                          defaultMessage: '点击输入',
                        })}
                        style={{
                          flex: 1,
                          padding: 0,
                          textAlign: 'right',
                        }}
                        value={otherLogisticsName}
                        onChange={handleOtherCompanyChange}
                        border={false}
                      />
                    </View>
                  }
                />
              )}
              <Cell.Item
                title={intl.formatMessage({
                  id: 'refundRecords.components.manualDelivery.logisticsOrderNo',
                  defaultMessage: '发货单号',
                })}
                value={
                  isEdit ? (
                    <View className={styles['manual-delivery-field']}>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'refundRecords.components.manualDelivery.logisticsOrderNo.placeholder',
                          defaultMessage: '点击输入',
                        })}
                        style={{
                          flex: 1,
                          padding: 0,
                          textAlign: 'right',
                        }}
                        value={logisticsOrderNo}
                        onChange={handleLogisticsOrderNoChange}
                        border={false}
                      />
                    </View>
                  ) : (
                    logisticsOrderNo
                  )
                }
              />
            </>
          ) : null}
        </Cell>
      </MellowCard>
    </>
  )
}

const ManualDeliveryForWard = React.forwardRef<ManualDeliveryRefHandle, IProps>(ManualDelivery)

export default ManualDeliveryForWard
