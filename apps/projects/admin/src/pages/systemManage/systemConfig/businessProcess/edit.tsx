/**
 * 修改流程业务规则
 * @author: Crayon
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import AddEditContent from './components/AddEditContent'

const ProcessSettingEdit: React.FC = () => {
  const { id } = usePageStatus()

  return <AddEditContent id={id} title="修改流程业务规则" />
}

export default ProcessSettingEdit
