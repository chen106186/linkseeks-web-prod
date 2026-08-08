import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import ModalTable from '@/components/ModalTable'
import { fetchUserPage } from '../../../common/useGetTableSearchData'
import { useModalTable } from '../../model/useModalTable'
import { RequisitiColumns } from '../../constant'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
// import { useIntl } from '@linkseeks/i18n'

export interface MemberModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?: () => any
  productRef?: any
  title?: string
  callBack?: (value) => void
}

const RequisitionerTable: React.FC<MemberModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, title, callBack, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({
    type,
    customKey: 'userId',
  })
  // const intl = useIntl()
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
    /*当前选择的会员全部信息*/
    // console.log(rowItem, 'row')
    if (rowItem) {
      if (!!callBack) {
        callBack(rowItem)
      } else {
        schemaAction.setFieldValue('contactMemberName', rowItem.name)
        schemaAction.setFieldValue('chargeUserId', rowItem.userId)
        schemaAction.setFieldValue('chargeName', rowItem.name)
        schemaAction.setFieldValue('contactMemberPhone', rowItem.phone)
        schemaAction.setFieldValue('chargeAccount', rowItem.account)
        schemaAction.setFieldValue('chargeRoleName', rowItem.roleName)
      }
    }
    if (!!confirmModal) {
      confirmModal()
    }
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle={title || '选择联系人'}
      columns={RequisitiColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={(params) => fetchUserPage({ ...params })}
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
