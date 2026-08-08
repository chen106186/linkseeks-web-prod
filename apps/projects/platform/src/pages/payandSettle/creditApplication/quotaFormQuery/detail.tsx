import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const QuotaFormQueryDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} creditId={creditId} target="/payandSettle/creditApplication/quotaFormQuery/detail" />
}

export default QuotaFormQueryDetail
