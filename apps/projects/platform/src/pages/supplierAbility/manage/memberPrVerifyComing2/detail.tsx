/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 18:02:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 18:26:33
 * @Description: 待审核入库(二级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierDepositGradeTwoDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const MemberPrVerifyComing2Detail: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierDepositGradeTwoDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default MemberPrVerifyComing2Detail
