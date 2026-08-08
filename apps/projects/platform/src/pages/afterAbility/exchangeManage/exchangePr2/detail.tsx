import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ExchangePr2Detail: React.FC = () => {
  const { id } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/exchangeManage/exchangePr2" />
}

export default ExchangePr2Detail
