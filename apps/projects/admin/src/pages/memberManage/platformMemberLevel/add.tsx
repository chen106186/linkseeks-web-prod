/**
 * @Description 平台会员等级管理 - 新增
 */
import React from 'react'
import { message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { postMemberManageLevelCreate } from '@apps/apis'
import MemberLevelForm, { SubmitValue } from './components/MemberLevelForm'

const AddMemberLevel: React.FC<{}> = (props) => {
  const handleRoleRuleConfigFormSubmit = (value: SubmitValue): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: '正在添加，请稍候...',
        duration: 0,
      })
      const { memberApplicableRole, ...rest } = value
      postMemberManageLevelCreate({
        ...rest,
        roleIds: memberApplicableRole.map((item) => item.roleId),
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve()
            setTimeout(() => {
              history.back()
            }, 800)
          } else {
            reject()
          }
        })
        .finally(() => {
          msg()
        })
    })

  return <MemberLevelForm title="新增平台会员等级" onSubmit={handleRoleRuleConfigFormSubmit} />
}

export default AddMemberLevel
