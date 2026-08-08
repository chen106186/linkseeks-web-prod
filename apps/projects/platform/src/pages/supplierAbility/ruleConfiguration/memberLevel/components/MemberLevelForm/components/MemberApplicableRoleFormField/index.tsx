/*
 * @Description: 平台会员等级 - 会员适用会员角色FormField
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import themeConfig from '@apps/config/lingxi.theme.config'
import { MEMBER_APPLICABLE_ROLE } from '../../config'
import MemberApplicableRole, { MemberApplicableRoleType } from '../../../MemberApplicableRole'
import { useWebIntl } from '@apps/locales'

export type MemberApplicableRoleValue = MemberApplicableRoleType[]

const MemberApplicableRoleFormField = (props) => {
  const componentProps = props.props['x-component-props'] || {}
  const translate = useWebIntl()

  return (
    <div id={MEMBER_APPLICABLE_ROLE}>
      <MellowCard
        title={translate('web.resource.member.shiyonghuiyuanjuese')}
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
          editable={props.editable}
        />
      </MellowCard>
    </div>
  )
}

MemberApplicableRoleFormField.isFieldComponent = true

export default MemberApplicableRoleFormField

export * from '../../../MemberApplicableRole'
