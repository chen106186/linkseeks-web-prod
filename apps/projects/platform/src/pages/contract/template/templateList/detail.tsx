import React from 'react'
import { useQuery } from '@linkseeks/router-core'
import ContractComponents from '../addContract'

const DetailsContract: React.FC<{}> = () => {
  const { id } = useQuery()
  return <ContractComponents id={id} />
}

export default DetailsContract
