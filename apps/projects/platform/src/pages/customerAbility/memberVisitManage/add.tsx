/**
 * @Description 会员拜访管理 - 新增
 */
import React from 'react'
import { message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { postMemberCustomerVisitAddOrUpdate } from '@apps/apis'
import MemberVisitForm, { SubmitValue } from './components/MemberVisitForm'

const AddMemberVisit: React.FC<{}> = (props) => {
  const intl = useIntl()

  const handleRoleRuleConfigFormSubmit = (value: SubmitValue): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: intl.formatMessage({
          id: 'member.memberVisitManage.add.adding',
          defaultMessage: '正在添加，请稍候...',
        }),
        duration: 0,
      })
      const { subMember, visitorMember, visitDate, files, ...rest } = value
      postMemberCustomerVisitAddOrUpdate({
        ...rest,
        memberId: subMember[0].memberId,
        visitorId: visitorMember[0].userId,
        visitDate: moment(visitDate).valueOf(),
        visitAttachments: files
          ? files.map((item) => ({
              name: item.name,
              url: item.url,
            }))
          : [],
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
    <MemberVisitForm
      title={intl.formatMessage({ id: 'customerAbility.visitManage.add.title', defaultMessage: '新增客户拜访' })}
      onSubmit={handleRoleRuleConfigFormSubmit}
    />
  )
}

export default AddMemberVisit
