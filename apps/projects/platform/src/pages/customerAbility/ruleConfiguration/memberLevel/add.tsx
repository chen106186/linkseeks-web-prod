/**
 * @Description 会员等级管理 - 新增
 */
import React from 'react'
import { message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { postMemberCustomerAbilityLevelCreate } from '@apps/apis'
import MemberLevelForm, { SubmitValue } from './components/MemberLevelForm'

const AddMemberLevel: React.FC<{}> = (props) => {
  const intl = useIntl()

  const handleRoleRuleConfigFormSubmit = (value: SubmitValue): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: intl.formatMessage({ id: 'member.memberLevel.add.adding', defaultMessage: '正在添加，请稍候...' }),
        duration: 0,
      })
      const { memberApplicableRole, ...rest } = value
      postMemberCustomerAbilityLevelCreate({
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
      title={intl.formatMessage({ id: 'member.memberLevel.add.level', defaultMessage: '新增会员等级' })}
      onSubmit={handleRoleRuleConfigFormSubmit}
    />
  )
}

export default AddMemberLevel
