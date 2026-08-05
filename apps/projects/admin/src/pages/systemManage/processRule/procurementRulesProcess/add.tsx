/**
 * 系统管理 - 平台规则 - 新增/修改采购流程规则
 * @author: Crayon
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import AddEditContent from './components/AddEditContent'

const Edit: React.FC = () => {
  const { id } = usePageStatus()

  return <AddEditContent type={id ? 'edit' : 'add'} id={id} title={id ? '修改采购流程规则' : '新增采购流程规则'} />
}

export default Edit
