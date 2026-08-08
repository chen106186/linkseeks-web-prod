/*
 * @Description: 会员角色规则 - 当前会员适用会员角色FormField
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import themeConfig from '@apps/config/lingxi.theme.config'
import { CURRENT_MEMBER_APPLICABLE_ROLE } from '../../config'
import MemberApplicableRole, { MemberApplicableRoleType } from '../../../MemberApplicableRole'

export type CurMemberApplicableRoleValue = MemberApplicableRoleType[]

const CurMemberApplicableRoleFormField = (props) => {
  const componentProps = props.props['x-component-props'] || {}
  return (
    <MellowCard
      id={CURRENT_MEMBER_APPLICABLE_ROLE}
      title="当前会员适用会员角色"
      style={{
        marginTop: themeConfig['@margin-md'],
      }}
      bodyStyle={{
        paddingBottom: 0,
      }}
    >
      <MemberApplicableRole
        value={props.value}
        onChange={(next) => props.mutators.change(next)}
        fetchDataSource={componentProps.fetchDataSource}
      />
    </MellowCard>
  )
}

CurMemberApplicableRoleFormField.isFieldComponent = true

export default CurMemberApplicableRoleFormField

export * from '../../../MemberApplicableRole'
