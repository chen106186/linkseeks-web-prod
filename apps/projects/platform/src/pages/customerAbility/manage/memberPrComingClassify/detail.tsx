/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 14:35:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:04:57
 * @Description: 待入库分类详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberDepositClassifyDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const MemberPrComingClassify: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberDepositClassifyDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default MemberPrComingClassify
