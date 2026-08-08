/**
 * @Description 平台会员等级 - 明细
 */
import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { getMemberManageLevelGet } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import MemberLevelForm, { SubmitValueType } from './components/MemberLevelForm'

const MemberLevelDetails: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { id } = usePageStatus()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberManageLevelGet({
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
      <MemberLevelForm title="查看平台会员等级" value={memberLevelDetails} editable={false} />
    </Spin>
  )
}

export default MemberLevelDetails
