/**
 * @Description 平台会员等级 - 明细
 */
import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { getMemberSupplierAbilityLevelGet } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import MemberLevelForm, { SubmitValueType } from './components/MemberLevelForm'
import { useWebIntl } from '@apps/locales'

const MemberLevelDetails: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const translate = useWebIntl()

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

  return (
    <Spin spinning={detailsLoading}>
      <MemberLevelForm
        title={translate('web.resource.member.chakanhuiyuandengji')}
        value={memberLevelDetails}
        editable={false}
      />
    </Spin>
  )
}

export default MemberLevelDetails
