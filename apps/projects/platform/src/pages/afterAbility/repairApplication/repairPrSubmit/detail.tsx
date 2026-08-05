import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import RepairForm from './components/RepairForm'

const RepairDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <RepairForm id={id} />
}

export default RepairDetail
