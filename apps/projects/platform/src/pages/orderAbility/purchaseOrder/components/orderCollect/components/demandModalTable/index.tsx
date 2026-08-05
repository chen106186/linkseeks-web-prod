import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { inquiryColumns } from '../../../../readyAddOrder/constant'
import { filterProductDataById } from '../productModalTable'

export interface DemandModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
}

// 需求报价单弹窗
const DemandModalTable: React.FC<DemandModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type })

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  const handleConfirm = async () => {
    const item = rowSelectionCtl.selectRow[0]
    if (item) {
      schemaAction.setFieldValue('quotationNo', item.quotationNo)
      const data = await fetchOrderApi.getProductListByDemandOrderId({
        id: item.id,
      })

      // // 判断所选择的商品是否属于同一个工作流
      // const res = await postOrderIsWorkFlow({
      //   memberId: data[0].memberId,
      //   memberRoleId: data[0].memberRoleId,
      //   productIds: data.map(item => item.productId),
      //   orderModel: schemaAction.getFieldValue('orderModel')
      // }, { ctlType: 'none' })
      // console.log(res, 'res')

      // schemaAction.setFieldValue('orderProductRequests', data)
      // 把地址信息冗余给商品字段render
      schemaAction.setFieldValue('orderProductRequests', await filterProductDataById([], data))
      schemaAction.setFieldValue('supplyMembersName', item.offerMemberName)
      schemaAction.setFieldValue('supplyMembersId', item.offerMemberId)
      schemaAction.setFieldValue('supplyMembersRoleId', item.offerMemberRoleId)
      // 需求单回显订单明细
      schemaAction.setFieldValue('orderThe', item.quotationSummary)
    }
    confirmModal && confirmModal()
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle="选择需求报价单"
      columns={inquiryColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      // fetchTableData={async (params) => (await getOrderConfirmationQuotationList({...params, externalState: 5})).data}
      rowSelection={rowSelection}
      modalType="demandByDefault"
      searchName="quotationNo"
      tableProps={{
        rowKey: 'id',
      }}
      {...restProps}
    />
  )
}

DemandModalTable.defaultProps = {}

export default DemandModalTable
