/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-01 14:07:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-22 15:35:58
 * @Description: 采购商名片
 */
import React from 'react'
import { View, Text, Toast } from '@apps/mobile-ui'
import Router from '@/utils/router'
import ShopCreditInfo from '@/components/ShopCreditInfo'
import { useIntl } from '@linkseeks/i18n'
import ImageBox from '../ImageBox'
import './index.scss'

export interface SupplierInfoData {
  /**
   * 供应商id
   */
  id: number
  /**
   * 供应商名称
   */
  name: string
  /**
   * 供应商logo
   */
  logo: string
  /**
   * 供应商会员id
   */
  memberId: number
  /**
   * 供应商角色id
   */
  roleId: number
  /**
   * 信用积分
   */
  creditPoint: number | string
  /**
   * 注册年限
   */
  registerYears: number | string
  /**
   * 店铺状态，0：冻结 1： 正常
   */
  status?: number
}

interface BusinessCardProps {
  /**
   * 数据
   */
  data: SupplierInfoData
  /**
   * 自定义描述区域其他内容
   */
  describeExtra?: React.ReactNode
  /**
   * 自定义右侧其他内容
   */
  extra?: React.ReactNode
  /**
   * 点击触发事件
   */
  onClick?: () => void
}

const BusinessCard: React.FC<BusinessCardProps> = (props: BusinessCardProps) => {
  const { data, describeExtra, extra, onClick } = props
  const intl = useIntl()

  const handlePress = () => {
    if (data && data.status === 0) {
      Toast.show({ title: intl.formatMessage({ id: 'components.dianpuyiguanbi', defaultMessage: '店铺已关闭' }) })
      return
    }
    Router.navigateTo('shop/home', { id: data.id })
    onClick?.()
  }

  return (
    <View onClick={handlePress} className="businessCard">
      <View className="businessCard-left">
        <View className="businessCard-avatar">
          <ImageBox className="businessCard-avatar-img" source={data.logo} />
          {data.status === 0 ? (
            <View className="businessCard-status">
              <Text className="businessCard-status-txt">
                {intl.formatMessage({ id: 'components.yiguanbi', defaultMessage: '已关闭' })}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <View className="businessCard-center">
        <Text className="businessCard-name">{data.name}</Text>
        {!describeExtra ? (
          <View className="businessCard-describe">
            <ShopCreditInfo
              creditPoint={Number(data.creditPoint || 0)}
              registerYears={Number(data.registerYears || 0)}
            />
          </View>
        ) : (
          describeExtra
        )}
      </View>
      {extra ? <View className="businessCard-right">{extra}</View> : null}
    </View>
  )
}

BusinessCard.defaultProps = {
  describeExtra: null,
  extra: null,
}

export default BusinessCard
