/*
 * @Description: 待审核入库考察-详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierDepositInspectDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const SupplierDepositInspectDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierDepositInspectDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default SupplierDepositInspectDetails
