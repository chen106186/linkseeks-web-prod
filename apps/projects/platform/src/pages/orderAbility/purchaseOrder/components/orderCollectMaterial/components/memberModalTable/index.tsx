import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import ModalTable from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { memberColumns } from '../../constant'
import { getIntl } from '@linkseeks/i18n'

export interface MemberModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?: () => any
  productRef?: any
}

const MemberModalTable: React.FC<MemberModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({
    type,
    customKey: 'memberId',
  })

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [currentRef, rowSelectionCtl, setVisible, visible])

  useEffect(() => {
    if (visible) {
      const memberId = schemaAction.getFieldValue('vendorMemberId')
      rowSelectionCtl.setSelectedRowKeys([memberId])
    }
  }, [visible])

  const handleConfirm = () => {
    const rowItem = rowSelectionCtl.selectRow[0]
    if (rowItem) {
      schemaAction.setFieldValue('vendorRoleId', rowItem.roleId)
      schemaAction.setFieldValue('vendorMemberId', rowItem.memberId)
      schemaAction.setFieldValue('vendorMemberName', rowItem.name)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    confirmModal && confirmModal()
    setVisible(false)
    if (props?.productRef) {
      props.productRef.current.rowSelectionCtl.setSelectRow([])
      props.productRef.current.rowSelectionCtl.setSelectedRowKeys([])
    }
  }
  return (
    <ModalTable
      modalTitle={getIntl().formatMessage({
        id: 'purchaseOrder.orderCollect.memberModalTable.title',
      })}
      columns={memberColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={(params) => fetchOrderApi.getMemberListByModelType({ ...params })}
      rowSelection={rowSelection}
      modalType="memberByDefault"
      tableProps={{
        rowKey: 'memberId',
      }}
      {...restProps}
    />
  )
}

MemberModalTable.defaultProps = {}

export default MemberModalTable
