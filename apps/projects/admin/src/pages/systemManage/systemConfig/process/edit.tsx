/**
 * 修改流程配置
 * @author: Crayon
 */
import React from 'react'
import AddEditContent from './components/AddEditContent'
import { usePageStatus } from '@/hooks/usePageStatus'

const ProcessSettingEdit: React.FC = () => {
  const { id } = usePageStatus()

  return <AddEditContent id={id} title="修改流程配置" />
}

export default ProcessSettingEdit
