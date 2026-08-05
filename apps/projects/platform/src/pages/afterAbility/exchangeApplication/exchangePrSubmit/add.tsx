import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import ExchangeForm from './components/ExchangeForm'

const AddExchange: React.FC = () => {
  const { orderId, orderType, data } = usePageStatus()

  return <ExchangeForm orderId={orderId} orderType={+orderType} isEdit />
}

export default AddExchange
