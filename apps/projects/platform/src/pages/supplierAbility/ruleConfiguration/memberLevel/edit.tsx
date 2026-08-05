/**
 * @Description 平台会员等级 - 编辑
 */
import React, { useState, useEffect } from 'react'
import { Spin, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { getMemberSupplierAbilityLevelGet, postMemberSupplierAbilityLevelUpdate } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import MemberLevelForm, { SubmitValue, SubmitValueType } from './components/MemberLevelForm'

const ModifyMemberLevel: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { id } = usePageStatus()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberSupplierAbilityLevelGet({
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
        content: '正在修改，请稍候...',
        duration: 0,
      })
      const { memberApplicableRole, ...rest } = value
      postMemberSupplierAbilityLevelUpdate({
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
        title="编辑会员角色"
        value={memberLevelDetails}
        onSubmit={handleRoleRuleConfigFormSubmit}
        cloudy
      />
    </Spin>
  )
}

export default ModifyMemberLevel
