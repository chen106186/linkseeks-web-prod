/**
 * 系统管理 - 平台规则 - 质量管理流程规则详情
 * @author: Crayon
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import AddEditContent from './components/AddEditContent'

const View: React.FC = () => {
  const { id } = usePageStatus()

  return <AddEditContent type="view" id={id} title="质量管理流程规则详情" />
}

export default View
