import { useEffect, useState } from 'react'

export interface MaterialsItemType {}

const useAskPurchase = ({ id }: { id?: number }) => {
  const [materials, setMaterials] = useState<MaterialsItemType[]>([])

  useEffect(() => {
    if (id) {
    }
  }, [id])

  return {
    materials,
    setMaterials,
  }
}

export default useAskPurchase
