import React from 'react'
import AddQuoteForm from '../addForm'
import { useQuery, getCurrentRouter, useLocation } from '@linkseeks/router-core'
import { postTradeProductQuotationAdd } from '@apps/apis'
const Quote = (props: any) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  return (
    <AddQuoteForm id={id} title={getCurrentRouter(pathname)?.title} fetchRequest={postTradeProductQuotationAdd} spam />
  )
}
export default Quote
