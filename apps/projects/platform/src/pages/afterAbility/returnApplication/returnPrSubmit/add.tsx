import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import ReturnForm from './components/ReturnForm'

const AddReturn: React.FC = () => {
  const { orderId, orderType } = usePageStatus()

  return <ReturnForm orderId={orderId} orderType={+orderType} isEdit />
}

export default AddReturn
