import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const QuotaPr1Detail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} creditId={creditId} target="/payandSettle/creditManage/quotaPr1/history" />
}

export default QuotaPr1Detail
