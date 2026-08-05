import React from 'react'
import AddQuoteForm from '../addForm'
import { postTradeProductQuotationAdd } from '@apps/apis'
const Quote = (props: any) => {
  return <AddQuoteForm title={props.route.name} fetchRequest={postTradeProductQuotationAdd} spam />
}
export default Quote
