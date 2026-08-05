import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ExchangePrAddDeliverDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/exchangeApplication/exchangePrAddDeliver" />
}

export default ExchangePrAddDeliverDetail
