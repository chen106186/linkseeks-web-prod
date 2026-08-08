/*
 * @Description: 会员角色规则 - 基础信息布局容器组件
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import { MEMBER_LEVEL_INFO } from '../../config'

interface BasicInfoVirtualFieldItemProps {
  children: React.ReactNode
}

const BasicInfoVirtualFieldItem = (props: BasicInfoVirtualFieldItemProps) => {
  const { children } = props

  const intl = useIntl()

  return (
    <div id={MEMBER_LEVEL_INFO}>
      <MellowCard
        title={intl.formatMessage({ id: 'member.memberLevel.levelInfo', defaultMessage: '会员等级信息' })}
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
