/**
 * @Description 会员拜访 - 详情
 */
import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { formatTimeString } from '@/utils'
import { getMemberSupplierVisitDetails } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { normalizeFiledata } from '@/utils'
import MemberVisitForm, { SubmitValueType } from './components/MemberVisitForm'
import { useWebIntl } from '@apps/locales'

const MemberVisitDetails: React.FC<{}> = (props) => {
  const [memberLevelDetails, setMemberLevelDetails] = useState<SubmitValueType | undefined>(undefined)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const translate = useWebIntl()

  const { id } = usePageStatus()

  const fetchMemberLevelDetails = () => {
    setDetailsLoading(true)
    getMemberSupplierVisitDetails({
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
        title={translate('web.resource.member.chakanhuiyuanbaifang')}
        value={memberLevelDetails}
        editable={false}
      />
    </Spin>
  )
}

export default MemberVisitDetails
