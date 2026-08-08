import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import ExchangeForm from './components/ExchangeForm'

const ExchangeDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <ExchangeForm id={id} />
}

export default ExchangeDetail
