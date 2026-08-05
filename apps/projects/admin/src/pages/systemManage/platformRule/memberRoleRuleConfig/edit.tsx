/**
 * @Description 会员角色规则配置 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { getMemberPlatformRoleRuleDetail, postMemberPlatformRoleRuleAdd } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import RoleRuleConfigForm, { SubmitValue, SubmitValueType } from './components/RoleRuleConfigForm'

const ModifyMemberRoleRuleConfig: React.FC<{}> = (props) => {
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

  const handleRoleRuleConfigFormSubmit = (value: SubmitValue): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: '正在修改，请稍候...',
        duration: 0,
      })
      postMemberPlatformRoleRuleAdd({
        memberId: value.member[0].memberId,
        memberRoleIdList: value.curMemberApplicableRole.map((item) => item.roleId),
        subMemberRoleIdList: value.subMemberApplicableRole.map((item) => item.roleId),
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve()
            setTimeout(() => {
              history.goBack()
            }, 800)
          } else {
            reject()
          }
        })
        .finally(() => {
          msg()
        })
    })

  return (
    <Spin spinning={detailsLoading}>
      <RoleRuleConfigForm
        title="编辑会员角色规则"
        value={roleRuleConfigDetails}
        onSubmit={handleRoleRuleConfigFormSubmit}
        cloudy
      />
    </Spin>
  )
}

export default ModifyMemberRoleRuleConfig
