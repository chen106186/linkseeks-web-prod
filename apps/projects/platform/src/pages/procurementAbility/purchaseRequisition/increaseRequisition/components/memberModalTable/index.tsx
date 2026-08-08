import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { memberColumns } from '../../constant'
import { useIntl } from '@linkseeks/i18n'

export interface MemberModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
  productRef?: any
  setLik: any
}

const MemberModalTable: React.FC<MemberModalTableProps> = (props) => {
  const { type = 'radio', setLik, schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'memberId' })
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
      const memberId = schemaAction.getFieldValue('vendorMemberId')
      rowSelectionCtl.setSelectedRowKeys([memberId])
    }
  }, [visible])

  const handleConfirm = () => {
    const rowItem = rowSelectionCtl.selectRow[0]
    console.log(rowItem, 'row')
    if (rowItem) {
      schemaAction.setFieldValue('vendorRoleId', rowItem.roleId)
      schemaAction.setFieldValue('vendorMemberId', rowItem.memberId)
      schemaAction.setFieldValue('vendorMemberName', rowItem.name)
    }
    confirmModal && confirmModal()
    setLik(rowItem)
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle={intl.formatMessage({ id: 'purchaseRequisition.xuanzegongyinghui', defaultMessage: '选择供应会员' })}
      columns={memberColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={(params) => fetchOrderApi.getMemberListByMemberName({ ...params })}
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
