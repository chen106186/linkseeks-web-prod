import React from 'react'
import { useQuery } from '@linkseeks/router-core'
import RequestSheetQueryB2bAndSrm from '../components/RequestSheetQueryB2bAndSrm'

const Index: React.FC = () => {
  const query = useQuery()
  return <RequestSheetQueryB2bAndSrm query={query} roleType={1} />
}
export default Index
