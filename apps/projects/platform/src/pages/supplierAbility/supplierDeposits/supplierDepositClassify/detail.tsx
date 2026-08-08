/*
 * @Description: 待入库分类详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierDepositClassifyDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const SupplierDepositClassifyDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierDepositClassifyDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default SupplierDepositClassifyDetails
