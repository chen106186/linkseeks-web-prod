/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-26 10:26:33
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:07:54
 * @Description: 待审核会员变更(二级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberModifyGradeTwoDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const MemberPrVerifyChange2Detail: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberModifyGradeTwoDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default MemberPrVerifyChange2Detail
