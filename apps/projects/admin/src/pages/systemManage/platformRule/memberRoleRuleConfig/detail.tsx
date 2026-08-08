/**
 * @Description 会员角色规则配置 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { getMemberPlatformRoleRuleDetail } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import RoleRuleConfigForm, { SubmitValueType } from './components/RoleRuleConfigForm'

const MemberRoleRuleConfigDetails: React.FC<{}> = (props) => {
  const [roleRuleConfigDetails, setRoleRuleConfigDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { id } = usePageStatus()

  const fetchRoleRuleConfigDetails = () => {
    setDetailsLoading(true)
    getMemberPlatformRoleRuleDetail({
      memberId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          setRoleRuleConfigDetails({
            member: [
              {
                memberId: res.data.memberId,
                memberName: res.data.memberName,
              },
            ],
            curMemberApplicableRole: res.data.memberRoleList,
            subMemberApplicableRole: res.data.subMemberRoleList,
          })
        }
      })
      .finally(() => {
        setDetailsLoading(false)
      })
  }

  useEffect(() => {
    fetchRoleRuleConfigDetails()
  }, [])

  return (
    <Spin spinning={detailsLoading}>
      <RoleRuleConfigForm title="查看会员角色规则" value={roleRuleConfigDetails} editable={false} />
    </Spin>
  )
}

export default MemberRoleRuleConfigDetails
