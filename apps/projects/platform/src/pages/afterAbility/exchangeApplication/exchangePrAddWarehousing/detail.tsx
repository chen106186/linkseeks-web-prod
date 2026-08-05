import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ExchangePrAddWarehousingDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/exchangeApplication/exchangePrAddWarehousing" />
}

export default ExchangePrAddWarehousingDetail
