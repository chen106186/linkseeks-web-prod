import React from 'react'
import { useQuery } from '@linkseeks/router-core'
import ContractComponents from '../addContract'

const EditContract: React.FC<{}> = () => {
  const { id } = useQuery()
  return <ContractComponents page_type={'edit'} id={id} />
}

export default EditContract
