/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-04 18:08:21
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 09:56:28
 * @Description: 地址展示Card
 */
import React, { CSSProperties } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import Label from '@/components/Label'
import classNames from 'classnames'
import './index.scss'
import { useMobileIntl } from '@apps/locales'

export type AddressDataType = {
  /**
   * 地址id
   */
  id: number
  /**
   * 收件人 / 寄件人名称
   */
  name: string
  /**
   * 手机号码
   */
  phoneNum: string
  /**
   * 详细地址信息
   */
  fullAddress: string
}

interface AddressCardProps {
  /**
   * 数据
   */
  data: AddressDataType
  /**
   * 自定义外部样式
   */
  customStyle?: string | CSSProperties
  /**
   * 自定义class
   */
  customClassName?: string
  /**
   * 是否是默认
   */
  isDefault?: boolean
  /**
   * 点击时间
   */
  onClick?: (() => void) | null
  /**
   * 当data的id为null时， 提示语，即当前地址没有时
   */
  tips?: string
}

const AddressCard: React.FC<AddressCardProps> = (props: AddressCardProps) => {
  const translate = useMobileIntl()
  const {
    data,
    customStyle,
    customClassName,
    onClick,
    isDefault,
    tips = translate('mobile.common.qingxuanzedizhi'),
  } = props

  const handleClick = () => {
    onClick?.()
  }

  return (
    <View className={classNames('address-card', customClassName)} style={customStyle} onClick={handleClick}>
      <View className="address-card-left">
        <Icons name="Pin" size={16} color="#303133" />
      </View>
      <View className="address-card-center">
        {(data.id && (
          <>
            <View className="address-card-center-head">
              <Text className="address-card-name">{data.name || ''}</Text>
              <Text className="address-card-phone-num">{data.phoneNum || ''}</Text>
              {Boolean(isDefault) && <Label name="默认" type="primary" />}
            </View>
            <Text className="address-card-full-address">{data.fullAddress || ''}</Text>
          </>
        )) || <Text className="address-card-tips">{tips}</Text>}
      </View>
      {onClick && (
        <View>
          <Icons name="ChevronRight" size={16} color="#303133" />
        </View>
      )}
    </View>
  )
}

AddressCard.defaultProps = {
  customStyle: undefined,
  customClassName: '',
  isDefault: false,
}

export default AddressCard
