/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-26 18:00:59
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import BillsForm from './components/BillsForm'

const EditBills: React.FC = () => {
  const {
    id,
    invoicesNo = '',
    invoicesTypeId, // 单据类型ID
    relevanceInvoices, // 对应单据
    relevanceInvoicesId, // 单据id，可能是待新增销售发货单，待新增采购入库单跳转过来的
  } = usePageStatus()

  return (
    <BillsForm
      id={id}
      invoicesNo={invoicesNo}
      invoicesTypeId={invoicesTypeId}
      relevanceInvoices={relevanceInvoices}
      relevanceInvoicesId={relevanceInvoicesId}
      isEdit
    />
  )
}

export default EditBills
