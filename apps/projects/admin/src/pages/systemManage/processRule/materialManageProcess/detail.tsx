/**
 * 系统管理 - 平台规则 - 查看物料管理流程规则
 * @author: Crayon
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import AddEditContent from './components/AddEditContent'

const View: React.FC = () => {
  const { id } = usePageStatus()

  return <AddEditContent type="view" id={id} title="查看物料管理流程规则" />
}

export default View
