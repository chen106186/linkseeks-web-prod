import React from 'react'
import B2bOrSrmPageContent from '../components/B2bOrSrmPageContent'
import { useQuery } from '@linkseeks/router-core'
const Index: React.FC = () => {
  const query = useQuery()
  return <B2bOrSrmPageContent query={query} roleType={2} />
}

export default Index
