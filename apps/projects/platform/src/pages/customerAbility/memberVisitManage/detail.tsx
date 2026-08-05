/**
 * @Description 会员拜访 - 详情
 */
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Spin } from 'antd'
import { formatTimeString } from '@/utils'
import { getMemberCustomerVisitDetails } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { normalizeFiledata } from '@/utils'
import MemberVisitForm, { SubmitValueType } from './components/MemberVisitForm'

const MemberVisitDetails: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const { id } = usePageStatus()
  const intl = useIntl()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberCustomerVisitDetails({
      id: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { memberId, visitorId, visitor, visitDate, visitAttachments, ...rest } = res.data
          setMemberLevelDetails({
            ...rest,
            subMember: [{ memberId: memberId, name: rest.memberName }] as any[],
            visitorMember: [{ userId: visitorId, name: visitor }] as any[],
            visitDate: formatTimeString(visitDate, 'YYYY-MM-DD'),
            files: visitAttachments ? visitAttachments.map((item) => normalizeFiledata(item.url)) : [],
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
      <MemberVisitForm
        title={intl.formatMessage({ id: 'customerAbility.visitManage.details.title', defaultMessage: '查看客户拜访' })}
        value={memberLevelDetails}
        editable={false}
      />
    </Spin>
  )
}

export default MemberVisitDetails
