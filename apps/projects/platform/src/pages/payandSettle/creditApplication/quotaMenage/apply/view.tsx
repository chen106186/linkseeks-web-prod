import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../../components/DetailInfo'

const QuotaMenageApply: React.FC = () => {
  const { applyId, creditId } = usePageStatus()

  return (
    <DetailInfo id={applyId} creditId={creditId} target="/payandSettle/creditApplication/quotaMenage/history" isEdit />
  )
}

export default QuotaMenageApply
