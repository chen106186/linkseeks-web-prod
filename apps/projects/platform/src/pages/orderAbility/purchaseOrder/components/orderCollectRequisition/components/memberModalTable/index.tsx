import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { memberColumns } from '../../constant'
import { getIntl } from '@linkseeks/i18n'
import { postMemberManageLowerProviderPage } from '@apps/apis'
import { lifecyclePhaseRules } from '@/constants/order'

export interface MemberModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
  productRef?: any
}

const MemberModalTable: React.FC<MemberModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type, customKey: 'memberId' })

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
    if (rowItem) {
      schemaAction.setFieldValue('vendorRoleId', rowItem.roleId)
      schemaAction.setFieldValue('vendorMemberId', rowItem.memberId)
      schemaAction.setFieldValue('vendorMemberName', rowItem.name)
    }
    confirmModal && confirmModal()
    setVisible(false)
    if (props?.productRef) {
      props.productRef.current.rowSelectionCtl.setSelectRow([])
      props.productRef.current.rowSelectionCtl.setSelectedRowKeys([])
    }
  }

  const fetchMemberList = async (params) => {
    const res = await postMemberManageLowerProviderPage(
      {
        ...(params as any),
        current: `${params.current}`,
        pageSize: `${params.pageSize}`,
        lifeCycleStageRuleId: lifecyclePhaseRules.SUPPLIER_ORDER,
      },
      {
        ctlType: 'none',
      },
    )
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  return (
    <ModalTable
      modalTitle={getIntl().formatMessage({
        id: 'purchaseOrder.orderCollect.memberModalTable.title',
        defaultMessage: '选择供应商',
      })}
      columns={memberColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={(params) => fetchMemberList(params)}
      rowSelection={rowSelection}
      modalType="supplierByDefault"
      tableProps={{
        rowKey: 'memberId',
      }}
      resetModal={{
        destroyOnClose: true,
      }}
      {...restProps}
    />
  )
}

MemberModalTable.defaultProps = {}

export default MemberModalTable
