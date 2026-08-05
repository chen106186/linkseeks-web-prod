/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-15 18:54:13
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-16 17:02:54
 * @Description: 换货收货地址
 */
import React from 'react'
import cx from 'classnames'
import { Text, View } from '@apps/mobile-ui'
import { getCurrentInstance, preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import useProductConst from '@/hooks/useProductConst'
import { themeLayout } from '@/constants/theme'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import AddressCard from '@/components/AddressCard'
import SteamerTicket from '../../../components/SteamerTicket'
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
  receiverName: string
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
}

interface IProps {
  /**
   * 是否可以编辑
   */
  isEdit?: boolean
  /**
   * 是否展示标题
   */
  showTitle?: boolean
  /**
   * 值
   */
  value: Values
  /**
   * 寄件人信息
   */
  sender?: {
    /**
     * 配送方式
     */
    deliveryType: number
    /**
     * 寄件人地址id
     */
    sendId: number
    /**
     * 寄件地址
     */
    sendAddress: string
    /**
     * 寄件者名称
     */
    sendUserName: string
    /**
     * 寄件者电话
     */
    sendUserTel: string
  }
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
  /**
   * 地址改变触发
   */
  onChange?: (value: Values) => void
}

const ExchangeAddress: React.FC<IProps> = (props: IProps) => {
  const params = getCurrentInstance().preloadData as any

  const {
    isEdit,
    showTitle,
    value = {
      address: {
        id: 0,
        fullAddress: '',
        phone: 0,
        receiverName: '',
      },
    },
    sender,
    customStyle,
    onChange,
  } = props

  const intl = useIntl()
  const { DELIVERY_TYPE_TEXT } = useProductConst()
  const handleJump = () => {
    // 跳转
    preload({
      ...params,
      addressList: (address: AddressValue) => {
        if (onChange) {
          onChange({
            ...value,
            address: {
              ...address,
              fullAddress: `${address.provinceName || ''}${address.cityName || ''}${address.districtName || ''}${
                address.address
              } ${address.receiverName}/${address.phone}`,
            },
          })
        }
      },
      active: '0',
    })
    Router.navigateTo('basicSetting/addressList')
  }

  return (
    <>
      <MellowCard
        title={
          showTitle
            ? intl.formatMessage({
                id: 'exchangeRecords.components.exchangeAddress.title',
                defaultMessage: '换货收货地址',
              })
            : ''
        }
        style={customStyle}
        bodyStyle={{
          padding: 0,
        }}
      >
        <Cell>
          {!isEdit ? (
            <Cell.Item
              title={intl.formatMessage({
                id: 'exchangeRecords.components.exchangeAddress.deliveryType',
                defaultMessage: '配送方式',
              })}
              value={sender && sender.deliveryType ? DELIVERY_TYPE_TEXT[sender.deliveryType] : ''}
              hasArrow={isEdit}
              clickable={isEdit}
            />
          ) : null}
          {sender && sender.sendId && !isEdit ? (
            <Cell.Item
              title={intl.formatMessage({
                id: 'exchangeRecords.components.exchangeAddress.sendAddress',
                defaultMessage: '换货发货地址',
              })}
              value={`${sender.sendAddress} ${sender.sendUserName}/${sender.sendUserTel}`}
              onPress={handleJump}
              hasArrow={isEdit}
              clickable={isEdit}
              customHeadStyle={{
                alignItems: 'flex-start',
              }}
              border
            />
          ) : null}
          <Cell.Item
            title={intl.formatMessage({
              id: 'exchangeRecords.components.exchangeAddress.receiverAddress',
              defaultMessage: '换货收货地址',
            })}
            value={
              value && value.address && value.address.id
                ? ''
                : intl.formatMessage({
                    id: 'exchangeRecords.components.exchangeAddress.receiverAddress.placeholder',
                    defaultMessage: '请选择',
                  })
            }
            onPress={handleJump}
            hasArrow={isEdit}
            clickable={isEdit}
            label={
              value.address.id ? (
                <AddressCard
                  data={{
                    id: value.address.id,
                    name: value.address.receiverName,
                    phoneNum: `${value.address.phone}`,
                    fullAddress: value.address.fullAddress,
                  }}
                  customStyle={{
                    paddingTop: pxTransform(themeLayout['padding-s']),
                  }}
                />
              ) : null
            }
          />
        </Cell>
        {sender && sender.sendId && isEdit ? (
          <View className={styles['addressee']}>
            <SteamerTicket>
              <Text className={styles['addressee-title']}>
                {intl.formatMessage({
                  id: 'exchangeRecords.components.exchangeAddress.sendAddress',
                  defaultMessage: '换货发货地址',
                })}
              </Text>
              <View className={styles['addressee-part']}>
                <Text className={cx(styles['addressee-text'], styles['addressee-name'])}>{sender.sendUserName}</Text>
                <Text className={styles['addressee-text']}>{sender.sendUserTel}</Text>
              </View>
              <View className={styles['addressee-part']}>
                <Text className={styles['addressee-text']}>{sender.sendAddress}</Text>
              </View>
            </SteamerTicket>
          </View>
        ) : null}
      </MellowCard>
    </>
  )
}

ExchangeAddress.defaultProps = {
  isEdit: false,
  showTitle: false,
  sender: undefined,
  customStyle: {},
  onChange: undefined,
}

export default ExchangeAddress
