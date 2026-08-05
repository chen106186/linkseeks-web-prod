/**
 * @Description 会员等级管理 - 新增
 */
import React from 'react'
import { message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { postMemberSupplierAbilityLevelCreate } from '@apps/apis'
import MemberLevelForm, { SubmitValue } from './components/MemberLevelForm'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const AddMemberLevel: React.FC<{}> = (props) => {
  const handleRoleRuleConfigFormSubmit = (value: SubmitValue): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: translate('web.common.addloadingpleasewaiting'),
        duration: 0,
      })
      const { memberApplicableRole, ...rest } = value
      postMemberSupplierAbilityLevelCreate({
        ...rest,
        roleIds: memberApplicableRole.map((item) => item.roleId),
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
    <MemberLevelForm
      title={translate('web.resource.member.xinzenghuiyuandengji')}
      onSubmit={handleRoleRuleConfigFormSubmit}
    />
  )
}

export default AddMemberLevel
