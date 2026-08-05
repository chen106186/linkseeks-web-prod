/*
 * @Description: 会员角色规则 - 当前会员适用会员角色FormField
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import { SUBORDINATE_MEMBER_APPLICABLE_ROLE } from '../../config'
import MemberApplicableRole, { MemberApplicableRoleType } from '../../../MemberApplicableRole'

export type SubMemberApplicableRoleValue = MemberApplicableRoleType[]

const SubMemberApplicableRoleFormField = (props) => {
  const componentProps = props.props['x-component-props'] || {}
  return (
    <MellowCard
      id={SUBORDINATE_MEMBER_APPLICABLE_ROLE}
      title="下属会员适用会员角色"
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

SubMemberApplicableRoleFormField.isFieldComponent = true

export default SubMemberApplicableRoleFormField
