import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import ExchangeForm from './components/ExchangeForm'

const EditExchange: React.FC = () => {
  const { id } = usePageStatus()

  return <ExchangeForm id={id} isEdit />
}

export default EditExchange
