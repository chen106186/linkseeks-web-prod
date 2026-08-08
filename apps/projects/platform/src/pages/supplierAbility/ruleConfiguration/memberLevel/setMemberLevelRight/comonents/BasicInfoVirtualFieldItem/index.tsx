/*
 * @Description: 会员角色规则 - 基础信息布局容器组件
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import { MEMBER_LEVEL_INFO } from '../../config'
import { useWebIntl } from '@apps/locales'

interface BasicInfoVirtualFieldItemProps {
  children: React.ReactNode
}

const BasicInfoVirtualFieldItem = (props: BasicInfoVirtualFieldItemProps) => {
  const { children } = props
  const translate = useWebIntl()
  return (
    <div id={MEMBER_LEVEL_INFO}>
      <MellowCard
        title={translate('web.resource.member.huiyuandengjixinxi')}
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        {children}
      </MellowCard>
    </div>
  )
}

BasicInfoVirtualFieldItem.isVirtualFieldComponent = true

export default BasicInfoVirtualFieldItem
