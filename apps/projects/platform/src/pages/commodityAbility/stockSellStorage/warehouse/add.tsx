import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import WarehouseForm from './components/WarehouseForm'

const AddWarehouse: React.FC = () => {
  const { id } = usePageStatus()

  return <WarehouseForm />
}

export default AddWarehouse
