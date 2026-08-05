/*
 * @Description: 待入库分类详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberCustomerDepositClassifyDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const CustomerDepositClassifyDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerDepositClassifyDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default CustomerDepositClassifyDetails
