/**
 * 系统管理 - 平台规则 - 生命周期变更流程规则
 * @author: Crayon
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import AddEditContent from './components/AddEditContent'

const Edit: React.FC = () => {
  const { id } = usePageStatus()

  return <AddEditContent type="edit" id={id} title="生命周期变更流程规则" />
}

export default Edit
