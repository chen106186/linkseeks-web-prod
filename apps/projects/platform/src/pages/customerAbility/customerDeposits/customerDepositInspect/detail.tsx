/*
 * @Description: 待审核入库考察-详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberCustomerDepositInspectDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const CustomerDepositInspectDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerDepositInspectDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default CustomerDepositInspectDetails
