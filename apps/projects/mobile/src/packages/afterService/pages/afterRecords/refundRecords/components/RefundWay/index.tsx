/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-05 17:41:30
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-16 17:15:33
 * @Description: 退货方式
 */
import React, { Fragment, useEffect, useState } from 'react'
import { getCurrentInstance, preload } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import useProductConst from '@/hooks/useProductConst'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { getLogisticsMobileShipperAddressPage } from '@apps/apis'
import AddressCard from '@/components/AddressCard'
import Cell from '@/components/Cell'
import MellowCard from '@/components/MellowCard'
import DeliverTypePopup from '../../../components/DeliverTypePopup'

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
   * 寄件人
   */
  shipperName: string
  /**
   * 固话
   */
  tel?: number
}

export interface Values {
  /**
   * 地址值
   */
  address: AddressValue
  /**
   * 配送方式
   */
  deliveryType: number
}

interface IProps {
  /**
   * 标题
   */
  title: string
  /**
   * 是否可以编辑
   */
  isEdit?: boolean
  /**
   * 值
   */
  value: Values
  /**
   * 收件人信息
   */
  // addressee?: {
  //   /**
  //    * 收货地址id
  //    */
  //   receiveId: number,
  //   /**
  //    * 收货地址
  //    */
  //   receiveAddress: string,
  //   /**
  //    * 收货者名称
  //    */
  //   receiveUserName: string,
  //   /**
  //    * 收货者电话
  //    */
  //   receiveUserTel: string,
  // },
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 地址改变触发
   */
  onChange?: (value: Values) => void
  /**
   * 是否默认选择 默认地址，是的话会触发 onChange value为默认地址，默认为false
   */
  isDefaultAddress?: boolean
}

const RefundWay: React.FC<IProps> = (props: IProps) => {
  const params = getCurrentInstance().preloadData as any

  const {
    title,
    isEdit,
    value = {
      address: {
        id: 0,
        fullAddress: '',
        phone: '',
        shipperName: '',
      },
      deliveryType: DELIVERY_TYPE_ENUM.LOGISTICS,
    },
    // addressee,
    customStyle,
    onChange,
    isDefaultAddress,
  } = props
  const [visibleDeliverTypePopup, setVisibleDeliverTypePopup] = useState(false)

  const intl = useIntl()
  const { DELIVERY_TYPE_TEXT_2 } = useProductConst()

  const triggerChange = (next: Values) => {
    onChange?.(next)
  }

  const getAddressList = () => {
    if (
      isEdit &&
      (value.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS || value.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP)
    ) {
      getLogisticsMobileShipperAddressPage({
        current: '1',
        pageSize: '99999',
      }).then((res) => {
        if (res.code === 1000) {
          const defaultItem = res.data?.data?.find((item) => item.isDefault)
          if (defaultItem && isDefaultAddress) {
            triggerChange({
              ...value,
              address: {
                id: defaultItem.id,
                fullAddress: `${defaultItem.provinceName || ''}${defaultItem.cityName || ''}${
                  defaultItem.districtName || ''
                } ${defaultItem.address}`,
                phone: defaultItem.phone,
                shipperName: defaultItem.shipperName,
              },
            })
          }
        }
      })
    }
  }

  useEffect(() => {
    getAddressList()
  }, [value.deliveryType])

  const handleVisibleDeliverTypePopup = (flag?: boolean) => {
    setVisibleDeliverTypePopup(!!flag)
  }

  const handleDeliverTypeChange = (deliveryType: number) => {
    let newValue = { ...value, deliveryType }

    // 置空地址值相关
    if (deliveryType === DELIVERY_TYPE_ENUM.NO_DELIVERY) {
      newValue = Object.assign(newValue, {
        address: {
          id: 0,
          fullAddress: '',
          phone: '',
          shipperName: '',
        },
      })
    }
    triggerChange(newValue)
  }

  const handleJump = () => {
    // 跳转退货发货地址
    preload({
      ...params,
      addressList: (address: AddressValue) => {
        if (onChange) {
          triggerChange({
            ...value,
            address: {
              ...address,
              fullAddress: `${address.provinceName || ''}${address.cityName || ''}${address.districtName || ''}${
                address.address
              }`,
            },
          })
        }
      },
      active: '1',
    })
    Router.navigateTo('basicSetting/addressList')
  }

  return (
    <Fragment>
      <MellowCard
        style={customStyle}
        bodyStyle={{
          padding: 0,
        }}
      >
        <Cell>
          <Cell.Item
            title={title}
            value={
              value && value.deliveryType
                ? DELIVERY_TYPE_TEXT_2[value.deliveryType]
                : intl.formatMessage({
                    id: 'refundRecords.components.refundWay.deliveryType.placeholder',
                    defaultMessage: '请选择',
                  })
            }
            onPress={() => handleVisibleDeliverTypePopup(true)}
            hasArrow
            clickable
            border={!value}
          />
          {value &&
          (value.deliveryType === DELIVERY_TYPE_ENUM.LOGISTICS ||
            value.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP) ? (
            <Cell.Item
              title={
                <AddressCard
                  data={{
                    id: value.address.id,
                    name: value.address.shipperName,
                    phoneNum: value.address.phone,
                    fullAddress: value.address.fullAddress,
                  }}
                />
              }
              onPress={handleJump}
              hasArrow={isEdit}
              clickable={isEdit}
            />
          ) : null}
        </Cell>
      </MellowCard>
      <DeliverTypePopup
        afterType={1}
        visible={visibleDeliverTypePopup}
        onClose={() => handleVisibleDeliverTypePopup(false)}
        onChange={handleDeliverTypeChange}
      />
    </Fragment>
  )
}

RefundWay.defaultProps = {
  isEdit: false,
  // addressee: undefined,
  customStyle: {},
  onChange: undefined,
  isDefaultAddress: false,
}

export default RefundWay
