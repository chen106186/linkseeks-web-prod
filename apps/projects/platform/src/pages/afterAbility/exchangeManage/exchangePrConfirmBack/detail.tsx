import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ExchangePrConfirmBackDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/exchangeManage/exchangePrConfirmBack" />
}

export default ExchangePrConfirmBackDetail
