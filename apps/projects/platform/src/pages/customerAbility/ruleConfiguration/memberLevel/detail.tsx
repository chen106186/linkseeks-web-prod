/**
 * @Description 平台会员等级 - 明细
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Spin } from 'antd'
import { getMemberCustomerAbilityLevelGet } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import MemberLevelForm, { SubmitValueType } from './components/MemberLevelForm'

const MemberLevelDetails: React.FC<{}> = (props) => {
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

  return (
    <Spin spinning={detailsLoading}>
      <MemberLevelForm
        title={intl.formatMessage({ id: 'member.memberLevel.details.level', defaultMessage: '查看会员等级' })}
        value={memberLevelDetails}
        editable={false}
      />
    </Spin>
  )
}

export default MemberLevelDetails
