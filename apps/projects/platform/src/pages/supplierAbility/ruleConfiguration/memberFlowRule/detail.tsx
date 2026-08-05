/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 16:25:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-27 16:31:10
 * @Description: 会员管理流程规则详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import FlowRuleForm from './components/FlowRuleForm'

const MemberFlowRuleDetail: React.FC = () => {
  const { id } = usePageStatus()
  return <FlowRuleForm id={id} />
}

export default MemberFlowRuleDetail
