import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from './components/DetailInfo'

const PurchaserEvaluationEdit: React.FC = () => {
  const { id } = usePageStatus()

  return <DetailInfo id={id} ediabled />
}

export default PurchaserEvaluationEdit
