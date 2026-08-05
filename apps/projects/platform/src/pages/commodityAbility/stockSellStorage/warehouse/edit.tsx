import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import WarehouseForm from './components/WarehouseForm'

const EditWarehouse: React.FC = () => {
  const { id } = usePageStatus()

  return <WarehouseForm id={id} isEdit />
}

export default EditWarehouse
