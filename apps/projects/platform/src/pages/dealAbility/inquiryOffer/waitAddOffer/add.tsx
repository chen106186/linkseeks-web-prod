import React from 'react'
import AddQuoteForm from './addForm'
import { useQuery, getCurrentRouter, useLocation } from '@linkseeks/router-core'
import { postTradeProductQuotationAdd } from '@apps/apis'
const AddQuote = (props: any) => {
  const { pathname } = useLocation()
  return <AddQuoteForm title={getCurrentRouter(pathname)?.title} fetchRequest={postTradeProductQuotationAdd} />
}
export default AddQuote
