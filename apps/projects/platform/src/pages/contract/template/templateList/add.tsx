import React from 'react'
import { useQuery } from '@linkseeks/router-core'
import ContractComponents from '../addContract'

const AddContract: React.FC<{}> = () => {
  const { id } = useQuery()
  return <ContractComponents page_type={'add'} id={id} />
}

export default AddContract
