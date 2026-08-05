/**
 * @Description 平台会员等级 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { getMemberCustomerAbilityLevelGet, postMemberCustomerAbilityLevelUpdate } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import MemberLevelForm, { SubmitValue, SubmitValueType } from './components/MemberLevelForm'

const ModifyMemberLevel: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { id } = usePageStatus()
  const intl = useIntl()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberCustomerAbilityLevelGet({
      levelId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { roles, ...rest } = res.data
          setMemberLevelDetails({
            ...rest,
            memberApplicableRole: roles,
          })
        }
      })
      .finally(() => {
        setDetailsLoading(false)
      })
  }

  useEffect(() => {
    fetchMemberLevelDetails()
  }, [])

  const handleRoleRuleConfigFormSubmit = (value: SubmitValue): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: intl.formatMessage({
          id: 'member.memberLevel.modify.modifying',
          defaultMessage: '正在修改，请稍候...',
        }),
        duration: 0,
      })
      const { memberApplicableRole, ...rest } = value
      postMemberCustomerAbilityLevelUpdate({
        levelId: +id,
        ...rest,
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
      <MemberLevelForm
        title={intl.formatMessage({ id: 'member.memberLevel.add.level', defaultMessage: '编辑会员角色' })}
        value={memberLevelDetails}
        onSubmit={handleRoleRuleConfigFormSubmit}
        cloudy
      />
    </Spin>
  )
}

export default ModifyMemberLevel
