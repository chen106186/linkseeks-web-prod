/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 16:26:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-27 16:26:17
 * @Description: 编辑会员管理流程规则
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import FlowRuleForm from './components/FlowRuleForm'

const MemberFlowRuleEdit: React.FC = () => {
  const { id } = usePageStatus()
  return <FlowRuleForm id={id} isEdit />
}

export default MemberFlowRuleEdit
