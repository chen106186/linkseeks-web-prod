import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { memberColumns } from '../../constant'

export interface MemberModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
  productRef?: any
}

const MemberModalTable: React.FC<MemberModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'id' })

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  const handleConfirm = () => {
    const rowItem = rowSelectionCtl.selectRow[0]
    if (rowItem) {
      schemaAction.setFieldValue('supplyMembersName', rowItem.name)
      schemaAction.setFieldValue('supplyMembersId', rowItem.memberId)
      schemaAction.setFieldValue('supplyMembersRoleId', rowItem.roleId)
    }
    confirmModal && confirmModal()
    setVisible(false)
    // 清空之前可能存在的商品支付信息数据
    schemaAction.setFieldValue('orderProductRequests', [])
    schemaAction.setFieldValue('paymentInformationResponses', [])
    if (props?.productRef) {
      props.productRef.current.rowSelectionCtl.setSelectRow([])
      props.productRef.current.rowSelectionCtl.setSelectedRowKeys([])
    }
  }
  return (
    <ModalTable
      modalTitle="选择供应会员"
      columns={memberColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={(params) =>
        fetchOrderApi.getMemberListByModelType({ ...params, orderType: schemaAction.getFieldValue('orderModel') })
      }
      rowSelection={rowSelection}
      modalType="memberByDefault"
      tableProps={{
        rowKey: 'id',
      }}
      {...restProps}
    />
  )
}

MemberModalTable.defaultProps = {}

export default MemberModalTable
