import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { RequisitiColumns } from '../../constant'
import { useIntl } from '@linkseeks/i18n'

export interface MemberModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
  productRef?: any
}

const RequisitionerTable: React.FC<MemberModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'userId' })
  const intl = useIntl()
  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  useEffect(() => {
    if (visible) {
      const memberId = schemaAction.getFieldValue('requisitionerId')
      rowSelectionCtl.setSelectedRowKeys([memberId])
    }
  }, [visible])

  const handleConfirm = () => {
    const rowItem = rowSelectionCtl.selectRow[0]
    console.log(rowItem, 'row')
    if (rowItem) {
      schemaAction.setFieldValue('requisitioner', rowItem.name)
      schemaAction.setFieldValue('requisitionerId', rowItem.userId)
    }
    confirmModal && confirmModal()
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle="选择请购人"
      columns={RequisitiColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={(params) => fetchOrderApi.getMemberUserPageList({ ...params })}
      rowSelection={rowSelection}
      modalType="requisitSchema"
      tableProps={{
        rowKey: 'userId',
      }}
      {...restProps}
    />
  )
}

RequisitionerTable.defaultProps = {}

export default RequisitionerTable
