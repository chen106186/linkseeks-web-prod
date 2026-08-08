import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const QuotaPr2Detail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} creditId={creditId} target="/payandSettle/creditManage/quotaPr2/history" />
}

export default QuotaPr2Detail
