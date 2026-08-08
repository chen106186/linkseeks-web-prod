/*
 * @Description: 会员角色规则 - 基础信息布局容器组件
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import { ROLE_RULE_BASIC_KEY } from '../../config'

interface BasicInfoVirtualFieldItemProps {
  children: React.ReactNode
}

const BasicInfoVirtualFieldItem = (props: BasicInfoVirtualFieldItemProps) => {
  const { children } = props
  return (
    <MellowCard
      id={ROLE_RULE_BASIC_KEY}
      title="基本信息"
      bodyStyle={{
        paddingBottom: 0,
      }}
    >
      {children}
    </MellowCard>
  )
}

BasicInfoVirtualFieldItem.isVirtualFieldComponent = true

export default BasicInfoVirtualFieldItem
