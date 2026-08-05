/*
 * @Description: 会员列表展示柜台
 */
import React, { CSSProperties } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import Descriptions from '@/components/Descriptions'
import './index.scss'

export type VenderType = {
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
}

export interface MemberCounterProps {
  /**
   * 展示数据
   */
  data: {
    /**
     * 会员名称
     */
    name: string
    /**
     * 状态名称，可以是外部状态也可以是内部状态（供应商导入列表）
     */
    statusName: string
  }
  /**
   * 自定义渲染 foot左侧
   */
  customRenderFootLeft?: React.ReactNode
  /**
   * 自定义渲染 foot右侧
   */
  customRenderFootRight?: React.ReactNode
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties
  /**
   * 点击事件触发
   */
  onPress?: () => void
  /**
   * 描述数据
   */
  descriptions: {
    label: string
    value: any
  }[]
}

const MemberCounter: React.FC<MemberCounterProps> = (props: MemberCounterProps) => {
  const { data, customRenderFootLeft, customRenderFootRight, customStyle, onPress, descriptions } = props

  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <View className="member-counter" style={customStyle} onClick={handlePress}>
      <View className="member-counter-head">
        <View className="member-counter-head-left">
          <View className="member-counter-name">{data.name}</View>
        </View>
        <View className="member-counter-head-extra">
          <Text className="member-counter-status">{data.statusName}</Text>
        </View>
      </View>
      <View className="member-counter-body">
        <Descriptions column={2} colon="" labelWidth={pxTransform(70)}>
          {descriptions.map((item) => (
            <Descriptions.Item label={item.label} key={item.label}>
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </View>
      {customRenderFootLeft || customRenderFootRight ? (
        <View className="member-counter-foot">
          <View className="member-counter-foot-left">{customRenderFootLeft}</View>
          <View className="member-counter-foot-right">{customRenderFootRight}</View>
        </View>
      ) : null}
    </View>
  )
}

export default MemberCounter
