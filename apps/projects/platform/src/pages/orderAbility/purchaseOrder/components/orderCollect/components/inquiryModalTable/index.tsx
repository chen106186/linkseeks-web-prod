import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { inquiryColumns } from '../../constant'
import { filterProductDataById } from '../productModalTable'

export interface InquiryModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
}

// 报价单弹窗
const InquiryModalTable: React.FC<InquiryModalTableProps> = (props) => {
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
      const data = await fetchOrderApi.getProductListByQuotationOrderId({
        id: item.inquiryListId,
      })

      // // 判断所选择的商品是否属于同一个工作流
      // const res = await postOrderIsWorkFlow({
      //   memberId: data[0].memberId,
      //   memberRoleId: data[0].memberRoleId,
      //   productIds: data.map(item => item.productId),
      //   orderModel: schemaAction.getFieldValue('orderModel')
      // }, { ctlType: 'none' })

      // 将询价报价单的id字段 冗余给商品列表
      // schemaAction.setFieldValue('orderProductRequests', data.map((v: any) => {
      //   v.memberId = item.offerMemberId
      //   v.memberRoleId = item.offerMemberRoleId
      //   return v
      // }))
      let newData = data.map((v: any) => {
        v.memberId = item.offerMemberId
        v.memberRoleId = item.offerMemberRoleId
        return v
      })
      // 把地址信息冗余给商品字段render
      schemaAction.setFieldValue('orderProductRequests', await filterProductDataById([], newData))
      schemaAction.setFieldValue('supplyMembersName', item.offerMemberName)
      schemaAction.setFieldValue('supplyMembersId', item.offerMemberId)
      schemaAction.setFieldValue('supplyMembersRoleId', item.offerMemberRoleId)
      // 询价单回显订单明细
      schemaAction.setFieldValue('orderThe', item.details)
    }
    confirmModal && confirmModal()
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle="选择询价报价单"
      columns={inquiryColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      // fetchTableData={async (params) => (await getTradeNotarizeEnquiryProductQuotationList({...params, externalState: 4}, {useCache: true, ttl: 10 * 1000})).data}
      rowSelection={rowSelection}
      modalType="inquiryByDefault"
      searchName="quotationNo"
      tableProps={{
        rowKey: 'id',
      }}
      {...restProps}
    />
  )
}

InquiryModalTable.defaultProps = {}

export default InquiryModalTable
