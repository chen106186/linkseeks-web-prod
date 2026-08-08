/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 18:02:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:09:16
 * @Description: 待审核入库(一级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberDepositGradeOneDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const MemberPrVerifyComing1Detail: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberDepositGradeOneDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default MemberPrVerifyComing1Detail
