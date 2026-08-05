/**
 * @Description 会员角色规则配置 - 添加
 */
import React from 'react'
import { message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { postMemberPlatformRoleRuleAdd } from '@apps/apis'
import RoleRuleConfigForm, { SubmitValue } from './components/RoleRuleConfigForm'

const AddMemberRoleRuleConfig: React.FC<{}> = (props) => {
  const handleRoleRuleConfigFormSubmit = (value: SubmitValue): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: '正在添加，请稍候...',
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

  return <RoleRuleConfigForm title="新增会员角色规则" onSubmit={handleRoleRuleConfigFormSubmit} />
}

export default AddMemberRoleRuleConfig
