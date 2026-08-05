/*
 * @Description: 会员角色规则 - 基础信息布局容器组件
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import { MEMBER_LEVEL_INFO } from '../../config'

interface BasicInfoVirtualFieldItemProps {
  children: React.ReactNode
}

const BasicInfoVirtualFieldItem = (props: BasicInfoVirtualFieldItemProps) => {
  const { children } = props
  return (
    <MellowCard
      id={MEMBER_LEVEL_INFO}
      title="会员等级信息"
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
