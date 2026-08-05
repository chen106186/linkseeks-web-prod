import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const QuotaPr3Detail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} creditId={creditId} target="/payandSettle/creditManage/quotaPr3/history" />
}

export default QuotaPr3Detail
