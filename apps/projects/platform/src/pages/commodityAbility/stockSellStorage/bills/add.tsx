import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import BillsForm from './components/BillsForm'

const AddBills: React.FC = () => {
  const {
    invoicesTypeId, // 单据类型ID
    relevanceInvoices, // 对应单据
    relevanceInvoicesId, // 单据id，可能是待新增销售发货单，待新增采购入库单跳转过来的
    source = 2,
  } = usePageStatus()

  return (
    <BillsForm
      invoicesTypeId={invoicesTypeId}
      relevanceInvoices={relevanceInvoices}
      relevanceInvoicesId={relevanceInvoicesId}
      source={+source as 1 | 2}
      isEdit
    />
  )
}

export default AddBills
