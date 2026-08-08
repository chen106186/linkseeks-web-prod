import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import ReturnForm from './components/ReturnForm'

const ReturnDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <ReturnForm id={id} />
}

export default ReturnDetail
