/*
 * @Description: 待确认会员变更详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberCustomerModifyConfirmDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const CustomerModifyConfirmDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerModifyConfirmDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default CustomerModifyConfirmDetails
