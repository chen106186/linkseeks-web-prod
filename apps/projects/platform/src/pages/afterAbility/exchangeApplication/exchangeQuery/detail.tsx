import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ExchangeQueryDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/exchangeApplication/exchangeQuery" />
}

export default ExchangeQueryDetail
