import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from './components/DetailInfo'

const PurchaserEvaluationDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <DetailInfo id={id} />
}

export default PurchaserEvaluationDetail
