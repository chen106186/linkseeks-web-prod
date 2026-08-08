/**
 * @Description 供应会员-发出的评价-详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from './components/DetailInfo'

const SupplierEvaluationDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <DetailInfo id={id} />
}

export default SupplierEvaluationDetail
