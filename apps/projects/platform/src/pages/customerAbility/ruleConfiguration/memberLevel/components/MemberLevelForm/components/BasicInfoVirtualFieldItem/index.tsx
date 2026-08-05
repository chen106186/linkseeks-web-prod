/*
 * @Description: 会员角色规则 - 基础信息布局容器组件
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import { PLATFORM_MEMBER_LEVEL } from '../../config'

interface BasicInfoVirtualFieldItemProps {
  children: React.ReactNode
}

const BasicInfoVirtualFieldItem = (props: BasicInfoVirtualFieldItemProps) => {
  const { children } = props

  const intl = useIntl()

  return (
    <div id={PLATFORM_MEMBER_LEVEL}>
      <MellowCard
        title={intl.formatMessage({ id: 'member.memberLevel.add.level', defaultMessage: '新增会员等级' })}
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
